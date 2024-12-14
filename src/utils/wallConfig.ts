export interface WallConfig {
    texture: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    origin: { x: number; y: number };
    scale: { x: number; y: number };
    bodyOffset: { x: number; y: number };
}

export const getWallConfigs = (
    sceneWidth: number,
    sceneHeight: number,
    wallThickness: number,
    wallScale: number,
    verticalTexture: string,
    sideTexture: string
): WallConfig[] => [
    {
        texture: verticalTexture,
        position: { x: sceneWidth / 2, y: wallThickness / 2 }, // Top wall
        size: { width: sceneWidth, height: wallThickness },
        origin: { x: 0.5, y: 0.5 },
        scale: { x: 1, y: wallScale },
        bodyOffset: { x: 0, y: 0 },
    },
    {
        texture: verticalTexture,
        position: { x: sceneWidth / 2, y: sceneHeight - wallThickness / 2 }, // Bottom wall
        size: { width: sceneWidth, height: wallThickness },
        origin: { x: 0.5, y: 0.7 },
        scale: { x: 1, y: wallScale },
        bodyOffset: { x: 0, y: wallThickness * 0.6 },
    },
    {
        texture: sideTexture,
        position: { x: wallThickness / 2, y: sceneHeight / 2 }, // Left wall
        size: { width: wallThickness, height: sceneHeight },
        origin: { x: 0.5, y: 0.5 },
        scale: { x: wallScale, y: 1 },
        bodyOffset: { x: wallThickness * 0.01, y: 0 },
    },
    {
        texture: sideTexture,
        position: { x: sceneWidth - wallThickness / 2, y: sceneHeight / 2 }, // Right wall
        size: { width: wallThickness, height: sceneHeight },
        origin: { x: 0.7, y: 0.5 },
        scale: { x: wallScale, y: 1 },
        bodyOffset: { x: wallThickness * 0.6, y: 0 },
    },
];
