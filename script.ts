import {Game} from "./Game.js";

window.onload = function() {
    let canvas = document.getElementById("canvas");

    let start = document.getElementById('play')
    let game = new Game(canvas);

    start.onclick = () => {

        game.gameStart();
    }

}