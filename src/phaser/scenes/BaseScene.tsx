import Phaser from "phaser";
import ship from "../../assets/ship.png";
import floorSprite from "../../assets/sprites/floors/floorSpriteSheet.png"
import floorSpriteJson from "../../assets/sprites/floors/floorSprite.json"
import sideWallSprite from "../../assets/sprites/walls/sideWalls.png"
import verticalWallSprite from "../../assets/sprites/walls/verticalWalls.png"

export default class BaseScene extends Phaser.Scene {
    constructor(key: string) {
        super(key);
    }

    preloadAssets(): void {
        // Preload common assets
        const images = [
            { key: "ship", path: ship }, // TODO: Replace with character later
            { key: "sideWalls", path: sideWallSprite },
            { key: "verticalWalls", path: verticalWallSprite }
        ];

        images.forEach((image) => {
            this.load.image(image.key, image.path);
        })

        // Load atlas for the floor texture
        this.load.atlas("floor", floorSprite, floorSpriteJson)
    }
}
