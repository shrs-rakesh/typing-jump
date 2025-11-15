export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.settings = scene.registry.get('settings');
        this.sounds = new Map();
        
        console.log("🎵 Audio Manager initialized");
    }
    
    preload() {
        // We'll use placeholder sounds for now
        console.log("📦 Audio system ready (using placeholder sounds)");
    }
    
    playSound(key, config = {}) {
        if (!this.settings.getSettings().sound) {
            return null;
        }

        console.log(`🔊 Playing sound: ${key}`);

        // Create visual feedback instead of actual sound
        // this.createVisualFeedback(key, config);

        return {
            stop: () => console.log(`⏹️ Stopped sound: ${key}`),
            setVolume: (vol) => console.log(`🎚️ Volume set to: ${vol}`)
        };
        
        // Create placeholder sounds programmatically
        // if (!this.sounds.has(key)) {
        //     this.createPlaceholderSound(key);
        // }
        
        // const sound = this.sounds.get(key);
        
        // // Apply config
        // if (config.volume) sound.setVolume(config.volume);
        // if (config.rate) sound.setRate(config.rate);
        
        // sound.play();
        
        // return sound;
    }
    
    createPlaceholderSound(key) {
        // Create different placeholder sounds based on key
        const baseTone = this.getBaseTone(key);
        const sound = this.scene.sound.add(key);
        
        // For now, we'll use a simple approach
        // In a real game, you'd use actual audio files
        console.log(`🔊 Created placeholder sound for: ${key}`);
        
        this.sounds.set(key, sound);
        return sound;
    }
    
    getBaseTone(key) {
        // Different frequencies for different sounds
        const frequencies = {
            'jump': 523.25, // C5
            'land': 392.00, // G4
            'type_correct': 659.25, // E5
            'type_wrong': 349.23, // F4
            'game_over': 220.00, // A3
            'platform_activate': 783.99 // G5
        };
        
        return frequencies[key] || 440.00; // A4 default
    }
    
    isSoundEnabled() {
        return this.settings.getSettings().sound;
    }

    createVisualFeedback(key, config) {
        const cameraY = this.scene.cameras.main.scrollY;
        const x = Phaser.Math.Between(100, 700);
        const y = cameraY + 150;
        
        let symbol = '♪';
        let color = '#ffffff';
        
        // Different symbols and colors for different sounds
        switch(key) {
            case 'jump':
                symbol = '🦘';
                color = '#3498db';
                break;
            case 'land':
                symbol = '👣';
                color = '#2ecc71';
                break;
            case 'type_correct':
                symbol = '✅';
                color = '#00ff00';
                break;
            case 'type_wrong':
                symbol = '❌';
                color = '#ff0000';
                break;
            case 'game_over':
                symbol = '💀';
                color = '#e74c3c';
                break;
            case 'platform_activate':
                symbol = '🔵';
                color = '#3498db';
                break;
        }
        
        // Create visual feedback
        const feedback = this.scene.add.text(x, y, symbol, {
            fontSize: '24px',
            fill: color,
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Animate the feedback
        this.scene.tweens.add({
            targets: feedback,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                feedback.destroy();
            }
        });
    }
    
    setSoundEnabled(enabled) {
        this.settings.settings.sound = enabled;
        this.settings.saveSettings();
        
        if (enabled) {
            console.log("🔊 Sound enabled");
        } else {
            console.log("🔇 Sound disabled");
        }
    }
    
    // Method to test audio (for settings menu)
    playTestSound() {
        if (this.isSoundEnabled()) {
            console.log("🔊 Playing test sound");
            this.createVisualFeedback('test', {});
        }
    }
}