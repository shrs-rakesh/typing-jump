import Phaser from 'phaser';

// Basic scene to verify setup
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // We'll load assets here later
        console.log('Phaser is loading!');
    }

    create() {
        // Add basic text to confirm setup works
        this.add.text(400, 300, '🚀 Phaser is Working!', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(400, 350, 'Development Phase 1: Foundation', {
            fontSize: '18px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    update() {
        // Game loop will go here
    }
}

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: MainScene
};

// Create the game instance
const game = new Phaser.Game(config);

console.log('🎮 Typing Jump - Development Started!');