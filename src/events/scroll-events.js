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
function wheelScroll (container, { deltaX, deltaY }) {
    let viewBox = moveViewBox(container, deltaX, deltaY);
    setSvgAttr(container, 'viewBox', viewBox.join(','));
}
function addEvent(container, event) {
    let map = {
        'drag': svgDragWrapper,
        // 'mousewheel': wheelScrollWrapper
    }
    if (map[event]) return map[event](container);
    else throw TypeError(`${event} isn't implemented`);
}