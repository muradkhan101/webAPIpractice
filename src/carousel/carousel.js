class Carousel {
    constructor(selector, options) {
        this.options = options;
        this.container = document.querySelector(selector);
        if (!this.container) throw new Error('No element found with selector: ', selector);

        this.elements = this.container.children;
        this.position = 0;
    }
    moveRight() {
        let prevIndex = this.position;
        this.position = this.getNextIndex(1);
    }
    moveLeft() {
        let prevIndex = this.position;
        this.position = this.getNextIndex(-1);
    }
    
    getNextIndex(direction) {
        let elementCount = this.elements.length;
        let currentIndex = this.position;
        return (currentIndex + direction + elementCount) % elementCount;
    }
}