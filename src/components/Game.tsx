import Phaser from "phaser";
import Scene1 from "../phaser/scenes/Scene1";
import Scene2 from "../phaser/scenes/Scene2";
import { useEffect } from "react";

const Game = () => {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO, // Automatically choose WebGL or Canvas renderer
            width: window.innerWidth, // Use full window width
            height: window.innerHeight, // Use full window height
            backgroundColor: 0x000000, // Black background
            parent: "phaser-game", // Attach Phaser game canvas to the div
            scene: [Scene1, Scene2], // Register the scenes
        };

        const game = new Phaser.Game(config);

        // Clean up Phaser game instance on React component unmount
        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-game"></div>; // Create container div for the game
};

export default Game;
