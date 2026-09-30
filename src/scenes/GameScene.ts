import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { VirtualJoystick } from '../controls/VirtualJoystick';
import { Enemy } from '../entities/Enemy';
import { Bonus } from '../entities/Bonus';
import { Debuff } from '../entities/Debuff';

export class GameScene extends Phaser.Scene {

private score = 0;
private scoreText!: Phaser.GameObjects.Text;
private scoreTimer!: Phaser.Time.TimerEvent;

private bonusTimer!: Phaser.Time.TimerEvent;

private gameOverScoreText!: Phaser.GameObjects.Text;

    private player!: Player;
    private joystick!: VirtualJoystick;
    private enemies: Enemy[] = [];
    private bonuses: Bonus[] = [];
    private debuffs: Debuff[] = [];
    private debuffTimer!: Phaser.Time.TimerEvent;
    private isWobbling = false;
    private wobbleStartTime = 0;
    
    private lives = 3;
    private isInvulnerable = false;
    private gameOver = false;
    
    private livesHearts: Phaser.GameObjects.Text[] = [];

    private gameOverContainer!: Phaser.GameObjects.Container;

    private readonly GAME_WIDTH = 720;
    private readonly GAME_HEIGHT = 1280;

    private readonly ARENA_PADDING = 10;
    
    
    private readonly musicTracks = [
    '1',
    '2',
    '3',
    '4',
    '5',
];

private currentMusic?: Phaser.Sound.BaseSound;
    
    private lastMusicTrack = '';

    constructor() {
        super('GameScene');
    }

    preload() {
    this.load.spritesheet('player', '/assets/player.png', {
        frameWidth: 128,
        frameHeight: 128,
    });

    this.load.spritesheet('enemy', '/assets/enemy.png', {
        frameWidth: 128,
        frameHeight: 128,
    });
    
    this.load.image('bonus-speed-shoes', 'assets/shoes.png');
    this.load.image('bonus-speed-bmx', 'assets/bmx.png');
    
    this.load.image('bonus-life-bmw', 'assets/bmw.png');

    this.load.image('bonus-life-cat','assets/cat.png');

    this.load.image('bonus-life-sausage','assets/sausages.png');
    this.load.image('bonus-points-gun', 'assets/gun.png');
    
    this.load.image('arena-background','/assets/arena-background.png');
    
    
    this.load.image(    'debuff-cold',    'assets/Cold.png');

this.load.image(    'debuff-pepper-spray',    'assets/Pepper_spray.png');

this.load.image(    'debuff-fight',    'assets/Fight.png');

this.load.image(    'debuff-cook',    'assets/Cook.png');

	this.load.image('debuff-jim-beam','assets/Jim_beam.png');
	
	this.load.image(    'game-over-art',    '/assets/game-over-art.png');
	
	
    
}

    create() {

this.scoreText = this.add.text(
    this.GAME_WIDTH - 30,
    30,
    'СЧЁТ: 0',
    {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
    }
);

this.scoreText.setOrigin(1, 0);
this.scoreText.setScrollFactor(0);
this.scoreText.setDepth(1000);

this.startScoreTimer();

        // -------------------------
        // Жизни
        // -------------------------

        this.livesHearts = [];

for (let i = 0; i < 3; i++) {

    const heart = this.add.text(
    	30 + i * 56,
    	30,
    	'❤️',
    	{
     	   fontSize: '44px'
    	}
	);

    heart.setScrollFactor(0);
    heart.setDepth(100);

    this.livesHearts.push(heart);
}

        


        // -------------------------
        // Анимации игрока
        // -------------------------

        this.anims.create({
            key: 'player-up',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'player-down',
            frames: this.anims.generateFrameNumbers('player', {
                start: 4,
                end: 7,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'player-left',
            frames: this.anims.generateFrameNumbers('player', {
                start: 8,
                end: 11,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'player-right',
            frames: this.anims.generateFrameNumbers('player', {
                start: 12,
                end: 15,
            }),
            frameRate: 8,
            repeat: -1,
        });
        
        
        this.anims.create({
    key: 'enemy-down',
    frames: this.anims.generateFrameNumbers('enemy', {
        start: 0,
        end: 3,
    }),
    frameRate: 6,
    repeat: -1,
});

this.anims.create({
    key: 'enemy-up',
    frames: this.anims.generateFrameNumbers('enemy', {
        start: 4,
        end: 7,
    }),
    frameRate: 6,
    repeat: -1,
});

this.anims.create({
    key: 'enemy-left',
    frames: this.anims.generateFrameNumbers('enemy', {
        start: 8,
        end: 11,
    }),
    frameRate: 6,
    repeat: -1,
});

this.anims.create({
    key: 'enemy-right',
    frames: this.anims.generateFrameNumbers('enemy', {
        start: 12,
        end: 15,
    }),
    frameRate: 6,
    repeat: -1,
});


        // -------------------------
        // Арена
        // -------------------------
/*
        this.add.rectangle(
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT / 2,
            this.GAME_WIDTH,
            this.GAME_HEIGHT,
            0x202020
        );

        this.add.rectangle(
            this.GAME_WIDTH / 2,
            5,
            this.GAME_WIDTH,
            10,
            0x555555
        );

        this.add.rectangle(
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT - 5,
            this.GAME_WIDTH,
            10,
            0x555555
        );

        this.add.rectangle(
            5,
            this.GAME_HEIGHT / 2,
            10,
            this.GAME_HEIGHT,
            0x555555
        );

        this.add.rectangle(
            this.GAME_WIDTH - 5,
            this.GAME_HEIGHT / 2,
            10,
            this.GAME_HEIGHT,
            0x555555
        );
*/
this.createArena();
        // -------------------------
        // Джойстик
        // -------------------------

        this.joystick = new VirtualJoystick(this);

	this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    this.joystick.destroy();
});

        // -------------------------
        // Игрок
        // -------------------------

        this.player = new Player(
            this,
            this.GAME_WIDTH / 2,
            this.GAME_HEIGHT / 2,
            this.joystick
        );
        
        this.startBonusTimer();
        this.startDebuffTimer();
       
	this.playRandomMusic();

        // -------------------------
        // Game Over UI
        // -------------------------

        this.createGameOverUI();


        // -------------------------
        // Первый спавн
        // -------------------------

        this.time.delayedCall(2000, () => {

            if (!this.gameOver) {
                this.spawnEnemy();
                this.scheduleNextEnemy();
            }

        });
        
        
        
        
        
    }
    
    
    
    
    
    private spawnDebuff() {
    if (this.gameOver) {
        return;
    }

    // На поле уже есть дебаф
    if (this.debuffs.length > 0) {
        return;
    }

    const debuffRadius = 60;
    const minDistanceFromPlayer = 100;
    const maxAttempts = 100;

    let x = 0;
    let y = 0;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {

        x = Phaser.Math.Between(
            this.ARENA_PADDING + debuffRadius,
            this.GAME_WIDTH - this.ARENA_PADDING - debuffRadius
        );

        y = Phaser.Math.Between(
            this.ARENA_PADDING + debuffRadius,
            this.GAME_HEIGHT - this.ARENA_PADDING - debuffRadius
        );

        const distance = Phaser.Math.Distance.Between(
            x,
            y,
            this.player.x,
            this.player.y
        );

        if (distance >= minDistanceFromPlayer) {

            const types = [
    'slow',
    'minus-points',
    'cook',
    'wobble'
] as const;

            const type = Phaser.Utils.Array.GetRandom(types);

            const debuff = new Debuff(
                this,
                x,
                y,
                type
            );

            this.debuffs.push(debuff);

            // Дебаф существует максимум 7 секунд
            this.time.delayedCall(7000, () => {

                if (!debuff.active) {
                    return;
                }

                debuff.destroy();

                const index = this.debuffs.indexOf(debuff);

                if (index !== -1) {
                    this.debuffs.splice(index, 1);
                }
            });

            return;
        }
    }

    console.log('Не удалось найти место для дебафа');
}
    
    
    
    private getCurrentMusic(): Phaser.Sound.BaseSound | undefined {
    const sounds = this.sound.getAll();

    for (const sound of sounds) {
        if (sound.key.startsWith('music-')) {
            return sound;
        }
    }

    return undefined;
}
    
    
    
   private playRandomMusic() {
    const existingMusic = this.getCurrentMusic();

    if (existingMusic && existingMusic.isPlaying) {
        this.currentMusic = existingMusic;
        return;
    }

    let track = Phaser.Utils.Array.GetRandom(
        this.musicTracks
    );

    if (this.musicTracks.length > 1) {
        while (track === this.lastMusicTrack) {
            track = Phaser.Utils.Array.GetRandom(
                this.musicTracks
            );
        }
    }

    this.lastMusicTrack = track;

    const key = `music-${track}`;

    if (!this.cache.audio.exists(key)) {

        this.load.audio(
            key,
            `/assets/music/${track}.mp3`
        );

        this.load.once('complete', () => {
            this.startMusicTrack(key);
        });

        this.load.start();

        return;
    }

    this.startMusicTrack(key);
}


    
    
    
    private startMusicTrack(key: string) {
    const music = this.sound.add(
        key,
        {
            volume: 0.35,
            loop: false
        }
    );

    this.currentMusic = music;

    music.once('complete', () => {
        this.currentMusic = undefined;
        this.playRandomMusic();
    });

    music.play();
}
    
    
    private startDebuffTimer() {

    if (this.gameOver) {
        return;
    }

    const delay = Phaser.Math.Between(10000, 20000);

    this.debuffTimer = this.time.delayedCall(
        delay,
        () => {

            if (this.gameOver) {
                return;
            }

            if (this.debuffs.length === 0) {
                this.spawnDebuff();
            }

            this.startDebuffTimer();
        }
    );
}
    
    
    
    
    private checkDebuffCollisions() {

    for (let i = this.debuffs.length - 1; i >= 0; i--) {

        const debuff = this.debuffs[i];

        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            debuff.x,
            debuff.y
        );

        if (distance < 75) {

            debuff.destroy();
            this.debuffs.splice(i, 1);

            switch (debuff.type) {

		case 'wobble':

    this.showBonusText(debuff.message);

    this.isWobbling = true;
    this.wobbleStartTime = this.time.now;

    this.time.delayedCall(5000, () => {
        this.isWobbling = false;
    });

    break;




                case 'slow':

                    this.player.setSpeed(170);

                    this.showBonusText(
                        debuff.message
                    );

                    this.time.delayedCall(5000, () => {
                        this.player.resetSpeed();
                    });

                    break;


                case 'minus-points':

                    this.score -= 10;

                    // Не даём счёту уйти в минус
                    if (this.score < 0) {
                        this.score = 0;
                    }

                    this.scoreText.setText(
                        `СЧЁТ: ${this.score}`
                    );

                    this.showBonusText(
                        debuff.message
                    );

                    break;


                case 'cook':

                    // Повар ничего не делает,
                    // кроме показа сообщения
                    this.showBonusText(
                        debuff.message
                    );

                    break;
            }
        }
    }
}
    
    
    
    
   private showBonusText(message: string) {

    const text = this.add.text(
        this.GAME_WIDTH / 2,
        this.GAME_HEIGHT / 2,
        message,
        {
            fontSize: '32px',
            color: '#ffff00',
            stroke: '#ff8800',
            strokeThickness: 6,
            fontStyle: 'bold',
            align: 'center'
        }
    );

    text.setOrigin(0.5);
    text.setDepth(1000);

    this.tweens.add({
        targets: text,
        alpha: 0,
        duration: 2000,
        ease: 'Linear',
        onComplete: () => {
            text.destroy();
        }
    });
}
    
    
    
    
    
    
    private createArena() {
   // Фон арены
    const background = this.add.image(
        this.GAME_WIDTH / 2,
        this.GAME_HEIGHT / 2,
        'arena-background'
    );

    background.setDisplaySize(
        this.GAME_WIDTH,
        this.GAME_HEIGHT
    );

    background.setDepth(-20);

    // Рамка арены
    const graphics = this.add.graphics();

    // Внешняя рамка
    graphics.lineStyle(12, 0x555555, 1);
    graphics.strokeRect(
        6,
        6,
        this.GAME_WIDTH - 12,
        this.GAME_HEIGHT - 12
    );

    // Внутренняя граница
    graphics.lineStyle(4, 0x888888, 1);
    graphics.strokeRect(
        20,
        20,
        this.GAME_WIDTH - 40,
        this.GAME_HEIGHT - 40
    );

    graphics.setDepth(-10);
    
    
}
    
    
    
    
    
    
    
    
    
    
   private spawnBonus() {

    if (this.gameOver) {
        return;
    }

    const bonusRadius = 40;
    const minDistanceFromPlayer = 100;

    let x: number;
    let y: number;

    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {

        x = Phaser.Math.Between(
            this.ARENA_PADDING + bonusRadius,
            this.GAME_WIDTH - this.ARENA_PADDING - bonusRadius
        );

        y = Phaser.Math.Between(
            this.ARENA_PADDING + bonusRadius,
            this.GAME_HEIGHT - this.ARENA_PADDING - bonusRadius
        );

        const distance = Phaser.Math.Distance.Between(
            x,
            y,
            this.player.x,
            this.player.y
        );

        if (distance >= minDistanceFromPlayer) {

            const types = [
                'speed',
                'points',
                'life',
            ] as const;

            const type = Phaser.Utils.Array.GetRandom(types);

            const bonus = new Bonus(
                this,
                x,
                y,
                type
            );

            this.bonuses.push(bonus);

            return;
        }
    }

    console.log('Не удалось найти место для бонуса');
}

private updateLivesDisplay() {

    for (let i = 0; i < this.livesHearts.length; i++) {

        if (i < this.lives) {
            this.livesHearts[i].setText('❤️');
        } else {
            this.livesHearts[i].setText('🖤');
        }
    }
}


    private createGameOverUI() {

    this.gameOverContainer = this.add.container(0, 0);


    const overlay = this.add.rectangle(
        this.GAME_WIDTH / 2,
        this.GAME_HEIGHT / 2,
        this.GAME_WIDTH,
        this.GAME_HEIGHT,
        0x000000,
        0.65
    );

	const gameOverArt = this.add.image(
    this.GAME_WIDTH / 2,
    280,
    'game-over-art'
);

gameOverArt.setDisplaySize(480, 480);
gameOverArt.setDepth(10);

//this.gameOverContainer.add(gameOverArt);

    this.gameOverContainer.setDepth(2000);


    // Главная надпись
   const title = this.add.text(
    this.GAME_WIDTH / 2,
    670,
    'ОПАСНЫЙ РЕЦИДИВИСТ ПОЙМАН',
    {
        fontSize: '56px',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 8,
        wordWrap: {
            width: 650
        }
    }
).setOrigin(0.5);

    // Текст под заголовком
   const description = this.add.text(
    this.GAME_WIDTH / 2,
    850,
    'Такими темпами срок за распитие\nсделают реальным',
    {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff',
        align: 'center'
    }
).setOrigin(0.5);

    // Счёт
    this.gameOverScoreText = this.add.text(
    this.GAME_WIDTH / 2,
    970,
    `Выпито миллилитров - ${this.score}`,
    {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff',
        align: 'center'
    }
).setOrigin(0.5);

    // Кнопка
    const restartButton = this.add.text(
        this.GAME_WIDTH / 2,
        1100,
        'НАЧАТЬ ЗАНОГО',
        {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: {
                left: 30,
                right: 30,
                top: 16,
                bottom: 16,
            },
        }
    );

    restartButton.setOrigin(0.5);

    restartButton.setInteractive({
        useHandCursor: true,
    });

    restartButton.on('pointerup', () => {
        this.restartGame();
    });

    this.gameOverContainer.add([
        overlay,
        gameOverArt,
        title,
        description,
        this.gameOverScoreText,
        restartButton,
    ]);

    this.gameOverContainer.setVisible(false);
}






private startBonusTimer() {

 if (this.gameOver) {
        return;
    }
//тест
   // const delay = Phaser.Math.Between(15000, 25000);
	const delay = Phaser.Math.Between(7000, 10000);

    this.bonusTimer = this.time.delayedCall(
        delay,
        () => {

            if (this.gameOver) {
                return;
            }

            if (this.bonuses.length < 2) {
                this.spawnBonus();
            }

            this.startBonusTimer();
        }
    );
}






private checkBonusCollisions() {

    for (let i = this.bonuses.length - 1; i >= 0; i--) {

        const bonus = this.bonuses[i];

        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            bonus.x,
            bonus.y
        );

        if (distance < 50) {

            bonus.destroy();

            this.bonuses.splice(i, 1);

            switch (bonus.type) {

                case 'speed':

                    this.player.setSpeed(400);
                    
                    
  		    this.showBonusText( bonus.message );



                    console.log('Ускорение активировано!');

                    this.time.delayedCall(5000, () => {

                        this.player.resetSpeed();

                        console.log('Ускорение закончилось!');
                    });

                    break;

                case 'points':
    			this.score += 10;
    			this.scoreText.setText(`СЧЁТ: ${this.score}`);
    			this.showBonusText(bonus.message);
    			console.log('Получено +10 очков!');
    			break;

                case 'life':
		
		 this.showBonusText(bonus.message);
		
    		if (this.lives < 3) {

        		this.lives++;
			this.updateLivesUI();
        

        		console.log('Получена дополнительная жизнь!');

    		} else {
	
        	this.score += 10;

       		 this.scoreText.setText(
           	 `СЧЁТ: ${this.score}`
       		 );

        	console.log('Максимум жизней. Получено +10 очков!');

   		 }

    break;
            }
        }
    }
}

private restartGame() {

this.score = 0;
this.scoreText.setText('СЧЁТ: 0');
    // Скрываем Game Over
    this.gameOverContainer.setVisible(false);

    // Сбрасываем состояние
    this.gameOver = false;
    this.lives = 3;
    this.isInvulnerable = false;
    
    this.player.resetSpeed();
    
    this.startScoreTimer();
    
    // Обновляем жизни
    this.updateLivesUI();

    // Удаляем всех старых врагов
    for (const enemy of this.enemies) {
        enemy.destroy();
    }
    
    if (this.bonusTimer) {
    this.bonusTimer.remove();
}

    this.enemies = [];
    
    for (const bonus of this.bonuses) {
    bonus.destroy();
}

this.bonuses = [];

if (this.debuffTimer) {
    this.debuffTimer.remove();
}

for (const debuff of this.debuffs) {
    debuff.destroy();
}

this.debuffs = [];

this.startDebuffTimer();
this.startBonusTimer();

    // Возвращаем игрока в центр
    this.player.setPosition(
        this.GAME_WIDTH / 2,
        this.GAME_HEIGHT / 2
    );

    // Возвращаем направление игрока
    this.player.setFrame(4);

    // На всякий случай запускаем новый спавн врагов
    this.time.delayedCall(2000, () => {

        if (!this.gameOver) {
            this.spawnEnemy();
            this.scheduleNextEnemy();
        }

    });
}



  private scheduleNextEnemy() {

    let minDelay = 1500;
    let maxDelay = 3000;

    if (this.score >= 20) {
        minDelay = 1200;
        maxDelay = 2500;
    }

    if (this.score >= 40) {
        minDelay = 1000;
        maxDelay = 2000;
    }

    if (this.score >= 60) {
        minDelay = 700;
        maxDelay = 1500;
    }
    
    if (this.score >= 100) {
        minDelay = 500;
        maxDelay = 1000;
    }

  if (this.score >= 150) {
        minDelay = 400;
        maxDelay = 800;
    }
    
    if (this.score >= 200) {
        minDelay = 300;
        maxDelay = 700;
    }
    
    if (this.score >= 250) {
        minDelay = 250;
        maxDelay = 600;
    }

 if (this.score >= 300) {
        minDelay = 200;
        maxDelay = 500;
    }

    const delay = Phaser.Math.Between(
        minDelay,
        maxDelay
    );

    this.time.delayedCall(delay, () => {

        if (this.gameOver) {
            return;
        }

        this.spawnEnemy();

        this.scheduleNextEnemy();
    });
}

private getEnemySpeed(): number {

if (this.score >= 300) {
        return 510;
    }

if (this.score >= 250) {
        return 480;
    }

if (this.score >= 200) {
        return 450;
    }

if (this.score >= 150) {
        return 420;
    }

if (this.score >= 100) {
        return 360;
    }

    if (this.score >= 60) {
        return 300;
    }

    if (this.score >= 40) {
        return 270;
    }

    if (this.score >= 20) {
        return 240;
    }

    return 200;
}

    private spawnEnemy() {

        if (this.gameOver) {
            return;
        }

        const position = this.getRandomEnemyPosition();

        const enemy = new Enemy(
    this,
    position.x,
    position.y,
    this.player,
    this.getEnemySpeed()
);
        this.enemies.push(enemy);
    }


    private checkEnemyCollisions() {

        if (this.isInvulnerable) {
            return;
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {

            const enemy = this.enemies[i];

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                enemy.x,
                enemy.y
            );

            if (distance < 60) {

                this.takeDamage();

                enemy.destroy();

                this.enemies.splice(i, 1);

                break;
            }
        }
    }







  private updateLivesUI() {

    for (let i = 0; i < this.livesHearts.length; i++) {

        if (i < this.lives) {
            this.livesHearts[i].setText('❤️');
        } else {
            this.livesHearts[i].setText('🖤');
        }
    }
}


    private takeDamage() {

        this.lives--;

        this.updateLivesUI();

        console.log('Жизни:', this.lives);

        this.isInvulnerable = true;

        this.time.delayedCall(1000, () => {
            this.isInvulnerable = false;
        });

        if (this.lives <= 0) {
            this.showGameOver();
        }
    }
    
private startScoreTimer() {
    this.scoreTimer = this.time.addEvent({
        delay: 1000,
        callback: () => {
            if (!this.gameOver) {
                this.score++;
                this.scoreText.setText(`СЧЁТ: ${this.score}`);
            }
        },
        loop: true,
    });
}

    private showGameOver() {
	
	this.gameOverScoreText.setText(
    `Выпито миллилитров - ${this.score}`
);
	
        this.gameOver = true;
        
if (this.scoreTimer) {
    this.scoreTimer.remove(false);
}

        this.gameOverContainer.setVisible(true);

        for (const enemy of this.enemies) {
            enemy.destroy();
        }

        this.enemies = [];
        
        
    }


    private getRandomEnemyPosition(): {
        x: number;
        y: number;
    } {

        const side = Phaser.Math.Between(0, 3);

        const spawnOffset = 20;

        switch (side) {

            case 0:
                return {
                    x: Phaser.Math.Between(
                        20,
                        this.GAME_WIDTH - 20
                    ),
                    y: -spawnOffset,
                };

            case 1:
                return {
                    x: Phaser.Math.Between(
                        20,
                        this.GAME_WIDTH - 20
                    ),
                    y: this.GAME_HEIGHT + spawnOffset,
                };

            case 2:
                return {
                    x: -spawnOffset,
                    y: Phaser.Math.Between(
                        20,
                        this.GAME_HEIGHT - 20
                    ),
                };

            default:
                return {
                    x: this.GAME_WIDTH + spawnOffset,
                    y: Phaser.Math.Between(
                        20,
                        this.GAME_HEIGHT - 20
                    ),
                };
        }
    }


    update() {

        if (this.gameOver) {
            return;
        }

        this.player.update();
        
        if (this.isWobbling) {

    const elapsed = this.time.now - this.wobbleStartTime;

    const wobbleX = Math.sin(elapsed / 120) * 3;
    const wobbleY = Math.sin(elapsed / 180) * 2;

    this.player.x += wobbleX;
    this.player.y += wobbleY;
}
        

        const halfPlayer = 32;

        this.player.x = Phaser.Math.Clamp(
            this.player.x,
            this.ARENA_PADDING + halfPlayer,
            this.GAME_WIDTH - this.ARENA_PADDING - halfPlayer
        );

        this.player.y = Phaser.Math.Clamp(
            this.player.y,
            this.ARENA_PADDING + halfPlayer,
            this.GAME_HEIGHT - this.ARENA_PADDING - halfPlayer
        );


        // Обновляем врагов

        for (const enemy of this.enemies) {
            enemy.update();
        }


        // Удаляем уничтоженных врагов

        this.enemies = this.enemies.filter(
            enemy => enemy.active
        );


        // Проверяем столкновения

        this.checkEnemyCollisions();
        
        this.checkBonusCollisions();
        
        this.checkDebuffCollisions();
    }
}
