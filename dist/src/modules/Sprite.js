class Sprite {
    static getSpritePath() {
        return this.path;
    }
    static getSpriteWidth() {
        return this.spriteWidth;
    }
    static getSpriteHeight() {
        return this.spriteHeight;
    }
    static getElementSize() {
        return this.elementSize;
    }
}
Sprite.spriteWidth = 1536;
Sprite.spriteHeight = 960;
Sprite.elementSize = 48;
Sprite.path = './src/gfx/sprites.png';
export default Sprite;
