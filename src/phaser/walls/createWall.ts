// Function to create a wall and configure its physics
export function createWall(
    scene: Phaser.Scene,
    texture: string,
    position: { x: number; y: number },
    size: { width: number; height: number },
    origin: { x: number; y: number },
    scale: { x: number; y: number },
    bodyOffset: { x: number; y: number }
): Phaser.GameObjects.TileSprite {
    const wall = scene.add
        .tileSprite(position.x, position.y, size.width, size.height, texture)
        .setOrigin(origin.x, origin.y)
        .setDepth(1) // Ensure the wall renders above the floor
        .setScale(scale.x, scale.y); // Apply scaling

    // Add static physics body to the wall
    scene.physics.add.existing(wall, true);

    // Configure physics body size and offset
    const body = wall.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(wall.displayWidth, wall.displayHeight).setOffset(bodyOffset.x, bodyOffset.y);

    return wall;
}