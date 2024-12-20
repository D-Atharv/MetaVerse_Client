import BaseScene from "./BaseScene";
import { createFloor } from "../floor/Floor";
import { createWalls } from "../walls/Walls";
import Ship from "../characters/Characters";
import WebSocketManager from "../../../@Sockets/WebSocketManager";
import { SHIP_SPEED } from "../../utils/constants";

export default class Scene2 extends BaseScene {
    private ship!: Ship;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private walls!: Phaser.Physics.Arcade.StaticGroup;
    private isConnected: boolean = false;

    constructor() {
        super("playGame");
    }

    create() {
        const { width, height } = this.scale;

        // Create the floor
        createFloor(this, width, height, "floor", "floorSprite");

        // Create walls with physics
        this.walls = createWalls(this, "verticalWalls", "sideWalls");

        // Create the ship with physics
        this.ship = new Ship(this, width / 2, height / 2, "ship", SHIP_SPEED);
        this.ship.setScale(3); // Make the ship larger
        this.ship.setDepth(1); // Ensure it appears above other elements

        // Enable collision between the ship and walls
        this.physics.add.collider(this.ship, this.walls);

        // Setup keyboard input
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Initialize WebSocket connection
        const wsManager = WebSocketManager.getInstance();
        wsManager.connect(import.meta.env.VITE_WS_URL as string);

        // Listen for WebSocket connection changes
        wsManager.onConnectionChange((isConnected) => {
            this.isConnected = isConnected;
        });
    }

    update() {
        if (this.ship && this.cursors) {
            // Move the ship based on input
            this.ship.move(this.cursors);

            // Send position to the server if WebSocket is connected
            if (this.isConnected) {
                const coordinates = { x: this.ship.x, y: this.ship.y };
                WebSocketManager.getInstance().sendMessage({
                    event: "movement",
                    data: coordinates,
                });
            }
        }
    }
}
