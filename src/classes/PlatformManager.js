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
        this.createPlatform(400, 550, 250);
        
        // Create initial platforms going upward - CLOSER TOGETHER
        for (let i = 1; i <= 25; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = 500 - (i * 65); // Platforms every 70 pixels (was 80)
            const width = Phaser.Math.Between(160, 220);
            this.createPlatform(x, y, width); // Wider platforms
        }
        
        console.log("📊 Created initial platforms");
    }
    
    createPlatform(x, y, width = 200) {
        // Ensure platform stays within game bounds
        const safeX = Phaser.Math.Clamp(x, width/2, 800 - width/2);
        const safeY = Phaser.Math.Clamp(y, 50, 550); // Keep away from edges
        
        const platform = this.platforms.create(x, y, 'platform');
        platform.setDisplaySize(width, 32);
        platform.refreshBody();
        
        // Assign a letter only if letterManager exists (typing mode)
        if (this.letterManager) {
            this.letterManager.assignLetterToPlatform(platform);
            platform.isActive = false; // Start inactive in typing mode
        } else {
            // Arrow mode - platform is always active
            platform.isActive = true;
            platform.setTint(0x3498db); // Blue for active
        }
        
        // Track the highest platform
        this.highestPlatformY = Math.min(this.highestPlatformY, y);
        this.platformCount++;
        
        return platform;
    }
    
    createRandomPlatform(targetY) {
        const x = Phaser.Math.Between(50, 750);
        const width = Phaser.Math.Between(160, 220);
        return this.createPlatform(x, targetY, width);
    }
    
    update(cameraY) {
        // Generate new platforms when player goes high enough
        const generateThreshold = cameraY - 250; // Generate sooner (was 400)
        
        if (this.highestPlatformY > generateThreshold) {
            const newY = this.highestPlatformY - Phaser.Math.Between(50, 80); // Closer platforms
            this.createRandomPlatform(newY);
            console.log("🆕 Generated new platform at Y:", newY);
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