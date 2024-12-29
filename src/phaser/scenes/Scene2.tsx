import Phaser from "phaser";
import BaseScene from "./BaseScene";
import { createFloor } from "../floor/Floor";
import { createWalls } from "../walls/Walls";
import Ship from "../characters/Characters";
import WebSocketManager, { WebSocketEvent } from "../../../@Sockets/WebSocketManager";
import { SHIP_SPEED } from "../../utils/constants";
import { decodeJWT, getCookie } from "../../utils/jwt";
import PeerService from "../../../@webRTC/WebRTCManager";
import VideoManager from "../../../@webRTC/VideoManager";
import ProximityAlertManager from "../../utils/proximityAlert";

export default class Scene2 extends BaseScene {
    private ship!: Ship;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private walls!: Phaser.Physics.Arcade.StaticGroup;
    private otherShips: { [userID: string]: Ship } = {};
    private proximityAlertManager!: ProximityAlertManager; // Declare ProximityAlertManager
    private isConnected: boolean = false;
    private userID: string | null = null;

    private lastSentPosition: { x: number; y: number } | null = null;
    private lastSentTime: number = 0;
    private throttleDelay: number = 100; // Throttle delay in ms

    // webRTC
    private peerService: PeerService | null = null;
    private videoManager!: VideoManager;

    private activeCalls: Set<string> = new Set();
    private currentCallPeer: string | null = null;

    constructor() {
        super("playGame");
    }

    create() {
        const { width, height } = this.scale;

        const token = getCookie("token");
        if (token) {
            const decoded = decodeJWT(token);
            this.userID = decoded?.username || null;
        }

        if (!this.userID) {
            console.error("User ID not found. Ensure the user is authenticated.");
            return;
        }

        // Create the floor
        createFloor(this, width, height, "floor", "floorSprite");

        // Create walls with physics
        this.walls = createWalls(this, "verticalWalls", "sideWalls");

        // Create the player's ship
        this.ship = new Ship(this, width / 2, height / 2, "ship", SHIP_SPEED);
        this.ship.setScale(3);
        this.ship.setDepth(1);
        this.physics.add.collider(this.ship, this.walls);

        // Setup keyboard input
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Initialize ProximityAlertManager
        this.proximityAlertManager = new ProximityAlertManager(this.ship, this.otherShips);

        // Initialize WebSocket connection
        const wsManager = WebSocketManager.getInstance();
        wsManager.connect(import.meta.env.VITE_WS_URL as string);

        // Listen for WebSocket connection changes
        wsManager.onConnectionChange((isConnected) => {
            this.isConnected = isConnected;

            if (isConnected && this.userID !== null) {
                wsManager.sendMessage({
                    event: "register",
                    data: { user_id: this.userID },
                });
            }
        });

        // Listen for incoming WebSocket messages
        wsManager.onMessage((message: WebSocketEvent) => {
            if (message.event === "positions") {
                console.log("Incoming positions data:", message.positions);
                if (!message.positions || !Array.isArray(message.positions)) {
                    console.error("Invalid positions data received:", message.positions);
                    return;
                }

                // Normalize and process positions
                const normalizedPositions = message.positions.map((position) => {
                    if (!position.user_id) {
                        console.error("Position data missing user_id:", position);
                        return { userID: undefined, x: 0, y: 0 };
                    }

                    return {
                        userID: position.user_id,
                        x: position.x || 0,
                        y: position.y || 0,
                    };
                });

                this.updateOtherShips(normalizedPositions);
            } else if (message.event === "proximity_alert") {
                this.proximityAlertManager.handleProximityAlerts(message.alerts); // Use ProximityAlertManager
            } else if (message.event === "disconnect") {
                this.handleDisconnect(message.data.user_id);
            } else if (message.event === "video_call_prompt") {
                this.showVideoCallPrompt(message.data.from, message.data.to);
            } else {
                console.error("Unknown WebSocket event:", message.event);
            }
        });

        // Initialize video elements
        this.initializeWebRTC();
    }

    update() {
        if (this.ship && this.cursors) {
            this.ship.move(this.cursors);

            if (this.isConnected) {
                const currentPosition = { x: this.ship.x, y: this.ship.y };
                const currentTime = Date.now();

                const hasPositionChanged =
                    !this.lastSentPosition ||
                    this.lastSentPosition.x !== currentPosition.x ||
                    this.lastSentPosition.y !== currentPosition.y;

                const isThrottled = currentTime - this.lastSentTime < this.throttleDelay;

                if (hasPositionChanged && !isThrottled) {
                    WebSocketManager.getInstance().sendMessage({ 
                        event: "movement",
                        data: {
                            user_id: this.userID!,
                            ...currentPosition,
                        },
                    });

                    this.lastSentPosition = currentPosition;
                    this.lastSentTime = currentTime;

                    console.log("Movement sent:", currentPosition);
                }
            }
        }
    }

    private updateOtherShips(positions: { userID: string | undefined; x: number; y: number }[]) {
        const activeUserIDs: string[] = [];

        positions.forEach(({ userID, x, y }) => {
            if (!userID) {
                console.error("Invalid userID detected in positions:", { userID, x, y });
                return;
            }

            activeUserIDs.push(userID);

            if (userID !== this.userID) {
                if (!this.otherShips[userID]) {
                    console.log(`Creating new ship for user: ${userID}`);
                    this.otherShips[userID] = new Ship(this, x, y, "ship", SHIP_SPEED);
                    this.otherShips[userID].setScale(3);
                    this.otherShips[userID].setDepth(1);
                    this.physics.add.collider(this.otherShips[userID], this.walls);
                } else {
                    this.otherShips[userID].setPosition(x, y);
                }
            }
        });

        Object.keys(this.otherShips).forEach((userID) => {
            if (!activeUserIDs.includes(userID)) {
                console.log(`Removing ship for disconnected user: ${userID}`);
                this.otherShips[userID].destroy();
                delete this.otherShips[userID];
            }
        });
    }

    private initializeWebRTC() {
        this.videoManager = new VideoManager();

        this.peerService = new PeerService((remoteStream) => {
            this.videoManager.setRemoteStream(remoteStream);
        });

        this.peerService.setOnCallEndCallback(() => {
            this.clearActiveCallState();
        });

        this.peerService.initialize(this.userID!).catch(console.error);
        this.setupUserMedia().catch(console.error);
    }

    private async setupUserMedia(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            this.videoManager.setLocalStream(stream);
            this.peerService?.setLocalStream(stream);
        } catch (error) {
            console.error("Failed to access user media:", error);
        }
    }

    private showVideoCallPrompt(fromUser: string, toUser: string): void {
        if (toUser !== this.userID && fromUser !== this.userID) {
            return;
        }

        const otherUser = fromUser === this.userID ? toUser : fromUser;

        if (this.activeCalls.has(this.userID!) || this.activeCalls.has(otherUser)) {
            console.log(`Call already active with ${otherUser}`);
            return;
        }

        const confirmCall = confirm(`User ${otherUser} is nearby. Start a video call?`);
        if (confirmCall) {
            this.startVideoCall(otherUser);
        }
    }

    private startVideoCall(peerToCall: string): void {
        if (!this.peerService) {
            console.error("PeerService not initialized.");
            return;
        }

        this.peerService.startCall(peerToCall);
        this.activeCalls.add(this.userID!);
        this.activeCalls.add(peerToCall);
        this.currentCallPeer = peerToCall;
    }

    private clearActiveCallState() {
        if (this.currentCallPeer) {
            this.activeCalls.delete(this.userID!);
            this.activeCalls.delete(this.currentCallPeer);
            this.currentCallPeer = null;
        }
    }

    private handleDisconnect(userID: string) {
        if (this.otherShips[userID]) {
            this.otherShips[userID].destroy();
            delete this.otherShips[userID];
        }
    }

    destroy() {
        this.peerService?.closeConnection();
        this.videoManager.destroy();
    }
}