function drawStep(prev, current, row, col, damp) {
    current[row][col].x = (
        prev[row - 1][col].x +
        prev[row + 1][col].x +
        prev[row][col - 1].x + 
        prev[row][col + 1].x
    ) / 2 - current[row][col].x;

    current[row][col].x = current[row][col].x * damp;

    current[row][col].y = (
        prev[row - 1][col].y +
        prev[row + 1][col].y +
        prev[row][col - 1].y + 
        prev[row][col + 1].y
    ) / 2 - current[row][col].y;

    current[row][col].y = current[row][col].y * damp;
}
function draw(rows, cols, damp) {
    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols - 1; j++) {
            drawStep(prev, current, i, j, damp);
        }
    }
    
    updateSquares(document.querySelector('.square'), current, cols);

    let temp = prev;
    prev = current;
    current = temp;
}

function updateSquares(squares, current, cols) {
    current.forEach((row, i) => {
        row.forEach((item, j) => {
            setTransform(squares[j + i * cols], current[i][j])
        })
    })
}