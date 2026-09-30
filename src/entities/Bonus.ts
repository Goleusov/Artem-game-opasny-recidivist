import Phaser from 'phaser';

export type BonusType =
    | 'speed'
    | 'points'
    | 'life';

export class Bonus extends Phaser.GameObjects.Image {

    public readonly type: BonusType;
    public readonly message: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: BonusType
    ) {
        const result = Bonus.getTextureAndMessage(type);

        super(
            scene,
            x,
            y,
            result.texture
        );

        this.type = type;
        this.message = result.message;

        scene.add.existing(this);

        if (result.texture === 'bonus-life-bmw'||
        result.texture === 'bonus-points-gun') {
    this.setDisplaySize(200, 200);
} else {
    this.setDisplaySize(160, 160);
}
        this.setDepth(10);
    }

    private static getTextureAndMessage(type: BonusType): {
        texture: string;
        message: string;
    } {

        switch (type) {

            case 'speed':

                if (Phaser.Math.Between(0, 1) === 0) {
                    return {
                        texture: 'bonus-speed-shoes',
                        message: 'Обувь начальника IT отдела\n'+
    	     '+ скорость'
                    };
                }

                return {
                    texture: 'bonus-speed-bmx',
                    message: 'Когда уже детей заведешь?\n'+
    	     '+ скорость'
                };

            case 'points':
    	return {
        	texture: 'bonus-points-gun',
       		message: 'Гроза Барнаула\n+ очки'
    	};

            case 'life':
                
                
                 const variant = Phaser.Math.Between(0, 2);

    if (variant === 0) {
return {
        texture : 'bonus-life-bmw',
        message : 'BMW это душа\n'+
    	     '+ жизнь/очки'
        };

    } else if (variant === 1) {
return {
        texture :'bonus-life-cat',
        message : 'КОТстантин поглажен\n'+
    	     '+ жизнь/очки'
};
    } else {
return {
        texture : 'bonus-life-sausage',
        message : 'Сосиски в стакане\n'+
    	     '+ жизнь/очки'
    };
        }
    }
}
}
