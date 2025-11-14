export default class LetterManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLetters = new Set(); // Track active letters
        this.letterPool = 'ABCD'; // Start with just 4 letters
        this.platformLetters = new Map(); // Store platform -> letter mapping
        
        console.log("🔤 Letter Manager initialized with letters:", this.letterPool);
    }
    
    assignLetterToPlatform(platform) {
        // Get a random letter from our pool
        const randomIndex = Math.floor(Math.random() * this.letterPool.length);
        const letter = this.letterPool[randomIndex];
        
        // Store the association
        this.platformLetters.set(platform, letter);
        this.currentLetters.add(letter);
        
        // Add LARGER, CLEARER text to the platform
        const letterText = this.scene.add.text(platform.x, platform.y - 25, letter, {
            fontSize: '32px', // Larger font
            fill: '#ffffff', // White text
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            stroke: '#000000', // Black outline
            strokeThickness: 8, // Thicker outline
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);
        
        // Store text with platform for easy removal
        platform.letterText = letterText;
        platform.assignedLetter = letter;
        platform.isActive = false;
        
        return letter;
    }
    
    handleKeyPress(key) {
        const uppercaseKey = key.toUpperCase();
        
        // Check if pressed key matches any current letter
        if (this.currentLetters.has(uppercaseKey)) {
            console.log(`✅ Correct key pressed: ${uppercaseKey}`);
            
            // Activate all platforms with this letter
            this.activatePlatformsWithLetter(uppercaseKey);
            
            // Remove from current letters
            this.currentLetters.delete(uppercaseKey);
            
            return true; // Correct key
        }
        
        console.log(`❌ Wrong key pressed: ${uppercaseKey}`);
        return false; // Wrong key
    }
    
    activatePlatformsWithLetter(letter) {
        this.platformLetters.forEach((platformLetter, platform) => {
            if (platformLetter === letter) {
                this.activatePlatform(platform);
            }
        });
    }
    
    activatePlatform(platform) {
        platform.isActive = true;
        
        // Visual feedback - change platform color to blue
        platform.setTint(0x3498db);
        
        // Visual feedback - make letter green
        if (platform.letterText) {
            platform.letterText.setFill('#2ecc71');
            platform.letterText.setStroke('#27ae60', 4);
        }
        
        // Particle effect (we'll add this later)
        console.log(`🔵 Activated platform with letter`);
    }
    
    removePlatform(platform) {
        // Clean up when platform is destroyed
        if (platform.letterText) {
            platform.letterText.destroy();
        }
        
        const letter = this.platformLetters.get(platform);
        if (letter) {
            this.platformLetters.delete(platform);
            // Don't remove from currentLetters - other platforms might have same letter
        }
    }
    
    // Expand letter pool as game progresses
    expandLetterPool() {
        if (this.letterPool.length < 26) {
            const nextLetter = String.fromCharCode(65 + this.letterPool.length); // A=65, B=66, etc.
            this.letterPool += nextLetter;
            console.log(`📈 Expanded letter pool to: ${this.letterPool}`);
        }
    }
    
    getCurrentLetters() {
        return Array.from(this.currentLetters).sort();
    }

    highlightPlatformsWithLetters() {
        const currentLetters = this.getCurrentLetters();
        
        this.platformLetters.forEach((letter, platform) => {
            if (currentLetters.includes(letter)) {
                // HIGHLIGHT platforms that need this letter
                platform.setTint(0xffa500); // Bright orange
                platform.setAlpha(1); // Fully visible
                
                if (platform.letterText) {
                    platform.letterText.setStyle({
                        fontSize: '36px', // Even larger
                        fill: '#ffff00', // Bright yellow
                        fontWeight: 'bold',
                        stroke: '#000000',
                        strokeThickness: 8
                    });
                }
            } else if (!platform.isActive) {
                // Dim platforms that don't need letters yet
                platform.setTint(0x444444); // Dark gray
                platform.setAlpha(0.7); // Semi-transparent
                
                if (platform.letterText) {
                    platform.letterText.setStyle({
                        fontSize: '24px',
                        fill: '#888888', // Gray text
                        stroke: '#000000',
                        strokeThickness: 4
                    });
                }
            } else {
                // Active platforms - keep them visible but not highlighted
                platform.clearTint();
                platform.setAlpha(1);
            }
        });
    }
}