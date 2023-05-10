import {Board} from "./Board.js";

export class Game {
    private _canvas;
    private _board;
    private _posX;
    private _posY;
    private _rotation;
    private _timer;
    private _paused;
    private _gameStarted;
    private _score;
    private _maxScore;
    private _scoreLabel;
    private _maxScoreLabel;
    private _speedLabel;
    private _speed;


    constructor(canvas) {
        this._canvas = canvas;
        this._board = new Board(canvas);
        this._board.drawCanvas();
        this._posX = 4;
        this._posY = 0;
        this._rotation = 0;
        this._gameStarted  = false;
        this._score = 0;
        this._maxScore = 0;
        this._speed = 4;

        let maxZeStorage = localStorage.getItem('max');
        this._maxScore = maxZeStorage ? maxZeStorage : 0;
        this._scoreLabel = document.getElementById('score');
        this._maxScoreLabel = document.getElementById('max-score');
        this._speedLabel = document.getElementById('speed');
        this._scoreLabel.innerHTML = `${this._score}`;
        this._maxScoreLabel. innerHTML = `Rekord: ${this._maxScore}`;
        this._speedLabel.innerHTML = `${this._speed - 3}`;
    }

    gameStart() {
        if (this._gameStarted) {
            return;
        }
        this._paused = false;
        this._gameStarted = true;
        let startX;
        let startY;

        this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));

        this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray')
        window.onkeydown = (event) => {
            let key = event.key;
            switch (key) {
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
            }
        }

        this._canvas.ontouchstart = (event) => {
            startX = event.changedTouches[0].clientX;
            startY = event.changedTouches[0].clientY;
        }

        document.body.ontouchmove = (event) => {
            event.preventDefault();
        }

        this._canvas.ontouchmove = (event) => {
            event.preventDefault();
            let currentX = event.changedTouches[0].clientX;
            let currentY = event.changedTouches[0].clientY;
            if (currentX - startX >= 20) {
                this.moveRight();
                startX = currentX;
            } else if (currentX - startX <= -20) {
                this.moveLeft();
                startX = currentX;
            }

            if (currentY - startY >= 20) {
                this.moveDown();
                startY = currentY;
            }
        }

        this._canvas.ontouchend = (event) => {
            event.preventDefault();
            let currentX = event.changedTouches[0].clientX;
            if ((currentX - startX) == 0) {
                this.rotate();
            }
        }
    }

    private moveLeft() {
        if (this._paused) {
            return;
        }
        let shape = this._board._block.getShape(this._rotation);
        let collision = false;

        for (let j = 0; j < shape.length; j++) {
            for (let i = 0; i < shape.length; i++) {
                if (shape[j][i] && this._board._board[this._posY + j][this._posX + i - 1]) {
                    collision = true;
                }
            }
        }

        if (!collision) {
            this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'white');
            this._posX -= 1;
            if (this._posX < -1) {
                this._posX = -1;
            } else if (this._posX == -1) {
                for (let i = 0; i < shape.length; i++) {
                    if (shape[i][0]) {
                        this._posX = 0;
                        break;
                    }
                }
            }
            this._board.drawCanvas();
            this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray');
        }

    }

    private moveRight() {
        if (this._paused) {
            return;
        }

        let shape = this._board._block.getShape(this._rotation);

        let collision = false;

        for (let j = 0; j < shape.length; j++) {
            for (let i = 0; i < shape.length; i++) {
                if (shape[j][i] && this._board._board[this._posY + j][this._posX + i + 1]) {
                    collision = true;
                }
            }
        }

        if (!collision) {
            this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'white');

            if (this._posX < (10 - shape.length)) {
                this._posX += 1;
            } else if (this._posX < 10) {
                this._posX += 1;
                for (let i = 0; i < shape.length; i++) {
                    if (shape[i][10 - this._posX]) {
                        this._posX -= 1;
                        break;
                    }
                }
            }
            this._board.drawCanvas();
            this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray');
        }
    }

    private rotate() {
        if (this._paused) {
            return;
        }

        let shape = this._board._block.getShape(this._rotation);

        let simRotation = this._rotation + 1;
        if (simRotation == 4) {
            simRotation = 0;
        }

        let shapeRot = this._board._block.getShape(simRotation);

        let collision = false;

        for (let j = 0; j < shapeRot.length; j++) {
            for (let i = 0; i < shapeRot.length; i++) {
                if (shapeRot[j][i] && this._board._board[this._posY + j][this._posX + i]) {
                    collision = true;
                }
            }
        }

        if (!collision) {
            this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'white');
            this._rotation += 1;
            if (this._rotation == 4) {
                this._rotation = 0;
            }
            if (this._posX == -1) {
                this._posX = 0;
            }

            if ((this._posX + shape.length) > 10) {
                this._posX = 10 - shape.length;
            }

            this._board.drawCanvas();
            this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray');
        }
    }

    private moveDown = () => {
        if (this._paused) {
            return;
        }

        let shape = this._board._block.getShape(this._rotation);
        this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'white');
        let collision = false;

        //kontrola kolize s kostkou nebo dnem
        for (let j = 0; j < shape.length; j++) {
            for (let i = 0; i < shape.length; i++) {
                if (shape[j][i] && this._board._board[this._posY + j + 1][this._posX + i]) {
                    collision = true;
                }
            }
        }

        if (collision) {
            this._score += 1;

            this._board.placeBlock(this._posX, this._posY, shape, this._rotation);

            // kontrola zaplneni rad, umazani plnych, pridani shora prazdne
            let fullLines = 0;
            for (let j = 0; j < shape.length; j++) {
                let hole = false;
                let emptyLine = [];
                for (let i = 0; i < 10; i++) {
                    emptyLine.push(0);
                   if (!this._board._board[this._posY + j][i]) {
                       hole = true;
                   }
                }
                if (!hole && (this._posY + j < 20)) {
                    this._board._board.splice(this._posY + j,1);
                    this._board._board.unshift(emptyLine);
                    fullLines += 1;
                }
            }

            switch (fullLines) {
                case 1:
                    this._score += 10;
                    break;
                case 2:
                    this._score += 40;
                    break;
                case 3:
                    this._score += 90;
                    break;
                case 4:
                    this._score += 160;
                    break;
            }

            if (this._score >= 100 && this._score < 200 && this._speed < 5) {
                this._speed = 5;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            } else if (this._score >= 200 && this._score < 400 && this._speed < 6) {
                this._speed = 6 ;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            } else if (this._score >= 400 && this._score < 800 && this._speed < 7) {
                this._speed = 7 ;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            } else if (this._score >= 800 && this._score < 1600 && this._speed < 8) {
                this._speed = 8 ;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            } else if (this._score >= 1600 && this._score < 3200 && this._speed < 9) {
                this._speed = 9;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            } else if (this._score >= 3200 && this._score < 6400 && this._speed < 10) {
                this._speed = 10;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            } else if (this._score >= 6400 && this._speed < 11) {
                this._speed = 11;
                clearInterval(this._timer);
                this._timer = setInterval(this.moveDown, 500 / (this._speed / 4));
            }
            this._speedLabel.innerHTML = `${this._speed - 3}`;

            this._board.createBlock();
            this._rotation = Math.floor(Math.random() * 4);


            if (this._posY == 0) {
                alert(`Konec hry. Dosažené skóre ${this._score}.`);
                this._scoreLabel.innerHTML = `${this._score}`;
                this.gameStop(false);
                return;
            }

            this._posX = 4;
            this._posY = 0;
        }
        else {
            this._posY += 1;
        }

        this._scoreLabel.innerHTML = `${this._score}`;
        this._board.drawCanvas();
        this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray');
    }

    gamePause() {
        if (this._gameStarted) {
            clearInterval(this._timer);
            this._paused = true;
            this._gameStarted = false;
        }
    }

    gameStop(hlaska) {
        if (this._gameStarted) {
            clearInterval(this._timer);
            let konec = false;
            if (hlaska) {
                if (confirm('Opravdu chceš skončit hru?')) {
                    konec = true;
                }
            } else {
                konec = true;
            }

            if (konec) {
                this._posX = 4;
                this._posY = 0;
                for (let j = 0; j < 20; j++) {
                    for (let i = 0; i < 10; i++) {
                        this._board._board[j][i] = 0;
                    }
                }
                if (this._maxScore < this._score) {
                    this._maxScore = this._score;
                    localStorage.setItem('max', this._maxScore);
                    this._maxScoreLabel. innerHTML = `Rekord: ${this._score}`;
                }
                this._score = 0;
                this._speed = 4;
                this._scoreLabel.innerHTML = `${this._score}`;
                this._speedLabel.innerHTML = `${this._speed - 3}`;
                this._paused = true;
                this._board.drawCanvas();
                this._board.createBlock();
                this._gameStarted = false;
            }
        }
    }

    clearRecord() {
        if (confirm('Opravdu chceš rekord vymazat?')) {
            this._maxScore = 0;
            localStorage.removeItem('max');
            this._maxScoreLabel. innerHTML = `Rekord: ${this._score}`;
        }
    }
}