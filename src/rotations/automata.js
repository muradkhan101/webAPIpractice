function drawStep(prev, current, row, col, damp) {
    let item = current[row][col];
    
    Object.keys(item).forEach(key => {
        item[key] = (
            prev[row - 1][col][key] +
            prev[row + 1][col][key] +
            prev[row][col - 1][key] + 
            prev[row][col + 1][key]
        ) / 2 - current[row][col][key];
        item[key] = item[key] * damp;
    })

}
function draw(rows, cols, damp, transformer) {
    let shouldDraw = true;
    function inner() {
         for (let i = 1; i < rows - 1; i++) {
            for (let j = 1; j < cols - 1; j++) {
                drawStep(prev, current, i, j, damp);
            }
        }
        updateSquares(document.querySelectorAll('.square'), transformer, current, cols);

        let temp = prev;
        prev = current;
        current = temp;
        if (shouldDraw)
            window.requestAnimationFrame(() => inner());
    }
   inner();
    return () => (shouldDraw = !shouldDraw, inner());
}

function updateSquares(squares, transformer, current, cols) {
    current.forEach((row, i) => {
        row.forEach((item, j) => {
            transformer(squares[j + i * cols], current[i][j])
        })
    })
}
