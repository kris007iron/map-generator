import Square from "./Square";
import { PresetSquare, CustomSquare } from "./Square";

/**
 * Interface representing the methods and properties of a Board.
 */
interface BoardInt {
    squares: Square[];
    pushSquare(square: Square): void;
    clearBoard(): void;
    setDefault(): void;
}

/**
 * Abstract class representing a generic Board.
 * @implements {BoardInt}
 */
abstract class Board implements BoardInt {
    public abstract squares: Square[];

    /**
     * Creates an instance of Board.
     * @param startX - The starting X coordinate.
     * @param startY - The starting Y coordinate.
     * @param width - The width of the board.
     * @param height - The height of the board.
     */
    constructor(protected startX: number, protected startY: number, protected width: number, protected height: number) { }

    /**
     * Adds a square to the board.
     * @param square - The square to add.
     */
    public pushSquare(square: Square) {
        this.squares.push(square);
    }

    /**
     * Clears all squares from the board.
     */
    public clearBoard() {
        this.squares = [];
    }

    /**
     * Sets all squares on the board to their default state.
     */
    public setDefault() {
        for (let i: number = 0; i < this.squares.length; i++) {
            this.squares[i].setDefault();
        }
    }
}

/**
 * Class representing a board with preset squares.
 * @extends {Board}
 */
class PresetBoard extends Board {
    public squares: PresetSquare[] = [];

    /**
     * Creates an instance of PresetBoard.
     * @param startX - The starting X coordinate.
     * @param startY - The starting Y coordinate.
     * @param width - The width of the board.
     * @param height - The height of the board.
     */
    constructor(startX: number, startY: number, width: number, height: number) {
        super(startX, startY, width, height);
        for (let i: number = 0; i < this.width; i++) {
            for (let j: number = 0; j < this.height; j++) {
                this.pushSquare(new PresetSquare(startX, startY, i, j));
            }
        }
    }
}

/**
 * Class representing a board with custom squares.
 * @extends {Board}
 */
class CustomBoard extends Board {
    public squares: CustomSquare[] = [];

    /**
     * Creates an instance of CustomBoard.
     * @param startX - The starting X coordinate.
     * @param startY - The starting Y coordinate.
     * @param width - The width of the board.
     * @param height - The height of the board.
     */
    constructor(startX: number, startY: number, width: number, height: number) {
        super(startX, startY, width, height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.pushSquare(new CustomSquare(startX, startY, i, j));
            }
        }
    }

    /**
     * Sets all custom squares on the board to their default state.
     */
    public setDefault() {
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i].setDefault();
        }
    }

    /**
     * Clears all custom squares from the board.
     */
    public clearBoard() {
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i].clear();
        }
        this.squares = [];
    }
}

export default Board;
export { PresetBoard, CustomBoard };
