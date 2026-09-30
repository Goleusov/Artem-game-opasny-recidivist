import Phaser from 'phaser';
import { Player } from './Player';

export class Enemy extends Phaser.GameObjects.Container {

    private sprite: Phaser.GameObjects.Sprite;
  

    private targetX: number;
    private targetY: number;

    private speed: number;

   constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player,
    speed: number
) {
        super(scene, x, y);
        
	this.speed = speed;
	
        scene.add.existing(this);

        // Запоминаем позицию игрока
        // в момент появления врага
        this.targetX = player.x;
        this.targetY = player.y;

        // -------------------------
        // Спрайт врага
        // -------------------------

        this.sprite = scene.add.sprite(
            0,
            0,
            'enemy',
            0
        );

        this.add(this.sprite);

        // -------------------------
        // Стрелка направления
        // -------------------------

        

        // Сразу выбираем нужную
        // анимацию движения
        this.updateAnimation();
    }

    update() {

        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.targetX,
            this.targetY
        );

        if (distance < 4) {

            this.x = this.targetX;
            this.y = this.targetY;

            this.destroy();

            return;
        }

        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.targetX,
            this.targetY
        );

        this.x += Math.cos(angle) * this.speed / 60;
        this.y += Math.sin(angle) * this.speed / 60;
    }

    private updateAnimation() {

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;

        if (Math.abs(dx) > Math.abs(dy)) {

            if (dx < 0) {
                this.sprite.play('enemy-left');
            } else {
                this.sprite.play('enemy-right');
            }

        } else {

            if (dy < 0) {
                this.sprite.play('enemy-up');
            } else {
                this.sprite.play('enemy-down');
            }
        }
    }
}
