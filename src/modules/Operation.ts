import Board from './Board';
import Square, { PreviousState, Point } from './Square';
import SquareSelecting from './SquareSelecting';

/**
 * Interface representing an operation in a sequence.
 */
interface OperationInterface {
    getPrevious(): Operation;
    getNext(): Operation;
    setNext(next: Operation): void;
    execute(selectionBoard: Board, affected: Square[]): void;
}

/**
 * Interface representing a point that has changed.
 */
interface Changed {
    windowOffset: Point;
    previousState: PreviousState;
    currentState: Point;
}

/**
 * Interface representing a collection of changes.
 */
interface Diff {
    changed: Array<Changed>;
}

/**
 * Class representing an operation that can be part of a sequence of operations.
 * @implements {OperationInterface}
 */
class Operation implements OperationInterface {
    private previous: Operation;
    private next: Operation;
    public diff: Diff;

    /**
     * Creates an instance of Operation.
     * @param diff - The differences applied by this operation.
     * @param previous - The previous operation in the sequence, if any.
     */
    constructor(diff: Diff, previous?: Operation) {
        this.previous = previous;
        this.next = null;
        this.diff = diff;
    }

    /**
     * Gets the previous operation in the sequence.
     * @returns The previous operation.
     */
    public getPrevious(): Operation {
        return this.previous;
    }

    /**
     * Gets the next operation in the sequence.
     * @returns The next operation.
     */
    public getNext(): Operation {
        return this.next;
    }

    /**
     * Sets the next operation in the sequence.
     * @param next - The next operation.
     */
    public setNext(next: Operation): void {
        this.next = next;
    }

    /**
     * Executes the operation on the given board and affected squares.
     * @param selectionBoard - The board on which the operation is executed.
     * @param affected - The squares affected by the operation.
     */
    public execute(selectionBoard: Board, affected: Square[]): void {
        console.log(this.diff.changed);
        for (let i: number = 0; i < selectionBoard.squares.length; i++) {
            let sqaure = selectionBoard.squares[i];
            let changed;
            for (let j: number = 0; j < this.diff.changed.length; j++) {
                if (this.diff.changed[j].windowOffset.x === sqaure.getWindowsOffset().x && this.diff.changed[j].windowOffset.y === sqaure.getWindowsOffset().y) {
                    changed = this.diff.changed[j];
                    sqaure.execute(changed);
                }
                for (let j: number = 0; j < affected.length; j++) {
                    if (affected[j] === sqaure) {
                        sqaure.calculateSpriteOffset(sqaure.getOffsetAsSelected());
                    }
                }
            }
        }
    }
}

export default Operation;
export { Changed, Diff };
