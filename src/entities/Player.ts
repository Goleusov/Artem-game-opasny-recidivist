import Phaser from 'phaser';
import { VirtualJoystick } from '../controls/VirtualJoystick';

export class Player extends Phaser.GameObjects.Sprite {
    private normalSpeed = 160;
    private speed = 160;
    private joystick?: VirtualJoystick;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private keys: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };

    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

   constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    joystick?: VirtualJoystick
) {
        super(scene, x, y, 'player', 4);

	this.joystick = joystick;
	
        scene.add.existing(this);

        this.setOrigin(0.5);

        // Немного увеличиваем персонажа на экране.
        this.setDisplaySize(128, 128);

        this.cursors = scene.input.keyboard!.createCursorKeys();

        this.keys = scene.input.keyboard!.addKeys('W,A,S,D') as {
            W: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };
    }



    update() {
        let velocityX = 0;
let velocityY = 0;

if (this.joystick && 
    (this.joystick.x !== 0 || this.joystick.y !== 0)) {

    velocityX = this.joystick.x;
    velocityY = this.joystick.y;

} else {

    if (this.cursors.left.isDown || this.keys.A.isDown) {
        velocityX -= 1;
    }

    if (this.cursors.right.isDown || this.keys.D.isDown) {
        velocityX += 1;
    }

    if (this.cursors.up.isDown || this.keys.W.isDown) {
        velocityY -= 1;
    }

    if (this.cursors.down.isDown || this.keys.S.isDown) {
        velocityY += 1;
    }
}

        const length = Math.sqrt(
            velocityX * velocityX +
            velocityY * velocityY
        );

        if (length > 0) {
            velocityX /= length;
            velocityY /= length;
        }

        this.x += velocityX * this.speed / 60;
        this.y += velocityY * this.speed / 60;

        this.updateAnimation(velocityX, velocityY);
    }
    
    setSpeed(speed: number) {
    this.speed = speed;
}

resetSpeed() {
    this.speed = this.normalSpeed;
}

    private updateAnimation(
        velocityX: number,
        velocityY: number
    ) {
        // Игрок стоит.
        if (velocityX === 0 && velocityY === 0) {
            this.anims.stop();

            // Оставляем первый кадр последнего направления.
            switch (this.lastDirection) {
                case 'up':
                    this.setFrame(0);
                    break;

                case 'down':
                    this.setFrame(4);
                    break;

                case 'left':
                    this.setFrame(8);
                    break;

                case 'right':
                    this.setFrame(12);
                    break;
            }

            return;
        }

        // Приоритет вертикального направления.
        if (velocityY < 0) {
            this.lastDirection = 'up';
            this.play('player-up', true);
        }
        else if (velocityY > 0) {
            this.lastDirection = 'down';
            this.play('player-down', true);
        }
        else if (velocityX < 0) {
            this.lastDirection = 'left';
            this.play('player-left', true);
        }
        else if (velocityX > 0) {
            this.lastDirection = 'right';
            this.play('player-right', true);
        }
    }
}
