// The issue with these was that I tied both x and y into the calculations for rotateX and rotateY
// 

// let getDegX = ({x, y}) => {
//     let sq = Math.sqrt(squared(x, y));
//     let scale = 90 * 90 / sq;
//     return -Math.asin(y / sq) / Math.PI * scale;
// }

// let getDegY = ({x, y}) => {
//     let sq = Math.sqrt(squared(x, y));
//     let scale = 90 * 90 / sq;
//     return Math.acos((Math.PI / 2 - x) / sq) / Math.PI * scale;
// }

// This one should be linearly independent in x / y
// Moving in one direction should only rotate in one direction
let getDegX = ({y}, max = 60) => {
    // To make range go from 0 - 255 => -128 - 127
    y = y - 128;
    let sqrt = Math.sign(y) * Math.sqrt(Math.abs(y));
    return sqrt / Math.sqrt(255) * max;
}

let getDegY = ({x}, max = 60) => {
    // To make range go from 0 - 255 => -128 - 127
    x = x - 128;
    let sqrt = Math.sign(x) * Math.sqrt(Math.abs(x));
    return sqrt / Math.sqrt(255) * max;
}

let getMousePos = ({pageX, pageY}) => ({x: pageX, y: pageY})
let squared = (...arg) => arg.reduce((total, i) => total + i * i, 0)

function setTransform(square, amount) {
    let transform = `rotateX(${getDegX(amount)}deg) rotateY(${getDegY(amount)}deg)`;
    square.style.transform = transform;
}

let NUM_ROWS = 24;
let NUM_COLS = 24;
let SQ_SIZE = 25;

let current = Array.from({length: NUM_ROWS}, () => Array.from({length: NUM_COLS}, () => ({x:128, y:128}) ));
let prev = Array.from({length: NUM_ROWS}, () => Array.from({length: NUM_COLS}, () => ({x:128, y:128}) ));;

let makeSquare = (row, col) => {
    let el = document.createElement('div');
    el.classList.add('square');
    el.setAttribute('row', row);
    el.setAttribute('column', col);
    return el;
}

let makeGrid = (rows, cols) => {
    let grid = document.createElement('div');
    grid.classList.add('square-grid');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid.appendChild(makeSquare(i, j));
        }
    }
    return grid;
}

let makeEverything = (appendTo = document.querySelector('body'), rows = NUM_ROWS, cols = NUM_COLS, sq_size = SQ_SIZE) => {
    let styles = document.createElement('style');
    styles.type = 'text/css';
    styles.innerHTML = `
        .square {
            width: ${sq_size}px;
            height: ${sq_size}px;
            background: cadetblue;
        }
        .square-grid {
            display: flex;
            flex-wrap: wrap;
            width: ${sq_size * cols}px;
            height: ${sq_size * rows}px;
        }
    `;
    document.querySelector('head').appendChild(styles);
    let grid = makeGrid(rows, cols);
    appendTo.appendChild(grid);
}

function debounceEvent(container, event, fn, timer = 1000 / 15) {
    let shouldFire = true;
    let timerId = null;
    function eventWrapper(e) {
        if (shouldFire) {
            fn(container, e);
            shouldFire = false;
            timerId = null;
        } else if (!timerId) {
            timerId = setTimeout( () => shouldFire = true, timer);
        }
    }
    container.addEventListener(event, eventWrapper);
    return function removeListener() {
        container.removeEventListener(event, eventWrapper);
    }
}

// debounceEvent(document, 'mousemove', (container, e) => {
//     let page = getMousePos(e);
//     document.querySelectorAll('.square').forEach(square => {
//         let pos = {x: square.offsetLeft + square.offsetWidth / 2, y:square.offsetTop + square.offsetHeight / 2}
//         let diff = {x: page.x - pos.x, y: page.y - pos.y}
//         let transform = `rotateX(${getDegX(diff)}deg) rotateY(${getDegY(diff)}deg)`
//         square.style.transform = transform;
//     })
// }, 100);
