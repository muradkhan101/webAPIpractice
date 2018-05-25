
let NUM_ROWS = 24;
let NUM_COLS = 24;
let SQ_SIZE = 25;

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

function setUpListener(max) {
    document.querySelector('.square-grid').addEventListener('click', (e) => {
        let target = e.target;
        let row = +target.getAttribute('row');
        let col = +target.getAttribute('column');
        Object.keys(current[row][col]).forEach(key => current[row][col][key] = max);
    })
}

let setup = (appendTo = document.querySelector('body'), max = 255, rows = NUM_ROWS, cols = NUM_COLS, sq_size = SQ_SIZE) => {
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
    setUpListener(max);
}