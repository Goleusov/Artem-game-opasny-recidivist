import './style.css';
import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: 720,
    height: 1280,

    backgroundColor: '#111111',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
    },

    scene: [MenuScene, GameScene],
};

new Phaser.Game(config);
