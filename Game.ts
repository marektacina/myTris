import {Board} from "./Board.js";

export class Game {
    private _canvas;
    private _board;
    private _posX;
    private _posY;
    private _rotation;

    constructor(canvas) {
        this._canvas = canvas;
        this._board = new Board(canvas);
        this._board.drawCanvas();
        this._posX = 4;
        this._posY = 0;
        this._rotation = 0;

    }

    gameStart() {
        let startX;

        setInterval(this.moveDown, 250);


        this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray')
        window.onkeydown =  (event) => {
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


        window.ontouchstart = (event) => {
           startX = event.changedTouches[0].clientX;
        }

        window.ontouchmove = (event) => {
            event.preventDefault();
        }

        window.ontouchend = (event) => {
            let currentX = event.changedTouches[0].clientX;
            if ((currentX - startX) == 0) {
                this.rotate();
            } else if ((currentX - startX) > 0) {
                this.moveRight();
            } else if ((currentX - startX) < 0) {
                this.moveLeft();
            }
        }
    }

    private moveLeft() {
        let shape = this._board._block.getShape(this._rotation);
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

    private moveRight() {
        let shape = this._board._block.getShape(this._rotation);
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

    private rotate() {
        let shape = this._board._block.getShape(this._rotation);
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

    private moveDown = () => {
        let shape = this._board._block.getShape(this._rotation);
        this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'white');
        let collision = false;


        for (let j = 0; j < shape.length; j++) {
            for (let i = 0; i < shape.length; i++) {
                if (shape[j][i] && this._board._board[this._posY + j + 1][this._posX + i]) {
                    collision = true;
                }
            }
        }

        if (collision) {
            this._board.placeBlock(this._posX, this._posY, shape, this._rotation);
            this._posY = 0;
            this._posX = 3;
            this._board.createBlock();
        }
        else {
            this._posY += 1;
        }

        this._board.drawCanvas();
        this._board.drawBlock(this._posX, this._posY, this._board._block, this._rotation, 'gray');
    }
}