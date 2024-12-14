import BaseScene from "./BaseScene";
import { SHIP_SPEED } from "../../utils/constants";
import { createFloor } from "../floor/Floor";
import Ship from "../characters/Characters";
import { createWalls } from "../walls/Walls";

export default class Scene2 extends BaseScene {
    private ship!: Ship;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("playGame");
    }

    create() {

        const { width, height } = this.scale; // Get dynamic game dimensions

        // Create floor tiles
        createFloor(this, this.scale.width, this.scale.height, "floor", "floorSprite");

        // Add walls to the edges of the screen with different textures
        createWalls(this, "verticalWalls", "sideWalls");


        // Add the player ship in the center of the screen
        this.ship = new Ship(this, width / 2, height / 2, "ship", SHIP_SPEED);
        this.ship.setScale(3); // Scale the ship to make it larger
        this.ship.setDepth(1); // Ensure ship is above the floor or we called the createFloor() first to make sure the floor is below the ship

        // Add a debug message to display
        this.add.text(20, 20, "playingGame", {
            font: "25px Arial",
            color: "yellow",
        });

        // Enable keyboard input for the ship's movement
        this.cursors = this.input.keyboard!.createCursorKeys();

    }
    update() {
        const shipHalfWidth = this.ship.displayWidth / 2;
        const shipHalfHeight = this.ship.displayHeight / 2;

        // Define movement boundaries
        const boundaries = {
            left: shipHalfWidth,
            right: this.scale.width - shipHalfWidth,
            top: shipHalfHeight,
            bottom: this.scale.height - shipHalfHeight,
        };

        // Move the ship
        this.ship.move(this.cursors, boundaries);
    }
}
