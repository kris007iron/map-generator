import Sprite from './Sprite';
import SquareSelecting from './SquareSelecting';
class Square {
    constructor(startX, startY, x, y) {
        this.a = Sprite.getElementSize();
        this.div = document.createElement('div');
        this.left = 0;
        this.top = 0;
        this.leftImg = undefined;
        this.topImg = undefined;
        this.startX = startX;
        this.startY = startY;
        this.x = x;
        this.y = y;
    }
    setDefault() { }
    ;
    runConstructor() { }
    ;
}
class PresetSquare extends Square {
    constructor(startX, startY, x, y) {
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
            if (SquareSelecting.getInstance().selected.length > 0) {
                SquareSelecting.getInstance().selected.forEach((square) => {
                    square.calculateSpriteOffset(SquareSelecting.getInstance().clicked.getOffsetAsSelected());
                    square.div.classList.remove('selected');
                });
                if (!SquareSelecting.getInstance().autoNext) {
                    SquareSelecting.getInstance().selected = [];
                }
                else {
                    SquareSelecting.getInstance().setNextSquare();
                }
            }
        });
        this.div.style.width = this.a + 'px';
        this.div.style.height = this.a + 'px';
        this.div.style.position = 'absolute';
        this.div.style.left = this.left + 'px';
        this.div.style.top = this.top + 'px';
        document.body.appendChild(this.div);
    }
    getOffsetAsSelected() {
        return { x: this.leftImg, y: this.topImg };
    }
    calculateSpriteOffset(customParams) {
        if (customParams) {
            this.leftImg = customParams.x;
            this.topImg = customParams.y;
        }
        else {
            this.leftImg = this.x * this.a;
            this.topImg = this.y * this.a;
        }
        this.div.style.backgroundImage = `url(${Sprite.getSpritePath()})`;
        this.div.style.backgroundPosition = `-${this.leftImg}px -${this.topImg}px`;
    }
    getWindowsOffset() {
        return { x: this.left, y: this.top };
    }
}
class CustomSquare extends Square {
    constructor(startX, startY, x, y) {
        super(startX, startY, x, y);
        this.x = x;
        this.y = y;
        this.startX = startX;
        this.startY = startY;
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
    getOffsetAsSelected() {
        return { x: this.leftImg, y: this.topImg };
    }
    calculateSpriteOffset(customParams) {
        if (customParams) {
            if (customParams.x !== undefined && customParams.y !== undefined) {
                this.leftImg = customParams.x;
                this.topImg = customParams.y;
            }
        }
        else {
            this.leftImg = this.x * this.a;
            this.topImg = this.y * this.a;
        }
        this.div.style.backgroundImage = `url(${Sprite.getSpritePath()})`;
        this.div.style.backgroundPosition = `-${this.leftImg}px -${this.topImg}px`;
    }
    setDefault() {
        this.div.style.backgroundImage = 'none';
        this.leftImg = undefined;
        this.topImg = undefined;
    }
    getWindowsOffset() {
        return { x: this.left, y: this.top };
    }
    clear() {
        this.div.remove();
    }
    runConstructor() {
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
export { PresetSquare, CustomSquare };
