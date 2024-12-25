import Phaser from "phaser";
import BaseScene from "./BaseScene";
import { createFloor } from "../floor/Floor";
import { createWalls } from "../walls/Walls";
import Ship from "../characters/Characters";
import WebSocketManager, { WebSocketEvent } from "../../../@Sockets/WebSocketManager";
import { SHIP_SPEED } from "../../utils/constants";
import { decodeJWT, getCookie } from "../../utils/jwt";

export default class Scene2 extends BaseScene {
    private ship!: Ship;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private walls!: Phaser.Physics.Arcade.StaticGroup;
    private otherShips: { [userID: string]: Ship } = {};
    private isConnected: boolean = false;
    private userID: string | null = null;

    private lastSentPosition: { x: number; y: number } | null = null;
    private lastSentTime: number = 0;
    private throttleDelay: number = 100; // Throttle delay in ms

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
                this.showProximityAlert(message.alerts);
            }
            else if (message.event === "disconnect") {
                this.handleDisconnect(message.data.user_id);
            } else {
                console.error("Unknown WebSocket event:", message.event);
            }
        });
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

    private showProximityAlert(alerts: string[]) {
        const invalidAlerts: string[] = [];
        alerts.forEach((userID) => {
            const otherShip = this.otherShips[userID];
            if (!otherShip) {
                console.error(`Proximity alert for unknown user: ${userID}`);
                invalidAlerts.push(userID);
                return;
            }

            const dx = this.ship.x - otherShip.x;
            const dy = this.ship.y - otherShip.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared > 2500) { // Assuming ProximityThreshold = 50
                console.warn(`Invalid proximity alert: ${userID} is no longer nearby.`);
                invalidAlerts.push(userID);
                return;
            }

            console.log(`Proximity alert: You are near user ${userID}`);
        });

        if (invalidAlerts.length > 0) {
            console.warn(`Invalid proximity alerts detected for users: ${invalidAlerts.join(", ")}`);
        }
    }

    private handleDisconnect(userID: string) {
        if (this.otherShips[userID]) {
            console.log(`Removing ship for disconnected user: ${userID}`);
            this.otherShips[userID].destroy();
            delete this.otherShips[userID];
        } else {
            console.warn(`Attempted to remove non-existent user: ${userID}`);
        }
    }

}