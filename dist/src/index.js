import Sprite from './modules/Sprite';
import { CustomBoard, PresetBoard } from './modules/Board';
import SquareSelecting from './modules/SquareSelecting';
import { CustomSquare } from './modules/Square';
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (document.getElementById('contextmenu').style.display != 'flex') {
        document.getElementById('contextmenu').style.display = 'flex';
    }
    else {
        document.getElementById('contextmenu').style.display = 'none';
    }
});
document.addEventListener('scroll', () => {
    document.getElementById('contextmenu').style.top = `${window.scrollY}px`;
});
new PresetBoard(0, 0, Sprite.getSpriteWidth() / Sprite.getElementSize(), Sprite.getSpriteHeight() / Sprite.getElementSize());
let playBoard = new CustomBoard((Sprite.getSpriteWidth() / 2 + Sprite.getSpriteWidth() / Sprite.getElementSize() / 2) + 10, 50, 10, 10);
SquareSelecting.getInstance();
SquareSelecting.getInstance().setSelectionBoard(playBoard);
//saving playBoard to file
let jsonpreserve;
document.getElementById('save').addEventListener('click', () => {
    let data = [...playBoard.squares];
    let json = JSON.stringify(data);
    jsonpreserve = json;
    let blob = new Blob([json], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'board.json';
    a.click();
    playBoard.clearBoard();
    //loading playBoard from json variable    
});
document.getElementById('load').addEventListener('click', () => {
    //loading playBoard from file
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();
    input.addEventListener('change', () => {
        let file = input.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            let data = JSON.parse(reader.result);
            playBoard.clearBoard();
            data.forEach((square) => {
                playBoard.pushSquare(new CustomSquare(square.startX, square.startY, square.x, square.y));
                //TODO: add handling empty boxes
                if (square.leftImg && square.topImg) {
                    playBoard.squares[playBoard.squares.length - 1].calculateSpriteOffset({ x: square.leftImg, y: square.topImg });
                }
                else {
                    playBoard.squares[playBoard.squares.length - 1].setDefault();
                }
            });
        };
    });
});
