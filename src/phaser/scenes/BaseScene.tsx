import Phaser from "phaser";
// import background from "../../assets/backgroundImage.png";
import ship from "../../assets/ship.png";
import floorSprite from "../../assets/sprites/floorSpriteSheet.png"
import floorSpriteJson from "../../assets/sprites/floorSprite.json"

export default class BaseScene extends Phaser.Scene {
    constructor(key: string) {
        super(key);
    }

    preloadAssets(): void {
        // Preload common assets
        // this.load.image("background", background);
        this.load.image("ship", ship); // TODO later change to character
        
        this.load.atlas("floor",floorSprite,floorSpriteJson)

    }
}
