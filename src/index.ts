import Sprite from './modules/Sprite';
import Board from './modules/Board';
import { CustomBoard, PresetBoard } from './modules/Board';
import SquareSelecting from './modules/SquareSelecting';

new PresetBoard(0, 0, Sprite.getSpriteWidth() / Sprite.getElementSize(), Sprite.getSpriteHeight() / Sprite.getElementSize());
let playBoard: Board = new CustomBoard((Sprite.getSpriteWidth() / 2 + Sprite.getSpriteWidth() / Sprite.getElementSize() / 2) + 10, 50, 18, 18);

//SquareSelecting.getInstance();
SquareSelecting.getInstance().setSelectionBoard(playBoard);

