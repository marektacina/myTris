import {Game} from "./Game.js";

window.onload = function() {
    let canvas = document.getElementById("canvas");

    let start = document.getElementById('play');
    let pause = document.getElementById('pause');
    let stop = document.getElementById('stop');
    let clearRecord = document.getElementById('clear');

    let game = new Game(canvas);

    start.onclick = () => {
        game.gameStart();
    }

    pause.onclick = () => {
        game.gamePause();
    }

    stop.onclick = () => {
        game.gameStop(true);
    }

    window.onblur = () => {
        game.gamePause();
    }

    clearRecord.onclick = () => {
        game.clearRecord();
    }
}

