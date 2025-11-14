export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Create player sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        
        // Configure physics properties
        this.sprite.setBounce(0.2); // Little bounce when landing
        this.sprite.setCollideWorldBounds(true); // Don't go outside screen
        this.sprite.setGravityY(300); // Fall downward
        
        // Store reference for easy access
        scene.player = this.sprite;
        
        console.log("🎮 Player created at:", x, y);
    }
    
    // Method to handle player movement
    update(cursors) {
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-160);
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(160);
        } else {
            this.sprite.setVelocityX(0);
        }
        
        // Allow jumping only when touching the ground
        if (cursors.up.isDown && this.isGrounded()) {
            this.sprite.setVelocityY(-330);
            console.log("🦘 JUMP! Grounded:", this.isGrounded());
        }
    }

    // check ground detection
    isGrounded() {
        return this.sprite.body.blocked.down || this.sprite.body.touching.down;
    }
    
    // Get position for other classes to use
    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }
}