export function createWalls(
    scene: Phaser.Scene,
    verticalTexture: string,
    sideTexture: string
): Phaser.Physics.Arcade.StaticGroup {
    const { width, height } = scene.scale; // Scene dimensions
    const wallThickness = 13; // Wall thickness in pixels
    const wallScale = 3; // Scaling factor for wall textures

    // Create a static group to manage all walls with physics
    const walls = scene.physics.add.staticGroup();

    // Create top and bottom horizontal walls
    const topWall = scene.add
        .tileSprite(width / 2, wallThickness / 2, width, wallThickness, verticalTexture)
        .setOrigin(0.5) // Center the texture
        .setDepth(1) // Render above the floor
        .setScale(1, wallScale); // Scale thickness
    const bottomWall = scene.add
        .tileSprite(width / 2, height - wallThickness / 2, width, wallThickness, verticalTexture)
        .setOrigin(0.5)
        .setDepth(1)
        .setScale(1, wallScale);

    // Create left and right vertical walls
    const leftWall = scene.add
        .tileSprite(wallThickness / 2, height / 2, wallThickness, height, sideTexture)
        .setOrigin(0.5)
        .setDepth(1)
        .setScale(wallScale, 1); // Scale width
    const rightWall = scene.add
        .tileSprite(width - wallThickness / 2, height / 2, wallThickness, height, sideTexture)
        .setOrigin(0.5)
        .setDepth(1)
        .setScale(wallScale, 1);

    // Attach physics to all walls
    [topWall, bottomWall, leftWall, rightWall].forEach((wall) => {
        scene.physics.add.existing(wall, true); // Add static physics body
        const body = wall.body as Phaser.Physics.Arcade.StaticBody; // Type assertion for TypeScript
        body.setSize(wall.displayWidth, wall.displayHeight).setOffset(0, 0); // Match body to sprite size
        walls.add(wall); // Add wall to the static group
    });

    return walls; // Return the static group for collision handling
}
