export function createWalls(
    scene: Phaser.Scene,
    verticalTexture: string, 
    sideTexture: string 
): void {
    const { width, height } = scene.scale; // Get the width and height of the scene

    const wallThickness = 15; // Thickness of the walls in pixels
    const wallScale = 3; // Scale factor to make the textures appear thicker

    // Add horizontal walls (top and bottom)
    /*
        The top and bottom walls span the entire width of the scene.
        The texture is scaled vertically to adjust the wall thickness.
        - Top wall is positioned at the top of the scene.
        - Bottom wall is positioned at the bottom of the scene.
    */
    scene.add
        .tileSprite(width / 2, wallThickness / 2, width, wallThickness, verticalTexture)
        .setOrigin(0.5, 0.5)
        .setScale(1, wallScale);

    scene.add
        .tileSprite(width / 2, height - wallThickness / 2, width, wallThickness, verticalTexture)
        .setOrigin(0.5, 0.5)
        .setScale(1, wallScale);

    // Add vertical walls (left and right)
    /*
        The left and right walls span the entire height of the scene.
        The texture is scaled horizontally to adjust the wall thickness.
        - Left wall is positioned on the far-left edge.
        - Right wall is positioned on the far-right edge.
    */
    scene.add
        .tileSprite(wallThickness / 2, height / 2, wallThickness, height, sideTexture)
        .setOrigin(0.5, 0.5)
        .setScale(wallScale, 1);

    scene.add
        .tileSprite(width - wallThickness / 2, height / 2, wallThickness, height, sideTexture)
        .setOrigin(0.5, 0.5)
        .setScale(wallScale, 1);
}
