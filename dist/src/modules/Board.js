import { PresetSquare, CustomSquare } from "./Square";
class Board {
    constructor(startX, startY, width, height) {
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
    }
    pushSquare(square) {
        this.squares.push(square);
    }
    clearBoard() {
        this.squares = [];
    }
}
class PresetBoard extends Board {
    constructor(startX, startY, width, height) {
        super(startX, startY, width, height);
        this.squares = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.pushSquare(new PresetSquare(startX, startY, i, j));
            }
        }
    }
}
class CustomBoard extends Board {
    constructor(startX, startY, width, height) {
        super(startX, startY, width, height);
        this.squares = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.pushSquare(new CustomSquare(startX, startY, i, j));
            }
        }
    }
    clearBoard() {
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i].clear();
        }
        this.squares = [];
    }
}
export default Board;
export { PresetBoard, CustomBoard };
