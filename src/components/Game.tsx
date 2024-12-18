import Phaser from "phaser";
import Scene1 from "../phaser/scenes/Scene1";
import Scene2 from "../phaser/scenes/Scene2";
import { useEffect } from "react";
import { useSocket } from "../../@hooks/useSocket";

//TODO -> added console.log and useEffect for debugging purposes. Remove them later

const Game = () => {
    const { sendMessage, isConnected } = useSocket();

    useEffect(() => {
        if (isConnected) {
            console.log("Sending test message...");
            sendMessage("Hello from Client!");
        }
    }, [isConnected, sendMessage]);

    useEffect(() => {
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
