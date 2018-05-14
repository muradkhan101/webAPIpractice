function getSvgAttr(svg, attr, ns = null) {
    return svg.getAttributeNS(ns, attr);
}
function getSvgWidth(svg) {
    // Defaults to 300 since that is size of SVG viewport
    // when no width is set
    return getSvgAttr(svg, 'width') || 300;
}
function getSvgHeight(svg) {
    // Defaults to 150 since that is size of SVG viewport
    // when no height is set
    return getSvgAttr(svg, 'height') || 150;
}
function getViewBox(container) {
    return (getSvgAttr(container, 'viewBox')
        || `0,0,${getSvgWidth(container)},${getSvgHeight(container)}`)
        .split(',')
        .map(num => parseInt(num, 10));
}

function setSvgAttr(svg, attr, val, ns = null) {
    svg.setAttributeNS(ns, attr, val);
    return svg;
}

function moveViewBox(container, deltaX, deltaY) {
    let viewBox = getViewBox(container);
    let boundingBox = container.getBBox();
    viewBox[0] = Math.max(0,
        Math.min(
            viewBox[0] + deltaX,
            boundingBox.width - getSvgWidth(container))
    );
    viewBox[1] = Math.max(0,
        Math.min(
            viewBox[1] + deltaY,
            boundingBox.height - getSvgHeight(container))
    );
    return viewBox;
}