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

            if (isConnected) {
                if (this.userID !== null) {
                    wsManager.sendMessage({
                        event: "register",
                        data: { user_id: this.userID },
                    });
                }
            }
        });

        // Listen for incoming WebSocket messages
        wsManager.onMessage((message: WebSocketEvent) => {
            if (message.event === "positions") {
                console.log("Incoming positions data:", message.positions); //TODO-> remove later
                if (!message.positions || !Array.isArray(message.positions)) {
                    console.error("Invalid positions data received:", message.positions);
                    return;
                }
                this.updateOtherShips(message.positions);
            }
        });

    }

    update() {
        if (this.ship && this.cursors) {
            this.ship.move(this.cursors);

            if (this.isConnected) {
                const coordinates = { x: this.ship.x, y: this.ship.y };
                WebSocketManager.getInstance().sendMessage({
                    event: "movement",
                    data: {
                        user_id: this.userID!,
                        ...coordinates,
                    },
                });
            }
        }
    }
    private updateOtherShips(positions: { userID: string; x: number; y: number }[]) {
        positions.forEach(({ userID, x, y }) => {
            if (userID !== this.userID) { // Skip the current user's ship
                if (!this.otherShips[userID]) {
                    // Create a new ship for this user if it doesn't exist
                    this.otherShips[userID] = new Ship(this, x, y, "ship", SHIP_SPEED);
                    this.otherShips[userID].setScale(3);
                    this.otherShips[userID].setDepth(1);
                    this.physics.add.collider(this.otherShips[userID], this.walls);
                } else {
                    // Update position of the existing ship
                    this.otherShips[userID].setPosition(x, y);
                }
            }
        });
    }


}
