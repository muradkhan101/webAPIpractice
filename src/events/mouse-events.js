function makeDragger(container, fn) {
    // Could add support for custom mouseup, mousedown event functions too
    let dragging = false;
    let lastX = null;
    let lastY = null;
    container.style.position = 'absolute';
    function mouseDown({ pageX, pageY }) {
        lastX = pageX;
        lastY = pageY;
        dragging = true;
    }
    function mouseUp() {
        dragging = false;
        lastX = null;
        lastY = null;
    }
    function mouseMove({ pageX, pageY }) {
        if (dragging) {
            fn(container, lastX - pageX, lastY - pageY);
            lastX = pageX;
            lastY = pageY;
        }
    }
    container.addEventListener('mouseup', mouseUp);
    container.addEventListener('mousedown', mouseDown);
    container.addEventListener('mousemove', mouseMove);

    return function removeListeners() {
        container.removeEventListener('mouseup', mouseUp);
        container.removeEventListener('mousedown', mouseDown);
        container.removeEventListener('mousemove', mouseMove);
    }
}
function updateSvgLocation(container, deltaX, deltaY) {
    let viewBox = moveViewBox(container, deltaX, deltaY);
    setSvgAttr(container, 'viewBox', viewBox.join(','));
}
function makeSvgDragger(container) {
    return makeDragger(container, updateSvgLocation);
}

function updateDivLocation(container, deltaX, deltaY) {
    let left = (parseInt(container.style.left) - deltaX) || 1;
    let top = (parseInt(container.style.top) - deltaY) || 1;
    container.style.left = left + 'px';
    container.style.top = top + 'px';
}

// Set final position, interpolate to final with timeouts

