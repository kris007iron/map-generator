/**
 * Class representing a sprite with static properties for dimensions and path.
 */
class Sprite {
    private static spriteWidth: number = 1536;
    private static spriteHeight: number = 960;
    private static elementSize: number = 48;
    private static path: string = './src/gfx/sprites.png';

    /**
     * Gets the path to the sprite image.
     * @returns The sprite image path.
     */
    public static getSpritePath(): string {
        return this.path;
    }

    /**
     * Gets the width of the sprite.
     * @returns The sprite width.
     */
    public static getSpriteWidth(): number {
        return this.spriteWidth;
    }

    /**
     * Gets the height of the sprite.
     * @returns The sprite height.
     */
    public static getSpriteHeight(): number {
        return this.spriteHeight;
    }

    /**
     * Gets the size of individual elements within the sprite.
     * @returns The element size.
     */
    public static getElementSize(): number {
        return this.elementSize;
    }
}

export default Sprite;
