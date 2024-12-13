import BaseScene from "./BaseScene";
import { SHIP_SPEED } from "../utils/constants";

export default class Scene2 extends BaseScene {
    private ship!: Phaser.GameObjects.Image;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("playGame");
    }

    create() {
        const { width, height } = this.scale; // Get dynamic game dimensions

        // Add the player ship in the center of the screen
        this.ship = this.add.image(width / 2, height / 2, "ship").setOrigin(0.5, 0.5);
        this.ship.setScale(3); // Scale the ship to make it larger

        // Add a debug message to display
        this.add.text(20, 20, "playingGame", {
            font: "25px Arial",
            color: "yellow",
        });

        // Enable keyboard input for the ship's movement
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Create floor tiles
        this.createFloor();
    }

    createFloor() {
        const { width, height } = this.scale;

        // Calculate diagonal length of the screen
        const diagonal = Math.sqrt(width * width + height * height);

        // Add a tileSprite that covers the screen fully, accounting for rotation
        const floor = this.add.tileSprite(
            width / 2, // Center of the screen horizontally
            height / 2, // Center of the screen vertically
            diagonal + 20, // Add overlap to eliminate gaps
            diagonal + 20, // Add overlap to eliminate gaps
            "floor",
            "floorSprite" // frame name from floorSprite.json
        )
            .setOrigin(0.5, 0.5) // Center origin to align with the screen
            .setAngle(45); // Rotate the floor by 45 degrees

        // Adjust tile scaling slightly to remove gaps
        floor.setTileScale(0.61, 0.21); // Adjust this as needed
        // floor.setTileScale(0.51, 0.51); 
    }

    update() {
        const shipHalfWidth = this.ship.displayWidth / 2;
        const shipHalfHeight = this.ship.displayHeight / 2;

        // Calculate boundaries based on scene dimensions
        const leftBoundary = 0 + shipHalfWidth;
        const rightBoundary = this.scale.width - shipHalfWidth;
        const topBoundary = 0 + shipHalfHeight;
        const bottomBoundary = this.scale.height - shipHalfHeight;

        // Move the ship based on cursor input and enforce boundaries
        if (this.cursors.left?.isDown && this.ship.x > leftBoundary) {
            this.ship.x -= SHIP_SPEED;
        }
        if (this.cursors.right?.isDown && this.ship.x < rightBoundary) {
            this.ship.x += SHIP_SPEED;
        }
        if (this.cursors.up?.isDown && this.ship.y > topBoundary) {
            this.ship.y -= SHIP_SPEED;
        }
        if (this.cursors.down?.isDown && this.ship.y < bottomBoundary) {
            this.ship.y += SHIP_SPEED;
        }
    }
}
