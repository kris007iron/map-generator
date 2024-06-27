import Sprite from './Sprite';
class SquareSelecting {
    constructor() {
        this.selectedHelper = [];
        this.selected = [];
        this.control = false;
        this.left = 0;
        this.top = 0;
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.border = '1px solid black';
        this.div.style.pointerEvents = 'none';
        document.body.appendChild(this.div);
        this.checkboxDiv = document.createElement('div');
        this.checkboxDiv.style.position = 'absolute';
        this.checkboxDiv.style.top = '0px';
        this.checkboxDiv.style.left = Sprite.getSpriteWidth() / 4 * 3 + 'px';
        this.checkboxDiv.style.width = "350px";
        let text = document.createElement('p');
        text.innerHTML = 'Auto select next square';
        this.checkboxDiv.appendChild(text);
        this.checkbox = document.createElement('input');
        this.checkbox.type = 'checkbox';
        this.checkbox.style.display = 'inline';
        this.checkboxDiv.appendChild(this.checkbox);
        document.body.appendChild(this.checkboxDiv);
        this.checkbox.addEventListener('change', () => {
            this.autoNext = this.checkbox.checked;
        });
        this.isSelecting = false;
        document.addEventListener('mousedown', (e) => {
            if (this.getConstraint(e)) {
                if (!this.control) {
                    for (let i = 0; i < this.selected.length; i++) {
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
            if (this.isSelecting && this.getConstraint(e)) {
                if (e.pageX > this.left) {
                    this.div.style.width = e.pageX - this.left + 'px';
                }
                else {
                    this.div.style.left = e.pageX + 'px';
                    this.div.style.width = this.left - e.pageX + 'px';
                }
                if (e.pageY > this.top) {
                    this.div.style.height = e.pageY - this.top + 'px';
                }
                else {
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
                for (let i = 0; i < this.selectedHelper.length; i++) {
                    this.selectedHelper[i].div.classList.remove('selected');
                }
                this.selectedHelper = [];
                let leftD = parseInt(this.div.style.left);
                let topD = parseInt(this.div.style.top);
                let width = parseInt(this.div.style.width);
                let height = parseInt(this.div.style.height);
                let right = leftD + width;
                let bottom = topD + height;
                for (let i = 0; i < this.selectionBoard.squares.length; i++) {
                    let square = this.selectionBoard.squares[i];
                    let squareLeft = square.getWindowsOffset().x;
                    let squareTop = square.getWindowsOffset().y;
                    let squareRight = squareLeft + square.a;
                    let squareBottom = squareTop + square.a;
                    if (right > squareLeft && leftD < squareRight && bottom > squareTop && topD < squareBottom && !this.selected.includes(square)) {
                        this.selectedHelper.push(square);
                        square.div.classList.add('selected');
                    }
                }
            }
        });
        document.addEventListener('mouseup', (e) => {
            this.div.style.display = 'none';
            this.div.style.width = '0px';
            this.div.style.height = '0px';
            this.selected.push(...this.selectedHelper);
            this.isSelecting = false;
            if (e.pageX === this.left && e.pageY === this.top && this.getConstraint(e) && this.selectedHelper.length === 0) {
                for (let i = 0; i < this.selectionBoard.squares.length; i++) {
                    let square = this.selectionBoard.squares[i];
                    let squareLeft = square.getWindowsOffset().x;
                    let squareTop = square.getWindowsOffset().y;
                    let squareRight = squareLeft + square.a;
                    let squareBottom = squareTop + square.a;
                    if (e.pageX > squareLeft && e.pageX < squareRight && e.pageY > squareTop && e.pageY < squareBottom) {
                        if (this.control) {
                            if (this.selected.includes(square)) {
                                let index = this.selected.indexOf(square);
                                this.selected.splice(index, 1);
                                square.div.classList.remove('selected');
                            }
                            else {
                                this.selected.push(square);
                                square.div.classList.add('selected');
                            }
                        }
                        else {
                            for (let i = 0; i < this.selected.length; i++) {
                                this.selected[i].div.classList.remove('selected');
                            }
                            this.selected = [square];
                            square.div.classList.add('selected');
                        }
                    }
                }
            }
            //Check for unchecking with ctrl
            this.selectedHelper = [];
        });
        document.addEventListener('keydown', (e) => {
            if (e.metaKey) {
                this.control = true;
            }
            else {
                if (e.ctrlKey) {
                    this.control = true;
                }
                else {
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
        });
        document.addEventListener('keyup', (e) => {
            if (e.metaKey) {
                this.control = false;
            }
            else {
                if (e.ctrlKey) {
                    this.control = false;
                }
                else {
                    this.control = false;
                }
            }
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SquareSelecting();
        }
        return this.instance;
    }
    setSelectionBoard(board) {
        this.selectionBoard = board;
    }
    getConstraint(e) {
        return e.pageX > this.selectionBoard.squares[0].getWindowsOffset().x && e.pageX < this.selectionBoard.squares[this.selectionBoard.squares.length - 1].getWindowsOffset().x + this.selectionBoard.squares[this.selectionBoard.squares.length - 1].a && e.pageY > this.selectionBoard.squares[0].getWindowsOffset().y && e.pageY < this.selectionBoard.squares[this.selectionBoard.squares.length - 1].getWindowsOffset().y + this.selectionBoard.squares[this.selectionBoard.squares.length - 1].a;
    }
    getBottomRightLastSelected() {
        let pos = 0;
        let square;
        if (this.selected.length > 1) {
            //get largest x and y and return this Square
            for (let i = 0; i < this.selected.length; i++) {
                let j = this.selectionBoard.squares.indexOf(this.selected[i]);
                let help = j % Math.sqrt(this.selectionBoard.squares.length);
                if (pos < help) {
                    pos = help;
                    square = this.selected[i];
                }
                else if (pos === help) {
                    if (this.selectionBoard.squares.indexOf(square) < j) {
                        square = this.selected[i];
                    }
                }
            }
        }
        else {
            square = this.selected[0];
        }
        return square;
    }
    setNextSquare() {
        if (this.autoNext) {
            let nextSquare = this.getNextSquare(this.getBottomRightLastSelected());
            nextSquare.div.classList.add('selected');
            this.selected = [nextSquare];
        }
    }
    getNextSquare(sqaure) {
        for (let i = 0; i < this.selectionBoard.squares.length; i++) {
            if (sqaure === this.selectionBoard.squares[i]) {
                if (i != this.selectionBoard.squares.length - 1) {
                    let next = i + Math.sqrt(this.selectionBoard.squares.length);
                    if (next < this.selectionBoard.squares.length) {
                        return this.selectionBoard.squares[next];
                    }
                    else {
                        let help = i % Math.sqrt(this.selectionBoard.squares.length);
                        next = help + 1;
                        return this.selectionBoard.squares[next];
                    }
                }
                else {
                    return this.selectionBoard.squares[0];
                }
            }
        }
    }
}
export default SquareSelecting;
