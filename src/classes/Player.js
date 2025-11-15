export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Create player sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        
        // Jump style physics
        this.sprite.setBounce(0.3);
        this.sprite.setCollideWorldBounds(false);
        this.sprite.setGravityY(800);
        
        // Player properties
        this.moveSpeed = 200;
        this.jumpForce = -650;
        
        // Add drag for better stopping
        this.sprite.setDragX(600); // This stops sliding!

        this.scene = scene;
        
        console.log("🎮 Player created with proper physics");
    }
    
    update(cursors) {
        // Horizontal movement - DIRECT CONTROL
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-this.moveSpeed);
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(this.moveSpeed);
        } else {
            // INSTANT STOP - no sliding
            this.sprite.setVelocityX(0);
        }
        
        // Jumping
        if (cursors.up.isDown && this.isGrounded()) {
            this.sprite.setVelocityY(this.jumpForce);
            console.log("🦘 JUMP! Force:", this.jumpForce);

            // PLAY JUMP SOUND
            if (this.scene.audioManager) {
                this.scene.audioManager.playSound('jump', { volume: 0.5 });
            }
            
            console.log("🦘 JUMP!");
        }
    }
    
    isGrounded() {
        return this.sprite.body.touching.down || this.sprite.body.blocked.down;
    }
    
    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }
    
    getScreenY(cameraY) {
        return this.sprite.y - cameraY;
    }
}