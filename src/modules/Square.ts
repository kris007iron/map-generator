import Sprite from './Sprite';
import SquareSelecting from './SquareSelecting';
import { Changed } from './Operation';

/**
 * Interface representing a square.
 * @interface
 * @property {number} a - The size of the square.
 * @property {HTMLDivElement} div - The square's div element.
 */
interface SquareInt {
    a: number;
    div: HTMLDivElement;
    getOffsetAsSelected(): Point;
    calculateSpriteOffset(customParams?: Point): void;
    setDefault(): void;
    getWindowsOffset(): Point;
    runConstructor(): void;
    getPos(): Point;
    setPreviousState(): void;
}

/**
 * Interface representing a point with optional coordinates.
 * @interface
 * @property {number | undefined} x - The X coordinate.
 * @property {number | undefined} y - The Y coordinate.
 */
interface Point {
    x: number | undefined;
    y: number | undefined;
}

/**
 * Interface representing the previous state of a square.
 */
interface PreviousState {
    x: number;
    y: number;
    leftImg: number | undefined;
    topImg: number | undefined;
}

/**
 * Abstract class representing a square.
 * @implements {SquareInt}
 * @abstract
 * @property {number} a - The size of the square.
 * @property {HTMLDivElement} div - The square's div element.
 * @property {number} left - The left offset of the square.
 * @property {number} top - The top offset of the square.
 * @property {number | undefined} leftImg - The left offset of the square's image.
 * @property {number | undefined} topImg - The top offset of the square's image.
 * @property {PreviousState} previousState - The previous state of the square.
 * @property {number} startX - The starting X coordinate.
 * @property {number} startY - The starting Y coordinate.
 * @property {number} x - The X coordinate.
 * @property {number} y - The Y coordinate.
 * @method getOffsetAsSelected - Gets the offset of the square when selected.
 * @method calculateSpriteOffset - Calculates the sprite offset for the square.
 * @method setDefault - Sets the square to its default state.
 * @method getWindowsOffset - Gets the window offset of the square.
 * @method runConstructor - Runs the constructor logic for the square.
 * @method getPos - Gets the position of the square.
 * @method execute - Executes changes on the square.
 * @method setPreviousState - Sets the square to its previous state.
 */
abstract class Square implements SquareInt {
    public a: number = Sprite.getElementSize();
    public div: HTMLDivElement;
    protected left: number = 0;
    protected top: number = 0;
    public leftImg: number | undefined = undefined;
    public topImg: number | undefined = undefined;
    public previousState: PreviousState = { x: 0, y: 0, leftImg: undefined, topImg: undefined };
    protected startX: number;
    protected startY: number;
    protected x: number;
    protected y: number;

    /**
     * Creates an instance of Square.
     * @param startX - The starting X coordinate.
     * @param startY - The starting Y coordinate.
     * @param x - The X coordinate.
     * @param y - The Y coordinate.
     */
    constructor(startX: number, startY: number, x: number, y: number) {
        this.div = document.createElement('div');
        this.startX = startX;
        this.startY = startY;
        this.x = x;
        this.y = y;
    }

    /**
     * Gets the offset of the square when selected.
     * @returns The offset as a Point.
     */
    public abstract getOffsetAsSelected(): Point;

    /**
     * Calculates the sprite offset for the square.
     * @param customParams - Optional custom parameters for the offset.
     */
    public abstract calculateSpriteOffset(customParams?: Point): void;

    /**
     * Sets the square to its default state.
     */
    public setDefault(): void { }

    /**
     * Gets the window offset of the square.
     * @returns The window offset as a Point.
     */
    public abstract getWindowsOffset(): Point;

    /**
     * Runs the constructor logic for the square.
     */
    public runConstructor(): void { }

    /**
     * Gets the position of the square.
     * @returns The position as a Point.
     */
    public getPos(): Point {
        return { x: this.x, y: this.y };
    }

    /**
     * Executes changes on the square.
     * @param changes - The changes to apply.
     */
    public execute(changes: Changed): void {
        if (changes.currentState && changes.currentState.x !== undefined && changes.currentState.y !== undefined && changes.currentState.x !== null && changes.currentState.y !== null) {
            this.calculateSpriteOffset({ x: changes.currentState.x, y: changes.currentState.y });
        } else {
            this.setDefault();
        }
        if (changes.previousState) {
            this.previousState = { x: changes.previousState.x, y: changes.previousState.y, leftImg: changes.previousState.leftImg, topImg: changes.previousState.topImg };
        } else {
            this.previousState = { x: 0, y: 0, leftImg: undefined, topImg: undefined };
        }
    }

    /**
     * Sets the square to its previous state.
     */
    public setPreviousState(): void {
        this.calculateSpriteOffset({ x: this.previousState.leftImg, y: this.previousState.topImg });
    }
}

/**
 * Class representing a preset square.
 * @extends {Square}
 */
class PresetSquare extends Square {
    /**
     * Creates an instance of PresetSquare.
     * @param startX - The starting X coordinate.
     * @param startY - The starting Y coordinate.
     * @param x - The X coordinate.
     * @param y - The Y coordinate.
     */
    constructor(startX: number, startY: number, x: number, y: number) {
        super(startX, startY, x, y);
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
        this.left = (this.x * this.a) + this.startX;
        this.top = (this.y * this.a) + this.startY;
        if ((Sprite.getSpriteWidth() / Sprite.getElementSize()) / 2 < this.x + 1) {
            this.left = this.left - (Sprite.getSpriteWidth() / Sprite.getElementSize() / 2) * this.a;
            this.top = this.top + this.a * (Sprite.getSpriteHeight() / Sprite.getElementSize());
            this.left += this.startX;
            this.top += this.startY;
            this.left -= 16;
            this.top += this.y + 20;
        }
        this.left += this.x;
        this.top += this.y;
        this.div.draggable = false;
        this.calculateSpriteOffset();
        this.div.classList.add('preset');
        this.div.addEventListener('click', () => {
            SquareSelecting.getInstance().clicked = this;
            console.log(SquareSelecting.getInstance().selected);
            if (SquareSelecting.getInstance().selected.length > 0) {
                SquareSelecting.getInstance().selected.forEach((square) => {
                    square.calculateSpriteOffset(SquareSelecting.getInstance().clicked.getOffsetAsSelected());
                    square.div.classList.remove('selected');
                });
                if (!SquareSelecting.getInstance().autoNext) {
                    SquareSelecting.getInstance().selected = [];
                } else {
                    SquareSelecting.getInstance().setNextSquare();
                }
                SquareSelecting.getInstance().newOperation();
            }
        });
        this.div.style.width = this.a + 'px';
        this.div.style.height = this.a + 'px';
        this.div.style.position = 'absolute';
        this.div.style.left = this.left + 'px';
        this.div.style.top = this.top + 'px';
        document.body.appendChild(this.div);
    }

    /**
     * Gets the offset of the square when selected.
     * @returns The offset as a Point.
     */
    public getOffsetAsSelected(): Point {
        return { x: this.leftImg, y: this.topImg };
    }

    /**
     * Calculates the sprite offset for the square.
     * @param customParams - Optional custom parameters for the offset.
     */
    public calculateSpriteOffset(customParams?: Point): void {
        this.previousState = { x: this.x, y: this.y, leftImg: this.leftImg, topImg: this.topImg };
        if (customParams) {
            this.leftImg = customParams.x;
            this.topImg = customParams.y;
        } else {
            this.leftImg = this.x * this.a;
            this.topImg = this.y * this.a;
        }
        this.div.style.backgroundImage = `url(${Sprite.getSpritePath()})`;
        this.div.style.backgroundPosition = `-${this.leftImg}px -${this.topImg}px`;
    }

    /**
     * Gets the window offset of the square.
     * @returns The window offset as a Point.
     */
    public getWindowsOffset(): Point {
        return { x: this.left, y: this.top };
    }
}

/**
 * Class representing a custom square.
 * @extends {Square}
 */
class CustomSquare extends Square {
    /**
     * Creates an instance of CustomSquare.
     * @param startX - The starting X coordinate.
     * @param startY - The starting Y coordinate.
     * @param x - The X coordinate.
     * @param y - The Y coordinate.
     */
    constructor(startX: number, startY: number, x: number, y: number) {
        super(startX, startY, x, y);
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
        this.left = (this.x * this.a) + this.startX;
        this.top = (this.y * this.a) + this.startY;
        if (x !== 0 || y !== 0) {
            this.left -= x;
            this.top -= y;
        }
        this.left += this.x;
        this.top += this.y;
        this.div.draggable = false;
        this.div.style.backgroundColor = 'red';
        this.div.style.pointerEvents = 'click';
        this.div.style.userSelect = 'none';
        this.div.style.width = this.a + 'px';
        this.div.style.height = this.a + 'px';
        this.div.style.position = 'absolute';
        this.div.style.left = this.left + 'px';
        this.div.style.top = this.top + 'px';
        document.body.appendChild(this.div);
    }

    /**
     * Gets the offset of the square when selected.
     * @returns The offset as a Point.
     */
    public getOffsetAsSelected(): Point {
        return { x: this.leftImg, y: this.topImg };
    }

    /**
     * Calculates the sprite offset for the square.
     * @param customParams - Optional custom parameters for the offset.
     */
    public calculateSpriteOffset(customParams?: Point): void {
        if (customParams) {
            this.previousState = { x: this.x, y: this.y, leftImg: this.leftImg, topImg: this.topImg };
            if (customParams.x !== undefined && customParams.y !== undefined) {
                this.leftImg = customParams.x;
                this.topImg = customParams.y;
            } else {
                this.setDefault();
                return;
            }
        } else {
            this.leftImg = this.x * this.a;
            this.topImg = this.y * this.a;
        }
        this.div.style.backgroundImage = `url(${Sprite.getSpritePath()})`;
        this.div.style.backgroundPosition = `-${this.leftImg}px -${this.topImg}px`;
    }

    /**
     * Sets the square to its default state.
     */
    public setDefault(): void {
        this.div.style.backgroundImage = 'none';
        this.previousState = { x: this.x, y: this.y, leftImg: this.leftImg, topImg: this.topImg };
        this.leftImg = undefined;
        this.topImg = undefined;
    }

    /**
     * Gets the window offset of the square.
     * @returns The window offset as a Point.
     */
    public getWindowsOffset(): Point {
        return { x: this.left, y: this.top };
    }

    /**
     * Clears the square.
     */
    public clear(): void {
        this.div.remove();
    }

    /**
     * Runs the constructor logic for the square.
     */
    public runConstructor(): void {
        this.left = (this.x * this.a) + this.startX;
        this.top = (this.y * this.a) + this.startY;
        this.left += this.x;
        this.top += this.y;
        this.div.draggable = false;
        this.div.style.backgroundColor = 'red';
        this.div.style.pointerEvents = 'click';
        this.div.style.userSelect = 'none';
        this.div.style.width = this.a + 'px';
        this.div.style.height = this.a + 'px';
        this.div.style.position = 'absolute';
        this.div.style.left = this.left + 'px';
        this.div.style.top = this.top + 'px';
        document.body.appendChild(this.div);
    }
}

export default Square;
export { PresetSquare, CustomSquare, PreviousState, Point };
