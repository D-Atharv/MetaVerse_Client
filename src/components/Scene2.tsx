class Scene2 extends Phaser.Scene {
    private background!: Phaser.GameObjects.Image; // Declare background as a class property
    private ship!: Phaser.GameObjects.Image; // Declare ship as a class property

    constructor() {
        super("playGame");
    }

    create() {
        // Retrieve the background image using the key "background"
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0); // Set the origin to the top-left

        // Use this.scale to get the game dimensions
        const { width, height } = this.scale


        // this.ship = this.add.image(100, 100, "ship");
        // this.ship.setOrigin(0, 0);
        this.ship = this.add.image(width / 2, height / 2, "ship");
        this.ship.setOrigin(0.5, 0.5); // Center the ship

        this.add.text(20, 20, "playingGame", {
            font: "25px Arial",
            color: "yellow"
        });
    }
}

export default Scene2;
