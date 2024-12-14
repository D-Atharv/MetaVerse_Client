export function createFloor(
    scene: Phaser.Scene,
    width: number,
    height: number,
    textureKey: string,
    frame: string
): Phaser.GameObjects.TileSprite {

    const diagonal = Math.sqrt(width * width + height * height);// Calculate diagonal length of the screen

    const floor = scene.add.tileSprite(         // Add a tileSprite that covers the screen fully, accounting for rotation
        width / 2,  // Center of the screen horizontally
        height / 2, // Center of the screen vertically
        diagonal + 20,// Add overlap to eliminate gaps
        diagonal + 20, // Add overlap to eliminate gaps
        textureKey,
        frame // frame name from floorSprite.json
    );

    floor
        .setOrigin(0.5, 0.5) // Center origin to align with the screen
        .setAngle(45)        // Rotate the floor by 45 degrees
        .setTileScale(0.81, 0.81); // Adjust tile scaling slightly to remove gaps

    return floor;
}
