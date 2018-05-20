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
    let sqrt = Math.sign(y) * Math.sqrt(Math.abs(y));
    return sqrt / Math.sqrt(window.innerWidth) * max;
}

let getDegY = ({x}, max = 60) => {
    let sqrt = Math.sign(x) * Math.sqrt(Math.abs(x));
    return sqrt / Math.sqrt(window.innerWidth) * max;
}

let getMousePos = ({pageX, pageY}) => ({x: pageX, y: pageY})
let squared = (...arg) => arg.reduce((total, i) => total + i * i, 0)
document.addEventListener('mousemove', function(e) {
    let page = getMousePos(e);
    document.querySelectorAll('.square').forEach(square => {
        let pos = {x: square.offsetLeft + square.offsetWidth / 2, y:square.offsetTop + square.offsetHeight / 2}
        let diff = {x: page.x - pos.x, y: page.y - pos.y}
        let transform = `rotateX(${getDegX(diff)}deg) rotateY(${getDegY(diff)}deg)`
        square.style.transform = transform;
    })
})