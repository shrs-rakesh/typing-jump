import Player from '../classes/Player.js';
import PlatformManager from '../classes/PlatformManager.js';
import LetterManager from '../classes/LetterManager.js';
import SettingsManager from '../managers/SettingsManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Initialize properties to avoid undefined errors
        this.score = 0;
        this.isGameOver = false;
        this.typedCorrectly = 0;
        this.typedWrong = 0;
        this.controlType = 'typing'; // Default
    }
    
    preload() {
        console.log("📦 Preloading Doodle Jump assets...");
    }
    
    create() {
        console.log("🎯 Starting Typing Doodle Jump...");
        
        // Reset game state
        this.score = 0;
        this.isGameOver = false;
        this.typedCorrectly = 0;
        this.typedWrong = 0;
        
        // Set sky background
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // Get settings - ensure registry has settings
        if (!this.registry.has('settings')) {
            console.log("⚙️ No settings found, creating default...");
            this.registry.set('settings', new SettingsManager());
        }
        this.settings = this.registry.get('settings');
        this.controlType = this.settings.getControlType();
        
        console.log(`🎮 Starting game with controls: ${this.controlType}`);
        
        // Create placeholder graphics FIRST
        this.createPlaceholderGraphics();
        
        // Initialize game systems based on control type
        this.initializeGameSystems();
        
        // Set up input
        this.setupInput();
        
        // Set up collisions
        this.setupCollisions();
        
        // Camera setup
        this.setupCamera();
        
        // UI setup
        this.setupUI();

        if (this.controlType === 'typing') {
            this.createKeyboardDisplay();
        }
        
        console.log("✅ Game setup complete!");
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
        this.cameras.main.setFollowOffset(0, 150); // Look further ahead upward
        
        // Set deadzone - camera moves when player goes above this point
        this.cameras.main.setDeadzone(0, 100); // Smaller deadzone for faster following
        
        // Smoother camera following
        this.cameras.main.setLerp(0.1, 0.1);
        
        console.log("📷 Camera setup for better platform jumping");
    }
    
    setupUI() {
        // Clear any existing UI groups
        if (this.uiGroup) {
            this.uiGroup.destroy();
        }
        
        // Create a UI group to manage all UI elements
        this.uiGroup = this.add.group();
        
        // Score display (top left)
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0);
        this.uiGroup.add(this.scoreText);

        // Mode indicator (top center)
        this.modeText = this.add.text(400, 20, `Mode: ${this.controlType.toUpperCase()}`, {
            fontSize: '16px',
            fill: this.controlType === 'typing' ? '#ffff00' : '#3498db',
            fontFamily: 'Arial',
            backgroundColor: '#2c3e50',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0);
        this.uiGroup.add(this.modeText);

        // Current letters to type (below score - MORE SPACE)
        this.lettersText = this.add.text(20, 60, 'Loading...', {
            fontSize: '18px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            backgroundColor: '#2c3e50',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0);
        this.uiGroup.add(this.lettersText);

        // Stats/accuracy (below letters)
        this.statsText = this.add.text(20, 100, 'Accuracy: 100%', {
            fontSize: '16px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            backgroundColor: '#2c3e50',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0);
        this.uiGroup.add(this.statsText);

        // Instructions (top right - won't overlap with left side)
        const instructions = this.controlType === 'typing' 
            ? 'Type letters to activate platforms!\n← → Move\n↑ Jump'
            : 'All platforms active!\n← → Move\n↑ Jump';
            
        this.instructionsText = this.add.text(650, 20, instructions, {
            fontSize: '14px',
            fill: '#2c3e50',
            fontFamily: 'Arial',
            align: 'right',
            lineSpacing: 5
        }).setOrigin(1, 0).setScrollFactor(0); // Right-aligned
        this.uiGroup.add(this.instructionsText);

        console.log("📊 UI setup complete - no overlapping");
    }
    
    update() {
        if (this.isGameOver) return;
        
        // Safety check for player
        if (!this.player || !this.player.sprite) {
            console.warn("⚠️ Player not initialized yet");
            return;
        }
        
        // Update player movement
        this.player.update(this.cursors);
        
        // Update platforms
        if (this.platformManager) {
            this.platformManager.update(this.cameras.main.scrollY);
        }
        
        // Update score based on height
        this.updateScore();
        
        // Expand letter pool as player progresses (typing mode only)
        if (this.controlType === 'typing' && this.letterManager && this.score > 0 && this.score % 100 === 0) {
            this.letterManager.expandLetterPool();
        }
        
        // Check game over with visual warning
        this.checkGameOverWithWarning();
        this.checkGameOver();
        
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
        // Update score (always)
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${this.score}`);
        }
        
        // Update mode indicator
        if (this.modeText) {
            this.modeText.setText(`Mode: ${this.controlType.toUpperCase()}`);
            this.modeText.setFill(this.controlType === 'typing' ? '#ffff00' : '#3498db');
        }
        
        // Update based on control type
        if (this.controlType === 'typing') {
            this.updateTypingModeUI();
        } else {
            this.updateArrowModeUI();
        }
        
        // Update keyboard display if it exists
        if (this.controlType === 'typing') {
            this.updateKeyboardDisplay();
        }

        // ADD DEBUG INFO TEMPORARILY
        if (this.debugText) {
            const cameraY = this.cameras.main.scrollY;
            const playerScreenY = this.player.getScreenY(cameraY);
            const velocityY = this.player.sprite.body.velocity.y;
            
            this.debugText.setText([
                `Screen Y: ${Math.round(playerScreenY)}`,
                `Velocity Y: ${Math.round(velocityY)}`,
                `Grounded: ${this.player.isGrounded() ? 'YES' : 'NO'}`,
                `Jump Force: ${this.player.jumpForce}`
            ]);
        }
    }

    updateTypingModeUI() {
        if (this.letterManager) {
            const currentLetters = this.letterManager.getCurrentLetters();
            
            if (this.lettersText) {
                if (currentLetters.length > 0) {
                    // Show letters with nice formatting
                    const lettersString = currentLetters.map(letter => 
                        `[color=#ffff00][b]${letter}[/b][/color]`
                    ).join('  ');
                    
                    this.lettersText.setText(`Type: ${lettersString}`);
                    this.lettersText.setBackgroundColor('#e74c3c'); // Red background for attention
                } else {
                    this.lettersText.setText('All platforms active!');
                    this.lettersText.setBackgroundColor('#2ecc71'); // Green when all done
                }
            }
            
            if (this.statsText) {
                const totalTyped = this.typedCorrectly + this.typedWrong;
                const accuracy = totalTyped > 0 ? Math.round((this.typedCorrectly / totalTyped) * 100) : 100;
                this.statsText.setText(`Accuracy: ${accuracy}% (${this.typedCorrectly}/${totalTyped})`);
                
                // Color code accuracy
                if (accuracy >= 80) {
                    this.statsText.setFill('#00ff00');
                } else if (accuracy >= 60) {
                    this.statsText.setFill('#ffff00');
                } else {
                    this.statsText.setFill('#ff0000');
                }
            }
        }
    }

    updateArrowModeUI() {
        if (this.lettersText) {
            this.lettersText.setText('Arrow Mode Active');
            this.lettersText.setBackgroundColor('#3498db'); // Blue for arrow mode
        }
        
        if (this.statsText) {
            this.statsText.setText('Focus on jumping high!');
            this.statsText.setFill('#3498db');
        }
    }

    updateKeyboardDisplay() {
        if (this.letterManager && this.keyboardDisplay && this.activeKeysText) {
            const currentLetters = this.letterManager.getCurrentLetters();
            
            if (currentLetters.length > 0) {
                this.keyboardDisplay.setText(`Type the highlighted letters!`);
                this.activeKeysText.setText(`Need: ${currentLetters.join(' ')}`);
                
                // Pulse effect to draw attention
                const pulse = Math.sin(this.time.now * 0.01) * 0.2 + 1;
                this.keyboardDisplay.setScale(pulse);
            } else {
                this.keyboardDisplay.setText('Great! All platforms active!');
                this.activeKeysText.setText('Keep jumping!');
                this.keyboardDisplay.setScale(1);
            }
        }
    }

    checkGameOver() {
        const cameraY = this.cameras.main.scrollY;
        const cameraBottom = cameraY + 600; // Camera Y + screen height
        
        // BETTER GAME OVER DETECTION
        const playerScreenY = this.player.getScreenY(cameraY);
        
        // Game over if player falls too far below the visible screen
        if (playerScreenY > 700) { // 100 pixels below screen bottom
            console.log("💀 Game Over - Player fell too far!");
            console.log("Player screen Y:", playerScreenY, "Camera Y:", cameraY);
            this.gameOver();
            return;
        }
        
        // Alternative: Game over if player falls too far below camera
        if (this.player.sprite.y > cameraBottom + 150) {
            console.log("💀 Game Over - Below camera!");
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
        const playerScreenY = this.player.getScreenY(cameraY);
        
        // Warning when getting close to game over
        if (playerScreenY > 600) { // At bottom of screen
            // Flash red warning
            if (Math.floor(this.time.now / 200) % 2 === 0) {
                this.player.sprite.setTint(0xff0000);
            } else {
                this.player.sprite.clearTint();
            }
        } else if (playerScreenY > 500) { // Getting low
            this.player.sprite.setTint(0xffa500); // Orange warning
        } else {
            this.player.sprite.clearTint();
        }
    }

    // Update the setupInput() method:
    setupInput() {
        // Movement keys (always available)
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Typing keys - only in typing mode
        if (this.controlType === 'typing') {
            this.input.keyboard.on('keydown', (event) => {
                if (this.isGameOver) return;
                
                if (event.key.length === 1 || event.key === ' ') {
                    const isCorrect = this.letterManager.handleKeyPress(event.key);
                    
                    if (isCorrect) {
                        this.typedCorrectly++;
                        this.showKeyPressFeedback(event.key.toUpperCase(), true);
                    } else {
                        this.typedWrong++;
                        this.showKeyPressFeedback(event.key.toUpperCase(), false);
                    }
                }
            });
        }
    }

    // Update the setupCollisions() method for arrow mode:
    setupCollisions() {
        if (this.controlType === 'typing') {
            // Typing mode - check platform activation
            this.physics.add.collider(this.player.sprite, this.platformManager.platforms, 
                (player, platform) => {
                    this.handlePlatformCollision(platform);
                }
            );
        } else {
            // Arrow mode - all platforms are always active
            this.physics.add.collider(this.player.sprite, this.platformManager.platforms);
            
            // Activate all platforms immediately in arrow mode
            if (this.platformManager && this.platformManager.platforms) {
                this.platformManager.platforms.getChildren().forEach(platform => {
                    platform.isActive = true;
                    platform.setTint(0x3498db); // Make them blue
                    platform.setAlpha(1); // Ensure fully visible
                });
            }
        }
    }

    // Update the UI to show current mode:
    updateUI() {
        // Always update score text
        if (this.scoreText) {
            this.scoreText.setText(`Score: ${this.score} | Mode: ${this.controlType}`);
        }
        
        // Update letters text based on control type
        if (this.lettersText) {
            if (this.controlType === 'typing') {
                if (this.letterManager) {
                    const currentLetters = this.letterManager.getCurrentLetters();
                    
                    if (currentLetters.length > 0) {
                        // Highlight current letters with colors and formatting
                        const highlightedLetters = currentLetters.map(letter => 
                            `[color=#ffff00]${letter}[/color]`
                        ).join(' ');
                        
                        this.lettersText.setText(`Type these letters: ${highlightedLetters}`);
                        
                        // Add instructional text
                        this.lettersText.setStyle({
                            fontSize: '18px',
                            fill: '#ffffff',
                            fontFamily: 'Arial',
                            backgroundColor: '#2c3e50',
                            padding: { x: 10, y: 5 }
                        });
                    } else {
                        this.lettersText.setText('All platforms active! Keep jumping!');
                    }
                } else {
                    this.lettersText.setText('Type: Loading letters...');
                }
            } else {
                this.lettersText.setText('🎮 Arrow Mode - All platforms are active!');
                this.lettersText.setStyle({
                    fontSize: '18px',
                    fill: '#3498db',
                    fontFamily: 'Arial',
                    backgroundColor: '#2c3e50',
                    padding: { x: 10, y: 5 }
                });
            }
        }
    }

    initializeGameSystems() {
        // Initialize letter manager only if in typing mode
        if (this.controlType === 'typing') {
            this.letterManager = new LetterManager(this);
            this.platformManager = new PlatformManager(this, this.letterManager);
        } else {
            // Arrow mode - no letters needed
            this.letterManager = null;
            this.platformManager = new PlatformManager(this, null);
        }
        
        this.platformManager.createInitialPlatforms();
        
        // Create player
        this.player = new Player(this, 400, 500);
    }

    handlePlatformCollision(platform) {
        if (!platform) return;
        
        if (platform.isActive) {
            // Normal bounce on active platforms
            console.log("🟢 Landed on active platform");
        } else {
            // INACTIVE platform - player falls through!
            console.log("🔴 Hit INACTIVE platform - will fall through!");
            
            // Make platform semi-transparent to show it's inactive
            platform.setAlpha(0.6);
            
            // Temporarily disable collision so player falls through
            platform.body.checkCollision.none = true;
            
            // Re-enable collision after a moment (so player can land if activated)
            this.time.delayedCall(500, () => {
                if (platform.active && platform.body) {
                    platform.body.checkCollision.none = false;
                }
            });
        }
    }

    createKeyboardDisplay() {
        if (this.controlType !== 'typing') return;
        
        // Remove old keyboard display if it exists
        if (this.keyboardGroup) {
            this.keyboardGroup.destroy();
        }
        
        // Create a group for keyboard elements
        this.keyboardGroup = this.add.group();
        
        // Keyboard display at the bottom center
        this.keyboardDisplay = this.add.text(400, 550, 'Press letters shown above', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#e74c3c',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0);
        this.keyboardGroup.add(this.keyboardDisplay);

        // Active keys display below keyboard
        this.activeKeysText = this.add.text(400, 580, 'Active: A B C D', {
            fontSize: '14px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            backgroundColor: '#2c3e50',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0);
        this.keyboardGroup.add(this.activeKeysText);
    }

    // Update the keyboard display in updateUI
    updateKeyboardDisplay() {
        if (this.controlType === 'typing' && this.letterManager && this.keyboardDisplay && this.activeKeysText) {
            const currentLetters = this.letterManager.getCurrentLetters();
            
            if (currentLetters.length > 0) {
                this.keyboardDisplay.setText(`Type these letters: ${currentLetters.join(', ')}`);
                this.activeKeysText.setText(`Active: ${currentLetters.join(' ')}`);
                
                // Flash the display to draw attention
                if (Math.floor(this.time.now / 500) % 2 === 0) {
                    this.keyboardDisplay.setBackgroundColor('#e74c3c');
                } else {
                    this.keyboardDisplay.setBackgroundColor('#000000');
                }
            } else {
                this.keyboardDisplay.setText('All platforms active! Keep jumping!');
                this.keyboardDisplay.setBackgroundColor('#2ecc71');
                this.activeKeysText.setText('No letters needed');
            }
        }
    }

    // Add visual feedback for key presses
    showKeyPressFeedback(key, isCorrect) {
        const feedback = this.add.text(400, 500, isCorrect ? `✅ ${key}` : `❌ ${key}`, {
            fontSize: '32px',
            fill: isCorrect ? '#00ff00' : '#ff0000',
            fontFamily: 'Arial',
            backgroundColor: isCorrect ? '#006400' : '#8B0000',
            padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Animate the feedback
        this.tweens.add({
            targets: feedback,
            y: 450,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                feedback.destroy();
            }
        });
    }
    
}