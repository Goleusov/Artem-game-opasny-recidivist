import Phaser from 'phaser';

export type DebuffType =
    | 'slow'
    | 'minus-points'
    | 'cook'
    | 'wobble';

export class Debuff extends Phaser.GameObjects.Image {
    public readonly type: DebuffType;
    public readonly message: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: DebuffType
    ) {
        const result = Debuff.getTextureAndMessage(type);

        super(
            scene,
            x,
            y,
            result.texture
        );

        this.type = type;
        this.message = result.message;

        scene.add.existing(this);

        this.setDisplaySize(240, 240);
        this.setDepth(10);
    }

    private static getTextureAndMessage(type: DebuffType): {
        texture: string;
        message: string;
    } {
        switch (type) {

		case 'wobble':

    return {
        texture: 'debuff-jim-beam',
        message: 'Jim Beam это тема\n + пошла родимая'
    };

            case 'slow':

                if (Phaser.Math.Between(0, 1) === 0) {
                    return {
                        texture: 'debuff-cold',
                        message: 'Ненавижу зиму\n- скорость'
                    };
                }

                return {
                    texture: 'debuff-pepper-spray',
                    message: 'Ай, щиплется\n- скорость'
                };


            case 'minus-points':

                return {
                    texture: 'debuff-fight',
                    message: 'В Удачный больше не поеду\n-10 очков'
                };


            case 'cook':

                return {
                    texture: 'debuff-cook',
                    message: 'Я же не умею готовить\nсегодня без бафов'
                };
        }
    }
}
