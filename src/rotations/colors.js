let randInt = (max) => Math.floor(Math.random() * max)

let current = Array.from({length: NUM_ROWS},
    () => Array.from({length: NUM_COLS},
        () => {
            let int = randInt(255);
        return {r:int, g:int, b:int}
    })
);
let prev = current.map( inner => inner.slice() );

function setColor(square, {r, g, b}) {
    let rgb = `rgb(${r}, ${g}, ${b})`;
    square.style.backgroundColor = rgb;
}
