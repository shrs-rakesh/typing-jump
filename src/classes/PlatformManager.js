export default class PlatformManager {
    constructor(scene) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.highestPlatformY = 0;
        this.platformCount = 0;
        
        console.log("🏗️ Platform Manager initialized");
    }
    
    createInitialPlatforms() {
        // Starting platform under player
        this.createPlatform(400, 550, 200);
        
        // Create initial platforms going upward - CLOSER TOGETHER
        for (let i = 1; i <= 20; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = 500 - (i * 70); // Platforms every 70 pixels (was 80)
            this.createPlatform(x, y, Phaser.Math.Between(140, 200)); // Wider platforms
        }
        
        console.log("📊 Created initial platforms");
    }
    
    createPlatform(x, y, width = 200) {
        const platform = this.platforms.create(x, y, 'platform');
        platform.setDisplaySize(width, 32);
        platform.refreshBody();
        
        // Track the highest (lowest Y value) platform
        this.highestPlatformY = Math.min(this.highestPlatformY, y);
        this.platformCount++;
        
        return platform;
    }
    
    createRandomPlatform(targetY) {
        const x = Phaser.Math.Between(100, 700);
        const width = Phaser.Math.Between(120, 200);
        return this.createPlatform(x, targetY, width);
    }
    
    update(cameraY) {
        // Generate new platforms when player goes high enough
        const generateThreshold = cameraY - 300; // Generate sooner (was 400)
        
        if (this.highestPlatformY > generateThreshold) {
            const newY = this.highestPlatformY - Phaser.Math.Between(60, 90); // Closer platforms
            this.createRandomPlatform(newY);
        }
        
        // Clean up platforms far below camera
        this.cleanupPlatforms(cameraY);
    }
    
    cleanupPlatforms(cameraY) {
        this.platforms.getChildren().forEach(platform => {
            // Remove platforms that are far below the camera
            if (platform.y > cameraY + 800) {
                platform.destroy();
                this.platformCount--;
            }
        });
    }
    
    getPlatformCount() {
        return this.platformCount;
    }
}