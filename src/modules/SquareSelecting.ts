import Board from './Board';
import Square, { CustomSquare } from './Square';
import Sprite from './Sprite';
import Operation from './Operation';
import { Diff } from './Operation';

/**
 * Interface for the data of a square.
 */
interface SqaureData {
    startX: number;
    startY: number;
    x: number;
    y: number;
    leftImg: number | undefined;
    topImg: number | undefined;
}

/**
 * Interface for a point with x and y coordinates.
 */
interface Point {
    x: number | undefined;
    y: number | undefined;
}

/**
 * Singleton class to handle square selecting operations.
 */
class SquareSelecting {
    private static instance: SquareSelecting;
    private cached: Array<Square> = [];
    private affected: Array<Square> = [];
    private currentOperation: Operation;
    private hovering: boolean = false;
    private div: HTMLDivElement;
    private checkbox: HTMLInputElement;
    private checkboxDiv: HTMLDivElement;
    private x: number;
    private y: number;
    public selectionBoard: Board;
    private spriteOffsets: Array<Point | null> = [];
    private contextMenu: boolean = false;
    public autoNext: boolean;
    public isSelecting: boolean;
    public selectedHelper: Array<Square> = [];
    public clicked: Square;
    public selected: Array<Square> = [];
    public control: boolean = false;
    public left: number = 0;
    public top: number = 0;
    /**
     * Private constructor to ensure Singleton pattern.
     */
    private constructor() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.border = '1px solid black';
        this.div.style.pointerEvents = 'none';
        document.body.appendChild(this.div);
        this.checkboxDiv = document.createElement('div');
        this.checkboxDiv.style.position = 'absolute';
        this.checkboxDiv.style.top = '0px';
        this.checkboxDiv.style.left = Sprite.getSpriteWidth() / 4 * 3 + 'px';
        this.checkboxDiv.style.width = "350px"

        let text: HTMLParagraphElement = document.createElement('p');
        text.innerHTML = 'Auto select next square'

        this.checkboxDiv.appendChild(text);
        this.checkbox = document.createElement('input');
        this.checkbox.type = 'checkbox';
        this.checkbox.style.display = 'inline'
        this.checkboxDiv.appendChild(this.checkbox);
        document.body.appendChild(this.checkboxDiv);
        this.checkbox.addEventListener('change', () => {
            this.autoNext = this.checkbox.checked;
        });

        this.isSelecting = false;
        document.addEventListener('mousedown', (e) => {
            if (this.getConstraint(e) && !this.contextMenu && e.button === 0) {
                if (!this.control) {
                    for (let i: number = 0; i < this.selected.length; i++) {
                        this.selected[i].div.classList.remove('selected');
                    }
                    this.selected = [];
                }
                this.isSelecting = true;
                this.div.style.left = e.pageX + 'px';
                this.div.style.top = e.pageY + 'px';
                this.div.style.width = '0px';
                this.div.style.height = '0px';
                this.div.style.display = 'none';
                //clicking functionality
                this.left = e.pageX;
                this.top = e.pageY;
            }
        });

        document.addEventListener('mousemove', (e) => {
            this.x = e.pageX;
            this.y = e.pageY;
            if (this.isSelecting && this.getConstraint(e)) {
                if (e.pageX > this.left) {
                    this.div.style.width = e.pageX - this.left + 'px';
                } else {
                    this.div.style.left = e.pageX + 'px';
                    this.div.style.width = this.left - e.pageX + 'px';
                }

                if (e.pageY > this.top) {
                    this.div.style.height = e.pageY - this.top + 'px';
                } else {
                    this.div.style.top = e.pageY + 'px';
                    this.div.style.height = this.top - e.pageY + 'px';
                }

                this.div.style.display = 'block';
                //make selecting

                if (!this.control) {
                    for (let i = 0; i < this.selected.length; i++) {
                        this.selected[i].div.classList.remove('selected');
                    }
                    this.selected = [];
                }
                for (let i: number = 0; i < this.selectedHelper.length; i++) {
                    this.selectedHelper[i].div.classList.remove('selected');
                }
                this.selectedHelper = [];
                let leftD: number = parseInt(this.div.style.left);
                let topD: number = parseInt(this.div.style.top);
                let width: number = parseInt(this.div.style.width);
                let height: number = parseInt(this.div.style.height);
                let right: number = leftD + width;
                let bottom: number = topD + height;
                for (let i: number = 0; i < this.selectionBoard.squares.length; i++) {
                    let square: Square = this.selectionBoard.squares[i];
                    let squareLeft: number = square.getWindowsOffset().x;
                    let squareTop: number = square.getWindowsOffset().y;
                    let squareRight: number = squareLeft + square.a;
                    let squareBottom: number = squareTop + square.a;
                    if (right > squareLeft && leftD < squareRight && bottom > squareTop && topD < squareBottom && !this.selected.includes(square)) {
                        this.selectedHelper.push(square);
                        square.div.classList.add('selected');
                    }
                }
            }
            this.pasteHovering(e);
        });

        document.addEventListener('mouseup', (e) => {
            this.div.style.display = 'none';
            this.div.style.width = '0px';
            this.div.style.height = '0px';
            this.selected.push(...this.selectedHelper);
            this.affected = [];
            this.isSelecting = false;
            if (e.pageX === this.left && e.pageY === this.top && this.getConstraint(e) && this.selectedHelper.length === 0) {
                for (let i: number = 0; i < this.selectionBoard.squares.length; i++) {
                    let square: Square = this.selectionBoard.squares[i];
                    let squareLeft: number = square.getWindowsOffset().x;
                    let squareTop: number = square.getWindowsOffset().y;
                    let squareRight: number = squareLeft + square.a;
                    let squareBottom: number = squareTop + square.a;
                    if (e.pageX > squareLeft && e.pageX < squareRight && e.pageY > squareTop && e.pageY < squareBottom) {
                        if (this.control) {
                            if (this.selected.includes(square)) {
                                let index: number = this.selected.indexOf(square);
                                this.selected.splice(index, 1);
                                square.div.classList.remove('selected');
                            } else {
                                this.selected.push(square);
                                square.div.classList.add('selected');
                            }
                        } else {
                            for (let i: number = 0; i < this.selected.length; i++) {
                                this.selected[i].div.classList.remove('selected');
                            }
                            this.selected = [square];
                            square.div.classList.add('selected');
                        }
                    }
                }
            }
            if (this.hovering && this.getConstraint(e)) {
                this.hovering = false;

                this.newOperation();
            }
            //Check for unchecking with ctrl
            this.selectedHelper = [];

        });

        document.addEventListener('keydown', (e) => {
            if (e.metaKey) {
                this.control = true;
            } else {
                if (e.ctrlKey) {
                    this.control = true;
                } else {
                    this.control = false;
                }
            }
            if (e.key === 'Delete') {
                for (let i = 0; i < this.selected.length; i++) {
                    this.selected[i].setDefault();
                    this.selected[i].div.classList.remove('selected');
                }
                this.selected = [];
            }
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    this.undoOperation();
                }
                if (e.key === 'y') {
                    e.preventDefault();
                    this.redoOperation();
                }
                if (e.key === 'c') {
                    this.copySelected();
                }
                if (e.key === 'x') {
                    this.cutSelected();
                }
                if (e.key === 'v') {
                    this.hovering = true;
                    //clear selected
                    for (let i = 0; i < this.selected.length; i++) {
                        this.selected[i].div.classList.remove('selected');
                    }
                    this.selected = [];
                    for (let i = 0; i < this.selectedHelper.length; i++) {
                        this.selectedHelper[i].div.classList.remove('selected');
                    }
                    this.selectedHelper = [];
                }
                if (e.key === 's') {
                    this.saveToFile();
                }
                if (e.key === 'l') {
                    this.loadFromFile();
                }
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.metaKey) {
                this.control = false;
            } else {
                if (e.ctrlKey) {
                    this.control = false;
                } else {
                    this.control = false;
                }
            }
        });

        document.getElementById('delete').addEventListener('click', () => {
            for (let i = 0; i < this.selected.length; i++) {
                this.selected[i].setDefault();
                this.selected[i].div.classList.remove('selected');
            }
            this.selected = [];
        });

        document.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            if (document.getElementById('contextmenu').style.display != 'flex' && this.getConstraint(e)) {
                document.getElementById('contextmenu').style.display = 'flex';
                this.contextMenu = true;
            }
            document.addEventListener('click', () => {
                document.getElementById('contextmenu').style.display = 'none';
                this.contextMenu = false;
            });
        });
        document.addEventListener('scroll', () => {
            document.getElementById('contextmenu').style.top = `${window.scrollY}px`;
            document.getElementById('contextmenu').style.left = `${window.scrollX}px`;
        })

        document.getElementById('save').addEventListener('click', () => {
            this.saveToFile();
            //loading playBoard from json variable
        });

        document.getElementById('load').addEventListener('click', () => {
            //loading playBoard from file
            this.loadFromFile();
        });

        document.getElementById('cut').addEventListener('click', () => {
            //cut selected squares, cache them and clear them from the board
            this.cutSelected();
        });

        document.getElementById('copy').addEventListener('click', () => {
            //copy selected squares
            this.copySelected();
        });

        document.getElementById('paste').addEventListener('click', () => {
            this.hovering = true;
        });

        document.getElementById('undo').addEventListener('click', () => {
            this.undoOperation();
        });

        document.getElementById('redo').addEventListener('click', () => {
            this.redoOperation();
        });
    }
    /**
     * Handle hovering paste operation.
     * @param e - Mouse event
     * @private
     * @returns void
     */
    private pasteHovering(e: MouseEvent) {
        //TODO: fix hovering with undo and redo
        if (this.hovering && this.cached.length > 0 && this.getConstraint(e)) {
            let notNullSquares: Array<Square> = this.cached.filter((square) => square.getOffsetAsSelected().x !== undefined && square.getOffsetAsSelected().y !== undefined);
            let lowestX: number;
            let lowestY: number;
            let highestY: number;
            let highestX: number;
            let cachedWidthPx: number;
            let cachedHeightPx: number;
            [lowestX, lowestY, highestX, highestY, cachedWidthPx, cachedHeightPx] = this.getCachedData();
            let cachedWidth: number = Math.floor(cachedWidthPx / this.cached[0].a);
            let cachedHeight: number = Math.floor(cachedHeightPx / this.cached[0].a);
            let x: number = e.pageX;
            let y: number = e.pageY;
            for (let i = 0; i < this.affected.length; i++) {
                this.affected[i].setPreviousState();
            }
            this.affected = [];
            let unaffected: Array<Square> = [...this.selectionBoard.squares];
            for (let i = 0; i < this.spriteOffsets.length; i++) {
                for (let j = 0; j < this.selectionBoard.squares.length; j++) {
                    let square: Square = this.selectionBoard.squares[j];
                    let squareLeft: number = square.getWindowsOffset().x;
                    let squareTop: number = square.getWindowsOffset().y;
                    let squareRight: number = squareLeft + square.a;
                    let squareBottom: number = squareTop + square.a;
                    if (x > squareLeft && x < squareRight && y > squareTop && y < squareBottom) {
                        if (this.spriteOffsets[i] === null) {
                            square.setDefault();
                            if (!this.affected.includes(square)) {
                                this.affected.push(square);
                                unaffected.splice(unaffected.indexOf(square), 1);
                            }
                        } else if (this.spriteOffsets[i].x !== undefined && this.spriteOffsets[i].y !== undefined && this.spriteOffsets[i].x !== null && this.spriteOffsets[i].y !== null) {
                            square.calculateSpriteOffset(this.spriteOffsets[i]);
                            if (!this.affected.includes(square)) {
                                this.affected.push(square);
                                unaffected.splice(unaffected.indexOf(square), 1);
                            }
                        }
                    }
                }
                x += this.cached[0].a;
                if (x > e.pageX + cachedWidthPx - this.cached[0].a) {
                    x = e.pageX;
                    y += this.cached[0].a;
                }
            }
        }
    }

    /**
     * Save current selection to a file.
     */
    private saveToFile() {
        let data: Array<Square> = [...this.selectionBoard.squares];
        let json: string = JSON.stringify(data);
        let blob: Blob = new Blob([json], { type: 'application/json' });
        let url: string = URL.createObjectURL(blob);
        let a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = 'board.json';
        a.click();
    }

    /**
     * Undo the last operation.
     */
    private undoOperation() {
        if (this.currentOperation.getPrevious()) {
            console.log("undo operation");
            this.currentOperation = this.currentOperation.getPrevious();
            this.currentOperation.execute(this.selectionBoard, this.affected);
            //get mouse event and assign it to a variable
            //get mouse position here

            this.pasteHovering({ pageX: this.x, pageY: this.y } as MouseEvent);
        }
        console.log(this.currentOperation);
    }

    /**
        * Redo the previously undone operation.
    */
    private redoOperation() {
        if (this.currentOperation.getNext()) {
            console.log("redo operation");
            this.currentOperation = this.currentOperation.getNext();
            this.currentOperation.execute(this.selectionBoard, this.affected);

            this.pasteHovering({ pageX: this.x, pageY: this.y } as MouseEvent);
        }
        console.log(this.currentOperation);
    }

    /**
     * Initialize a new operation.
     */
    public newOperation() {
        let diff: Diff = { changed: [] };
        this.selectionBoard.squares.forEach((square) => {
            diff.changed.push({ windowOffset: structuredClone(square.getWindowsOffset()), previousState: structuredClone(square.previousState), currentState: structuredClone(square.getOffsetAsSelected()) });
        });
        if (!this.currentOperation) {
            console.log('first operation');
            this.currentOperation = new Operation(diff);
        } else {
            console.log('new operation');
            this.currentOperation.setNext(new Operation(diff, this.currentOperation));
            this.currentOperation = this.currentOperation.getNext();
        }
    }

    /**
     * Copy the currently selected squares.
     */
    private copySelected() {
        this.cached = [...this.selected];
        this.spriteOffsets = [];
        let lowestX: number;
        let lowestY: number;
        let highestX: number;
        let highestY: number;
        let cachedWidthPx: number;
        let cachedHeightPx: number;
        [lowestX, lowestY, highestX, highestY, cachedWidthPx, cachedHeightPx] = this.getCachedData();
        let cachedWidth: number = Math.floor(cachedWidthPx / this.cached[0].a);
        let cachedHeight: number = Math.floor(cachedHeightPx / this.cached[0].a);
        let possible: Array<Point> = [];
        while (possible.length < cachedWidth * cachedHeight) {
            possible.push({ x: lowestX, y: lowestY });
            lowestX++;
            if (lowestX > highestX) {
                lowestX = lowestX - cachedWidth;
                lowestY++;
            }
        }
        for (let i: number = 0; i < possible.length; i++) {
            if (this.cached.filter((square) => square.getPos().x === possible[i].x && square.getPos().y === possible[i].y).length > 0) {
                let sqaure: Square = this.cached.filter((square) => square.getPos().x === possible[i].x && square.getPos().y === possible[i].y)[0];
                if (sqaure.getOffsetAsSelected().x !== undefined && sqaure.getOffsetAsSelected().y !== undefined)
                    this.spriteOffsets.push(sqaure.getOffsetAsSelected());
                else {
                    this.spriteOffsets.push(null);
                }
            } else {
                this.spriteOffsets.push({ x: null, y: null });
            }
        }
        this.selected.forEach((square) => {
            square.div.classList.remove('selected');
        });
        this.selected = [];
    }

    /**
     * Cut the currently selected squares.
     */
    private cutSelected() {
        this.cached = [...this.selected];
        this.spriteOffsets = [];
        let lowestX: number;
        let lowestY: number;
        let highestX: number;
        let highestY: number;
        let cachedWidthPx: number;
        let cachedHeightPx: number;
        [lowestX, lowestY, highestX, highestY, cachedWidthPx, cachedHeightPx] = this.getCachedData();
        let cachedWidth: number = Math.floor(cachedWidthPx / this.cached[0].a);
        let cachedHeight: number = Math.floor(cachedHeightPx / this.cached[0].a);
        let possible: Array<Point> = [];
        while (possible.length < cachedWidth * cachedHeight) {
            possible.push({ x: lowestX, y: lowestY });
            lowestX++;
            if (lowestX > highestX) {
                lowestX = lowestX - cachedWidth;
                lowestY++;
            }
        }

        for (let i: number = 0; i < possible.length; i++) {
            if (this.cached.filter((square) => square.getPos().x === possible[i].x && square.getPos().y === possible[i].y).length > 0) {
                let sqaure = this.cached.filter((square) => square.getPos().x === possible[i].x && square.getPos().y === possible[i].y)[0];
                if (sqaure.getOffsetAsSelected().x !== undefined && sqaure.getOffsetAsSelected().y !== undefined)
                    this.spriteOffsets.push(sqaure.getOffsetAsSelected());
                else {
                    this.spriteOffsets.push(null);
                }
            } else {
                this.spriteOffsets.push({ x: null, y: null });
            }
        }
        this.selected.forEach((square) => {
            square.div.classList.remove('selected');
            square.setDefault();
        });
        this.selected = [];
        this.newOperation();
    }

    /**
     * Load selection from a file.
     */
    private loadFromFile() {
        let input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.click();
        input.addEventListener('change', () => {
            let file: File = input.files[0];
            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                let data: Array<SqaureData> = JSON.parse(reader.result as string);
                this.selectionBoard.clearBoard();
                data.forEach((square) => {
                    this.selectionBoard.pushSquare(new CustomSquare(square.startX, square.startY, square.x, square.y));
                    if (square.leftImg && square.topImg) {
                        this.selectionBoard.squares[this.selectionBoard.squares.length - 1].calculateSpriteOffset({ x: square.leftImg, y: square.topImg });
                    } else {
                        this.selectionBoard.squares[this.selectionBoard.squares.length - 1].setDefault();
                    }
                });
                this.currentOperation = null;
                this.newOperation();
            };
        });

        console.log(this.currentOperation);
    }

    /**
     * Get the instance of SquareSelecting, ensuring Singleton pattern.
     * @returns Instance of SquareSelecting
     */
    public static getInstance(): SquareSelecting {
        if (!this.instance) {
            this.instance = new SquareSelecting();
        }
        return this.instance;
    }
    /**
     * Set the selection board.
     * @param board - Board to set as selection board
     * @returns void
     * @public
     * @memberof SquareSelecting
     * @instance
     * @method
     * @this SquareSelecting
     */
    public setSelectionBoard(board: Board) {
        this.selectionBoard = board;
        let diffForDefault: Diff = { changed: [] };
        for (let i: number = 0; i < this.selectionBoard.squares.length; i++) {
            let square: Square = this.selectionBoard.squares[i];
            diffForDefault.changed.push({ windowOffset: square.getWindowsOffset(), previousState: square.previousState, currentState: { x: null, y: null } });
        }
        this.currentOperation = new Operation(diffForDefault);
    }
    /**
     * Check if the mouse event is within the constraints of the selection board.
     * @param e - Mouse event
     * @returns Boolean indicating if the event is within constraints
     */
    private getConstraint(e: MouseEvent): boolean {
        return e.pageX > this.selectionBoard.squares[0].getWindowsOffset().x && e.pageX < this.selectionBoard.squares[this.selectionBoard.squares.length - 1].getWindowsOffset().x + this.selectionBoard.squares[this.selectionBoard.squares.length - 1].a && e.pageY > this.selectionBoard.squares[0].getWindowsOffset().y && e.pageY < this.selectionBoard.squares[this.selectionBoard.squares.length - 1].getWindowsOffset().y + this.selectionBoard.squares[this.selectionBoard.squares.length - 1].a;
    }
    /**
     * Get the bottom right square of the last selected square.
     * @returns Bottom right square of the last selected square
     * @public
     * @memberof SquareSelecting
     * @instance
     * @method
     * @this SquareSelecting
     * @returns {Square} - Bottom right square of the last selected square
     */
    public getBottomRightLastSelected(): Square {
        let pos: number = 0;
        let square: Square;
        if (this.selected.length > 1) {
            //get largest x and y and return this Square
            for (let i = 0; i < this.selected.length; i++) {
                let j: number = this.selectionBoard.squares.indexOf(this.selected[i]);
                let help: number = j % Math.sqrt(this.selectionBoard.squares.length);
                if (pos < help) {
                    pos = help;
                    square = this.selected[i];
                } else if (pos === help) {
                    if (this.selectionBoard.squares.indexOf(square) < j) {
                        square = this.selected[i];
                    }
                }
            }
        } else {
            square = this.selected[0];
        }
        return square;
    }
    /**
     * Set the next square.
     * @returns void
     * @public
     * @memberof SquareSelecting
     */
    public setNextSquare() {
        if (this.autoNext) {
            let nextSquare: Square = this.getNextSquare(this.getBottomRightLastSelected());
            nextSquare.div.classList.add('selected');
            this.selected = [nextSquare];
        }
    }
    /**
     * Get the next square.
     * @param sqaure - Square to get the next square from
     * @returns Next square
     * @public
     * @memberof SquareSelecting
     */
    public getNextSquare(sqaure: Square): Square {
        for (let i: number = 0; i < this.selectionBoard.squares.length; i++) {
            if (sqaure === this.selectionBoard.squares[i]) {
                if (i != this.selectionBoard.squares.length - 1) {
                    let next: number = i + Math.sqrt(this.selectionBoard.squares.length);
                    if (next < this.selectionBoard.squares.length) {
                        return this.selectionBoard.squares[next];
                    } else {
                        let help: number = i % Math.sqrt(this.selectionBoard.squares.length);
                        next = help + 1;
                        return this.selectionBoard.squares[next];
                    }
                } else {
                    return this.selectionBoard.squares[0];
                }
            }
        }
    }
    /**
     * setter for affected
     * @param affected 
     * @returns void
     * @public
     * @memberof SquareSelecting
     */
    public setAffected(affected: Array<Square>) {
        this.affected = affected;
    }
    /**
     *gets data from cached
     * @returns Array of cached data
     * @public
     * @memberof SquareSelecting
     */
    private getCachedData() {
        let lowestX: number = this.cached.filter((square) => square.getPos().x === Math.min(...this.cached.map((square) => square.getPos().x)))[0].getPos().x;
        let lowestY: number = this.cached.filter((square) => square.getPos().y === Math.min(...this.cached.map((square) => square.getPos().y)))[0].getPos().y;
        let highestX: number = this.cached.filter((square) => square.getPos().x === Math.max(...this.cached.map((square) => square.getPos().x)))[0].getPos().x;
        let highestY: number = this.cached.filter((square) => square.getPos().y === Math.max(...this.cached.map((square) => square.getPos().y)))[0].getPos().y;
        let cachedWidthPx: number = Math.abs(lowestX - highestX) * this.cached[0].a + this.cached[0].a;
        let cachedHeightPx: number = Math.abs(lowestY - highestY) * this.cached[0].a + this.cached[0].a;
        return [lowestX, lowestY, highestX, highestY, cachedWidthPx, cachedHeightPx];
    }
}

export default SquareSelecting;
