export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        console.log("🎮 BootScene: Starting game...");
        
        // Display loading text
        this.add.text(400, 300, 'Loading...', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
    
    create() {
        console.log("✅ BootScene: Complete! Starting Main Menu...");
        
        // Start the main menu after a brief delay
        this.time.delayedCall(1000, () => {
            this.scene.start('MainMenuScene');
        });
    }
}