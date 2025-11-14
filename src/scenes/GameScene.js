import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload() {
        // We'll load real images later - using placeholder for now
        console.log("📦 GameScene: Preloading assets...");
    }
    
    create() {
        console.log("🎯 GameScene: Creating game world...");
        
        // Set sky background
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // Initialize input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create player - using placeholder graphics
        this.createPlayerPlaceholder();
        
        // Create some test platforms
        this.createTestPlatforms();
        
        // Set up collisions
        this.physics.add.collider(this.player.sprite, this.platforms);
        
        // UI
        this.setupUI();
        
        console.log("✅ GameScene: Setup complete!");
    }
    
    createPlayerPlaceholder() {
        // Create a red rectangle as temporary player graphic
        const graphics = this.add.graphics();
        graphics.fillStyle(0xff0000, 1); // Red color
        graphics.fillRect(0, 0, 32, 32); // 32x32 rectangle
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
        
        // Now create the actual player with our texture
        this.player = new Player(this, 100, 450);
    }
    
    createTestPlatforms() {
        // Create platforms group
        this.platforms = this.physics.add.staticGroup();
        
        // Create ground platform
        const ground = this.platforms.create(400, 568, 'platform');
        ground.setScale(8, 2).refreshBody(); // Make it wide
        
        // Create some floating platforms
        this.platforms.create(600, 400, 'platform');
        this.platforms.create(300, 250, 'platform');
        this.platforms.create(500, 150, 'platform');
        
        // Create platform graphics placeholder
        this.createPlatformPlaceholder();
    }
    
    createPlatformPlaceholder() {
        // Create green rectangle for platforms
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00ff00, 1); // Green color
        graphics.fillRect(0, 0, 200, 32); // Platform shape
        graphics.generateTexture('platform', 200, 32);
        graphics.destroy();
    }
    
    setupUI() {
        // Debug information
        this.debugText = this.add.text(20, 20, 'Use Arrow Keys to move!', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000'
        }).setScrollFactor(0); // Stays fixed on screen
        
        // Instructions
        this.add.text(400, 50, '← → to move, ↑ to jump', {
            fontSize: '18px',
            fill: '#2c3e50',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScrollFactor(0);
    }
    
    update() {
        // Update player movement
        this.player.update(this.cursors);
        const body = this.player.sprite.body;
        
        // Update debug info
        const pos = this.player.getPosition();
        this.debugText.setText([
            `Player: X:${Math.round(pos.x)} Y:${Math.round(pos.y)}`,
            `Velocity: X:${Math.round(body.velocity.x)} Y:${Math.round(body.velocity.y)}`,
            `Touching: DOWN:${body.touching.down} | UP:${body.touching.up}`,
            `Blocked: DOWN:${body.blocked.down} | UP:${body.blocked.up}`,
            `Grounded: ${this.player.isGrounded()}`,
            'Press UP ARROW to jump when grounded'
        ]);

        // Visual debug: Flash when grounded
        if (this.player.isGrounded()) {
            this.player.sprite.setTint(0x00ff00); // Green when grounded
        } else {
            this.player.sprite.setTint(0xff0000); // Red when in air
        }
    }
}