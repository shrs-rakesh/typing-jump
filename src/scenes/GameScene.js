export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        console.log("🎯 GameScene: Creating game world...");
        
        // Set sky blue background
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // Welcome message
        this.add.text(400, 300, 'Typing Jump!', {
            fontSize: '32px',
            fill: '#2c3e50',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(400, 350, 'Phase 1: Basic Movement', {
            fontSize: '18px',
            fill: '#34495e',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(400, 450, 'Next: player and platforms!', {
            fontSize: '16px',
            fill: '#7f8c8d',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Debug coordinates
        this.debugText = this.add.text(20, 20, 'Ready for development!', {
            fontSize: '16px',
            fill: '#ffffff'
        });
    }
    
    update() {
        // Game loop - we'll add logic here tomorrow
        this.debugText.setText(`Game Running: ${Math.floor(this.time.now / 1000)}s`);
    }
}