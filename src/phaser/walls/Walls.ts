import { createWall } from "./createWall";
import { getWallConfigs } from "../../utils/wallConfig";

//TODO-> create stacked walls
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

    // Get wall configurations for all sides
    const wallConfigs = getWallConfigs(
        width,
        height,
        wallThickness,
        wallScale,
        verticalTexture,
        sideTexture
    );

    // Create each wall based on configuration
    wallConfigs.forEach((config) => {
        const wall = createWall(
            scene,
            config.texture,
            config.position,
            config.size,
            config.origin,
            config.scale,
            config.bodyOffset
        );
        walls.add(wall); // Add the wall to the static group
    });

    return walls; // Return the static group for collision handling
}
