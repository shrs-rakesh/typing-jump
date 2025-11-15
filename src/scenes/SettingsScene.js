import SettingsManager from '../managers/SettingsManager.js';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' }); // CALL SUPER FIRST!
    }

    loadSettings() {
        const saved = localStorage.getItem('jumpSettings');
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
        localStorage.setItem('jumpSettings', JSON.stringify(this.settings));
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
    
    create() {
        this.cameras.main.setBackgroundColor('#34495e');
        
        // Title
        this.add.text(400, 80, 'SETTINGS', {
            fontSize: '48px',
            fill: '#ecf0f1',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Get settings manager from registry or create it
        if (!this.registry.has('settings')) {
            this.registry.set('settings', new SettingsManager());
        }
        this.settings = this.registry.get('settings');
        
        // Create settings options
        this.createControlSettings();
        this.createDifficultySettings();
        this.createAudioSettings();
        this.createBackButton();
        
        console.log("⚙️ Settings scene loaded");
    }
    
    createControlSettings() {
        const currentControl = this.settings.getControlType();
        
        // Section title
        this.add.text(400, 150, 'CONTROLS', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Typing option
        this.typingOption = this.add.text(400, 190, '🔤 Typing Mode', {
            fontSize: '20px',
            fill: currentControl === 'typing' ? '#2ecc71' : '#bdc3c7',
            fontFamily: 'Arial',
            backgroundColor: currentControl === 'typing' ? '#2c3e50' : 'transparent',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        // Arrows option
        this.arrowsOption = this.add.text(400, 230, '🎮 Arrow Mode', {
            fontSize: '20px',
            fill: currentControl === 'arrows' ? '#2ecc71' : '#bdc3c7',
            fontFamily: 'Arial',
            backgroundColor: currentControl === 'arrows' ? '#2c3e50' : 'transparent',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        // Descriptions
        this.add.text(400, 260, 'Typing: Type letters to activate platforms', {
            fontSize: '14px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(400, 280, 'Arrows: All platforms are active, focus on jumping', {
            fontSize: '14px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Event listeners
        this.typingOption.on('pointerdown', () => {
            this.selectControlType('typing');
        });
        
        this.arrowsOption.on('pointerdown', () => {
            this.selectControlType('arrows');
        });
    }
    
    selectControlType(type) {
        this.settings.setControlType(type);
        
        // Update visual selection
        this.typingOption.setFill(type === 'typing' ? '#2ecc71' : '#bdc3c7');
        this.typingOption.setBackgroundColor(type === 'typing' ? '#2c3e50' : 'transparent');
        
        this.arrowsOption.setFill(type === 'arrows' ? '#2ecc71' : '#bdc3c7');
        this.arrowsOption.setBackgroundColor(type === 'arrows' ? '#2c3e50' : 'transparent');
        
        console.log(`✅ Control type set to: ${type}`);
    }
    
    createDifficultySettings() {
        const currentDifficulty = this.settings.getDifficulty();
        
        // Section title
        this.add.text(400, 320, 'DIFFICULTY', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const difficulties = [
            { key: 'easy', text: '😊 Easy', y: 360 },
            { key: 'medium', text: '😐 Medium', y: 400 },
            { key: 'hard', text: '😰 Hard', y: 440 }
        ];
        
        this.difficultyOptions = [];
        
        difficulties.forEach(diff => {
            const option = this.add.text(400, diff.y, diff.text, {
                fontSize: '20px',
                fill: currentDifficulty === diff.key ? '#2ecc71' : '#bdc3c7',
                fontFamily: 'Arial',
                backgroundColor: currentDifficulty === diff.key ? '#2c3e50' : 'transparent',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive();
            
            option.on('pointerdown', () => {
                this.selectDifficulty(diff.key);
            });
            
            this.difficultyOptions.push(option);
        });
    }
    
    selectDifficulty(level) {
        this.settings.setDifficulty(level);
        
        // Update all difficulty options
        this.difficultyOptions.forEach(option => {
            const isSelected = option.text.includes(
                level === 'easy' ? 'Easy' : 
                level === 'medium' ? 'Medium' : 'Hard'
            );
            
            option.setFill(isSelected ? '#2ecc71' : '#bdc3c7');
            option.setBackgroundColor(isSelected ? '#2c3e50' : 'transparent');
        });
        
        console.log(`✅ Difficulty set to: ${level}`);
    }
    
    // In SettingsScene.js, update the createAudioSettings method:
    createAudioSettings() {
        // Section title
        this.add.text(400, 490, 'AUDIO', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Sound toggle
        const soundState = this.settings.settings.sound ? 'ON 🔊' : 'OFF 🔇';
        this.soundOption = this.add.text(400, 530, `Sound: ${soundState}`, {
            fontSize: '20px',
            fill: this.settings.settings.sound ? '#2ecc71' : '#e74c3c',
            fontFamily: 'Arial',
            backgroundColor: '#2c3e50',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
        
        this.soundOption.on('pointerdown', () => {
            const newState = this.settings.toggleSound();
            const newText = newState ? 'ON 🔊' : 'OFF 🔇';
            this.soundOption.setText(`Sound: ${newText}`);
            this.soundOption.setFill(newState ? '#2ecc71' : '#e74c3c');
            
            // Play test sound when turning on
            if (newState) {
                // We could add a test sound here
                console.log("🔊 Sound enabled!");
            }
        });
    }
    
    createBackButton() {
        const backButton = this.add.text(400, 580, 'BACK TO MENU', {
            fontSize: '24px',
            fill: '#e74c3c',
            fontFamily: 'Arial',
            backgroundColor: '#2c3e50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();
        
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}