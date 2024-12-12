class Scene2 extends Phaser.Scene {
    private background!: Phaser.GameObjects.Image; // Declare background as a class property
    private ship!: Phaser.GameObjects.Image; // Declare ship as a class property
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Declare cursors as a class property

    constructor() {
        super("playGame");
    }

    create() {

        // Use this.scale to get the game dimensions
        const { width, height } = this.scale;

        // Add the background image and make it responsive
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0); // Set the origin to the top-left
        this.background.setDisplaySize(width, height); // Resize to match window size

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
        const speed = 6;

        // Movement logic with boundary constraints
        const shipHalfWidth = this.ship.displayWidth / 2;
        const shipHalfHeight = this.ship.displayHeight / 2;

        // Calculate boundaries
        const leftBoundary = 0 + shipHalfWidth;
        const rightBoundary = this.background.displayWidth - shipHalfWidth;
        const topBoundary = 0 + shipHalfHeight;
        const bottomBoundary = this.background.displayHeight - shipHalfHeight;

        // Move the ship based on cursor input and enforce boundaries
        if (this.cursors.left?.isDown && this.ship.x > leftBoundary) {
            this.ship.x -= speed;
        }
        if (this.cursors.right?.isDown && this.ship.x < rightBoundary) {
            this.ship.x += speed;
        }
        if (this.cursors.up?.isDown && this.ship.y > topBoundary) {
            this.ship.y -= speed;
        }
        if (this.cursors.down?.isDown && this.ship.y < bottomBoundary) {
            this.ship.y += speed;
        }
    }

    //handle window size dynamically
    handleResize(gameSize: Phaser.Structs.Size) {
        const { width, height } = gameSize;

        // Resize the background to fit the new window size
        this.background.setDisplaySize(width, height);
    }
}

export default Scene2;

