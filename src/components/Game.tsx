import Phaser from 'phaser';
import Scene1 from './Scene1';
import Scene2 from './Scene2';
import { useEffect } from 'react';

const Game = () => {

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
            parent: 'phaser-game',
            scene: [Scene1, Scene2]
        }
        // Avoid multiple Phaser instances
        const game = new Phaser.Game(config);

        // Cleanup Phaser instance when component unmounts
        return () => {
            game.destroy(true);
        };
    })

    return <div id="phaser-game"></div>;

}

export default Game
