import { useEffect, useState } from "react";
import WebSocketManager from "../../@Sockets/WebSocketManager";
import Scene1 from "../phaser/scenes/Scene1";
import Scene2 from "../phaser/scenes/Scene2";

//TODO -> added console.log and useEffect for debugging purposes. Remove them later

const Game = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Monitor WebSocket connection status
        const wsManager = WebSocketManager.getInstance();
        wsManager.onConnectionChange(setIsConnected);
        wsManager.onConnectionChange((isConnected) => {
            console.log("Connection Status:", isConnected);
        });

        // Initialize Phaser Game
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO, // Automatically choose WebGL or Canvas renderer
            width: window.innerWidth, // Use full window width
            height: window.innerHeight, // Use full window height
            backgroundColor: 0x000000, // Black background
            parent: "phaser-game", // Attach Phaser game canvas to the div
            scene: [Scene1, Scene2], // Register the scenes
            physics: {
                default: "arcade", // Enable Arcade Physics
                arcade: {
                    // debug: true, // Enable debugging (optional)
                    gravity: { x: 0, y: 0 }, // No gravity (for a top-down game)
                },
            },
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <>
            <div id="phaser-game"></div>
            <p>WebSocket Connection Status: {isConnected ? "Connected" : "Disconnected"}</p>
        </>
    );
};

export default Game;
