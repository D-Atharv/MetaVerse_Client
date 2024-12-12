class Scene2 extends Phaser.Scene {
    private background!: Phaser.GameObjects.Image; // Declare background as a class property
    private ship!: Phaser.GameObjects.Image; // Declare ship as a class property
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Declare cursors as a class property

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


        //setting the scale of the ship
        this.ship.setScale(3);

        //add text to display
        this.add.text(20, 20, "playingGame", {
            font: "25px Arial",
            color: "yellow"
        });


        //adding cursor keys to move ths ship
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        const speed = 5;

        if (this.cursors.left?.isDown) {
            this.ship.x -= speed;
        }
        if (this.cursors.right?.isDown) {
            this.ship.x += speed;
        }
        if (this.cursors.up?.isDown) {
            this.ship.y -= speed;
        }
        if (this.cursors.down?.isDown) {
            this.ship.y += speed;
        }
    }
}

export default Scene2;
