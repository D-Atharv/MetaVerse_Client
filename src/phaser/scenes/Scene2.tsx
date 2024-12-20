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

    constructor() {
        super("playGame");
    }

    create() {
        const { width, height } = this.scale;

        // Create floor tiles
        createFloor(this, width, height, "floor", "floorSprite");

        // Create static walls with physics
        this.walls = createWalls(this, "verticalWalls", "sideWalls");

        // Create the ship and add physics
        this.ship = new Ship(this, width / 2, height / 2, "ship", SHIP_SPEED);
        this.ship.setScale(3);// Scale the ship to make it larger
        this.ship.setDepth(1);// Ensure the ship is above other elements

        // Enable collisions between the ship and walls
        this.physics.add.collider(this.ship, this.walls);

        // Enable keyboard input for the ship's movement
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Connect WebSocket
        const wsManager = WebSocketManager.getInstance();
        wsManager.connect(import.meta.env.VITE_WS_URL as string);
    }

    update() {
        if (this.ship && this.cursors) {
            this.ship.move(this.cursors);// Move the ship based on input

            // Send ship position over WebSocket
            const coordinates = { x: this.ship.x, y: this.ship.y };
            WebSocketManager.getInstance().sendMessage({
                event: "movement",
                data: coordinates,
            });
        }
    }
}
