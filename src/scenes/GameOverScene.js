export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        console.log("💀 GameOverScene: Game ended");
        
        // Dark background
        this.cameras.main.setBackgroundColor('#2d2d2d');
        
        // Game Over text
        this.add.text(400, 200, 'GAME OVER', {
            fontSize: '64px',
            fill: '#e74c3c',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Restart instruction
        this.add.text(400, 400, 'Press SPACE to restart', {
            fontSize: '24px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Set up restart key
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    update() {
        if (this.spaceKey.isDown) {
            this.scene.start('GameScene');
        }
    }
}