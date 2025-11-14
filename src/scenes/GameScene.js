import Player from '../classes/Player.js';
import PlatformManager from '../classes/PlatformManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload() {
        console.log("📦 Preloading Doodle Jump assets...");
    }
    
    create() {
        console.log("🎯 Starting Doodle Jump game...");
        
        // Game state
        this.score = 0;
        this.isGameOver = false;
        
        // Set sky background
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // Initialize input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create temporary graphics
        this.createPlaceholderGraphics();
        
        // Create game systems
        this.platformManager = new PlatformManager(this);
        this.platformManager.createInitialPlatforms();
        
        // Create player - start near bottom
        this.player = new Player(this, 400, 500);
        
        // Set up collisions
        this.physics.add.collider(this.player.sprite, this.platformManager.platforms);
        
        // Camera setup for Doodle Jump
        this.setupCamera();
        
        // UI
        this.setupUI();
        
        console.log("✅ Doodle Jump game ready!");
    }
    
    createPlaceholderGraphics() {
        // Player graphic (red square)
        let graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
        
        // Platform graphic (green rectangle)
        graphics = this.add.graphics();
        graphics.fillStyle(0x00aa00, 1);
        graphics.fillRect(0, 0, 200, 24);
        graphics.generateTexture('platform', 200, 24);
        graphics.destroy();
    }
    
    setupCamera() {
        // Camera follows player vertically only
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setFollowOffset(0, 100); // Look ahead upward
        
        // Set deadzone - camera moves when player goes above this point
        this.cameras.main.setDeadzone(0, 200);
        
        // Don't follow horizontally - let player move left/right freely
        this.cameras.main.setLerp(1, 1); // No smoothing for testing
    }
    
    setupUI() {
        // Score display (fixed on screen)
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0);
        
        // Debug info
        this.debugText = this.add.text(20, 60, 'Debug Info', {
            fontSize: '14px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0);
        
        // Instructions
        this.add.text(400, 30, '← → to move, ↑ to jump\nReach the top!', {
            fontSize: '16px',
            fill: '#2c3e50',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
    }
    
    update() {
        if (this.isGameOver) return;
        
        // Update player
        this.player.update(this.cursors);
        
        // Update platforms (generate new ones as needed)
        this.platformManager.update(this.cameras.main.scrollY);
        
        // Update score based on how high player has gone
        this.updateScore();
        
        // Check game over condition
        this.checkGameOver();

        // Check game over with visual warning
        this.checkGameOverWithWarning();
        
        // Update UI
        this.updateUI();
    }
    
    updateScore() {
        // Score = how far up the player has gone (negative Y)
        const heightScore = Math.max(0, Math.floor(-this.player.sprite.y / 10));
        this.score = Math.max(this.score, heightScore);
    }
    
    checkGameOver() {
        // Game over if player falls too far below camera
        const cameraBottom = this.cameras.main.scrollY + 600;
        
        if (this.player.sprite.y > cameraBottom + 100) {
            this.gameOver();
        }
    }
    
    gameOver() {
        this.isGameOver = true;
        console.log("💀 Game Over! Score:", this.score);
        
        // Add game over effect
        this.cameras.main.shake(300, 0.01);
        
        // Transition to game over scene after shake
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }
    
    updateUI() {
        const cameraY = this.cameras.main.scrollY;
        const playerScreenY = this.player.getScreenY(cameraY);
        
        this.scoreText.setText(`Score: ${this.score}`);
        
        this.debugText.setText([
            `Player Screen Y: ${Math.round(playerScreenY)}`,
            `Camera Y: ${Math.round(cameraY)}`,
            `Platforms: ${this.platformManager.getPlatformCount()}`,
            `Highest Platform: ${Math.round(this.platformManager.highestPlatformY)}`,
            `Grounded: ${this.player.isGrounded() ? 'YES' : 'NO'}`
        ]);
    }

    checkGameOver() {
        // Get camera position
        const cameraY = this.cameras.main.scrollY;
        const cameraBottom = cameraY + 600; // Camera Y + screen height
        
        // Game over if player falls below camera bottom + buffer
        if (this.player.sprite.y > cameraBottom + 200) {
            console.log("💀 Player fell too far! Game over.");
            this.gameOver();
        }
    }

    gameOver() {
        if (this.isGameOver) return; // Prevent multiple triggers
        
        this.isGameOver = true;
        console.log("💀 Game Over! Final Score:", this.score);
        
        // Stop player physics
        this.player.sprite.setVelocity(0, 0);
        this.player.sprite.body.enable = false;
        
        // Add game over effect
        this.cameras.main.shake(300, 0.02);
        
        // Show game over text in current scene before transitioning
        const gameOverText = this.add.text(400, 300, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Transition to game over scene after delay
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }

    checkGameOverWithWarning() {
        const cameraY = this.cameras.main.scrollY;
        const cameraBottom = cameraY + 600;
        const playerY = this.player.sprite.y;
        
        // Warning zone - player is getting too low
        if (playerY > cameraBottom + 100) {
            // Flash red warning
            if (Math.floor(this.time.now / 200) % 2 === 0) {
                this.player.sprite.setTint(0xff0000);
            } else {
                this.player.sprite.clearTint();
            }
        } else {
            this.player.sprite.clearTint();
        }
        
        // Actual game over
        if (playerY > cameraBottom + 200) {
            console.log("💀 Player fell too far! Game over.");
            this.gameOver();
        }
    }
}