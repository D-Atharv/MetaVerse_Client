import Phaser from "phaser";
import background from "../assets/1.png"
import ship from "../assets/ship.png"
class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        // Load the background image with a key
        this.load.image("background", background);
        this.load.image("ship",ship)
    }
    create() {
        this.add.text(20, 20, "Loading game...");
        this.time.delayedCall(1000, () => {
            this.scene.start("playGame");
        })
    }
}

export default Scene1;