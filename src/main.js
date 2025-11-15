import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import SettingsManager from './managers/SettingsManager.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false // Turn off debug for cleaner look
        }
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    scene: [BootScene, MainMenuScene, SettingsScene, GameScene, GameOverScene]
};

// Create the game instance
const game = new Phaser.Game(config);

console.log('🚀 Typing Jump - Now with Settings!');