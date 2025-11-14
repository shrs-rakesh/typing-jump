export default class SettingsManager {
    constructor() {
        // super({ key: 'MainMenuScene' }); // CALL SUPER FIRST!
        this.settings = {
            controls: 'typing',
            difficulty: 'easy',
            sound: true,
            music: true
        };
    }
    
    loadSettings() {
        const saved = localStorage.getItem('doodleJumpSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                console.log("⚙️ Loaded saved settings:", this.settings);
            } catch (e) {
                console.warn("❌ Failed to load settings, using defaults");
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('doodleJumpSettings', JSON.stringify(this.settings));
        console.log("💾 Saved settings:", this.settings);
    }
    
    setControlType(type) {
        if (['typing', 'arrows'].includes(type)) {
            this.settings.controls = type;
            this.saveSettings();
            console.log(`🎮 Control type set to: ${type}`);
        }
    }
    
    getControlType() {
        return this.settings.controls;
    }
    
    setDifficulty(level) {
        if (['easy', 'medium', 'hard'].includes(level)) {
            this.settings.difficulty = level;
            this.saveSettings();
            console.log(`🎯 Difficulty set to: ${level}`);
        }
    }
    
    getDifficulty() {
        return this.settings.difficulty;
    }
    
    toggleSound() {
        this.settings.sound = !this.settings.sound;
        this.saveSettings();
        return this.settings.sound;
    }
    
    toggleMusic() {
        this.settings.music = !this.settings.music;
        this.saveSettings();
        return this.settings.music;
    }
    
    getSettings() {
        return { ...this.settings }; // Return copy
    }
}