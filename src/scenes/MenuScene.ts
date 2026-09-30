import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    private readonly GAME_WIDTH = 720;
    private readonly GAME_HEIGHT = 1280;

    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image(
            'menu-background',
            '/assets/arena-background.png'
        );
    
    this.load.image(
    'artem-menu',
    '/assets/Artem_main_menu.png'
);
    }

    create() {
        // Фон
        const background = this.add.image(
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT / 2,
            'menu-background'
        );

        background.setDisplaySize(
            this.GAME_WIDTH,
            this.GAME_HEIGHT
        );

        // Затемнение фона
        const overlay = this.add.rectangle(
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT / 2,
            this.GAME_WIDTH,
            this.GAME_HEIGHT,
            0x000000,
            0.45
        );


	const artem = this.add.image(
    this.GAME_WIDTH / 2,
    300,
    'artem-menu'
);

artem.setDisplaySize(512, 512);

	 this.add.text(
            this.GAME_WIDTH / 2,
            680,
            'АРТЕМ:\n НАКОНЕЦ-ТО ВЫХОДНОЙ',
            {
                fontSize: '50px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 8,
            }
        ).setOrigin(0.5);

        // Название
        this.add.text(
            this.GAME_WIDTH / 2,
            850,
            'ПОЧЕМУ ПОЛИЦИЯ НЕ ДАЕТ\nМНЕ ВЕСЕЛО ПРОВОДИТЬ ВРЕМЯ?',
            {
                fontSize: '35px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 8,
            }
        ).setOrigin(0.5);

        // Кнопка
        const button = this.add.text(
            this.GAME_WIDTH / 2,
            1000,
            'НАЧАТЬ ИГРУ',
            {
                fontSize: '42px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff',
                backgroundColor: '#333333',
                padding: {
                    left: 40,
                    right: 40,
                    top: 25,
                    bottom: 25
                }
            }
        ).setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            button.setStyle({
                backgroundColor: '#555555'
            });
        });

        button.on('pointerout', () => {
            button.setStyle({
                backgroundColor: '#333333'
            });
        });

        button.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Подсказка
        this.add.text(
            this.GAME_WIDTH / 2,
            1150,
            'Управление:\nджойстик или WASD',
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#dddddd',
                align: 'center'
            }
        ).setOrigin(0.5);
    }
}
