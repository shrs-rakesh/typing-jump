import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // We'll change this later
            debug: true // Helpful for learning!
        }
    },
    scene: [BootScene, GameScene, GameOverScene]
};

// Create the game instance
const game = new Phaser.Game(config);

console.log('🚀 Typing Jump - Development Started!');