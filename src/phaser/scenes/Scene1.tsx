import BaseScene from "./BaseScene";

export default class Scene1 extends BaseScene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.preloadAssets(); // Preload shared assets
    }

    create() {
        // Add a loading screen message
        this.add.text(20, 20, "Loading game...");

        // transition to the main game scene after 500ms
        this.time.delayedCall(500, () => {
            this.scene.start("playGame");
        });
    }
}
