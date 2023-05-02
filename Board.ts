import {Block} from "./Block.js";
export class Board {
    private _board = [];
    private _CELL = 20;
    private _block;
    private _canvas;
    constructor(canvas) {
        this._canvas = canvas;
        this._block = new Block();

        for (let j = 0; j < 21; j++) {
            let line = [];
            for (let i = 0; i < 10; i++) {
                if (j < 20) {
                    line.push(0);
                } else {
                    line.push(1);
                }
            }
            this._board.push(line);
        }
    }

    createBlock() {
        this._block.createShape();
    }
    drawCanvas() {
        let context = this._canvas.getContext("2d");
        context.fillStyle = 'gray';
        //vykresleni plnych kosticek
        for (let j = 0; j < 20; j++) {
            for (let i = 0; i < 10; i++) {
                if (this._board[j][i] == 1) {
                    context.fillRect((i) * this._CELL, (j) * this._CELL, this._CELL, this._CELL);
                }
            }
        }

        //vykresleni mrizky
        context.beginPath();
        for (let i = 1; i < 20; i++) {
            context.moveTo(0, i * this._CELL);
            context.lineTo(200, i * this._CELL);
        }
        for (let i = 1; i < 10; i++) {
            context.moveTo(i * this._CELL, 0);
            context.lineTo(i * this._CELL, 400);
        }
        context.strokeStyle = 'lightgray';
        context.closePath();
        context.stroke();

    }

    placeBlock(posX, posY, block, rotation) {
        for (let j = 0; j < block.length; j++) {
            for (let i = 0; i < block.length; i++) {
                if (block[j][i]) {
                    this._board[posY + j][posX + i] = 1;
                }
            }
        }
        this.drawCanvas();
    }

    drawBlock(posX, posY, block, rotation, color) {
        let shape = block.getShape(rotation);
        let context = this._canvas.getContext("2d");
        context.fillStyle = color;


        for (let j = 0; j < shape.length; j++) {
            for (let i = 0; i < shape[j].length; i++) {
                if (shape[i][j]) {
                    context.beginPath();
                    context.moveTo((posX + j) * this._CELL, (posY + i) * this._CELL);
                    context.lineTo((posX + j) * this._CELL + this._CELL, (posY + i) * this._CELL);
                    context.lineTo((posX + j) * this._CELL + this._CELL, (posY + i) * this._CELL + this._CELL);
                    context.lineTo((posX + j) * this._CELL, (posY + i) * this._CELL + this._CELL);
                    context.lineTo((posX + j) * this._CELL, (posY + i) * this._CELL);
                    context.strokeStyle = 'lightgray';
                    context.closePath();
                    context.fillRect((posX + j) * this._CELL, (posY + i) * this._CELL, this._CELL, this._CELL);
                    context.stroke();
                }
            }
        }



    }
}