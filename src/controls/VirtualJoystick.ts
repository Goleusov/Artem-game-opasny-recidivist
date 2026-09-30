import Phaser from 'phaser';

export class VirtualJoystick {
    private scene: Phaser.Scene;

    private base: Phaser.GameObjects.Arc;
    private thumb: Phaser.GameObjects.Arc;

    private pointerId: number | null = null;

    private radius = 110;

    private _x = 0;
    private _y = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        //const width = scene.scale.width;
        const height = scene.scale.height;

        // Основа джойстика
        this.base = scene.add.circle(
             150,
    height - 160,
    this.radius,
    0xffffff,
    0.18
        );

        this.base.setScrollFactor(0);
        this.base.setDepth(100);

        // Ручка джойстика
       this.thumb = scene.add.circle(
    150,
    height - 160,
    50,
    0xffffff,
    0.45
);

        this.thumb.setScrollFactor(0);
        this.thumb.setDepth(101);

        // Получаем события касания/мыши
        scene.input.on(
            'pointerdown',
            this.pointerDown,
            this
        );

        scene.input.on(
            'pointermove',
            this.pointerMove,
            this
        );

        scene.input.on(
            'pointerup',
            this.pointerUp,
            this
        );

        scene.input.on(
            'pointerupoutside',
            this.pointerUp,
            this
        );
    }

    private pointerDown(pointer: Phaser.Input.Pointer) {
        const distance = Phaser.Math.Distance.Between(
            pointer.x,
            pointer.y,
            this.base.x,
            this.base.y
        );

        if (distance <= this.radius * 1.5) {
            this.pointerId = pointer.id;

            this.updatePosition(pointer);
        }
    }

    private pointerMove(pointer: Phaser.Input.Pointer) {
        if (pointer.id !== this.pointerId) {
            return;
        }

        this.updatePosition(pointer);
    }

    private pointerUp(pointer: Phaser.Input.Pointer) {
        if (pointer.id !== this.pointerId) {
            return;
        }

        this.pointerId = null;

        this._x = 0;
        this._y = 0;

        this.thumb.setPosition(
            this.base.x,
            this.base.y
        );
    }

    private updatePosition(
        pointer: Phaser.Input.Pointer
    ) {
        let dx = pointer.x - this.base.x;
        let dy = pointer.y - this.base.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance > this.radius) {
            dx = (dx / distance) * this.radius;
            dy = (dy / distance) * this.radius;
        }

        this.thumb.setPosition(
            this.base.x + dx,
            this.base.y + dy
        );

        this._x = dx / this.radius;
        this._y = dy / this.radius;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    destroy() {
        this.base.destroy();
        this.thumb.destroy();

        this.scene.input.off(
            'pointerdown',
            this.pointerDown,
            this
        );

        this.scene.input.off(
            'pointermove',
            this.pointerMove,
            this
        );

        this.scene.input.off(
            'pointerup',
            this.pointerUp,
            this
        );

        this.scene.input.off(
            'pointerupoutside',
            this.pointerUp,
            this
        );
    }
}
