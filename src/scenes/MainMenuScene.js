import SettingsManager from '../managers/SettingsManager.js';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#2c3e50');
        
        // Title
        this.add.text(400, 150, 'TYPING DOODLE JUMP', {
            fontSize: '48px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(400, 200, 'Learn Letters While Having Fun!', {
            fontSize: '20px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Play Button
        const playButton = this.add.text(400, 300, '🎮 PLAY GAME', {
            fontSize: '32px',
            fill: '#2ecc71',
            fontFamily: 'Arial',
            backgroundColor: '#34495e',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive();
        
        // Settings Button
        const settingsButton = this.add.text(400, 370, '⚙️ SETTINGS', {
            fontSize: '28px',
            fill: '#3498db',
            fontFamily: 'Arial',
            backgroundColor: '#34495e',
            padding: { x: 30, y: 12 }
        }).setOrigin(0.5).setInteractive();
        
        // Instructions
        this.add.text(400, 450, 'Choose between typing practice or casual jumping!', {
            fontSize: '16px',
            fill: '#bdc3c7',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Button interactions
        playButton.on('pointerover', () => playButton.setScale(1.1));
        playButton.on('pointerout', () => playButton.setScale(1));
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        settingsButton.on('pointerover', () => settingsButton.setScale(1.1));
        settingsButton.on('pointerout', () => settingsButton.setScale(1));
        settingsButton.on('pointerdown', () => {
            this.scene.start('SettingsScene');
        });
        
        // Initialize settings manager in registry
        if (!this.registry.has('settings')) {
            this.registry.set('settings', new SettingsManager());
        }
        
        console.log("🏠 Main menu loaded");
    }
}