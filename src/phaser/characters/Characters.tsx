export default class Ship extends Phaser.Physics.Arcade.Sprite {
    private speed: number;// Encapsulate speed as a property

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        speed: number
    ) {
        super(scene, x, y, texture);
        scene.add.existing(this); // Add the ship to the scene
        scene.physics.add.existing(this); // Enable physics for the ship

        this.speed = speed; // Initialize speed
        this.setCollideWorldBounds(true); // Prevent the ship from leaving the world
    }

    public move(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        this.setVelocity(0); // Reset velocity before applying input

        if (cursors.left?.isDown) {
            this.setVelocityX(-this.speed);
        } else if (cursors.right?.isDown) {
            this.setVelocityX(this.speed);
        }

        if (cursors.up?.isDown) {
            this.setVelocityY(-this.speed);
        } else if (cursors.down?.isDown) {
            this.setVelocityY(this.speed);
        }
    }
}
