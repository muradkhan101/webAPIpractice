let ns = 'http://www.w3.org/2000/svg';

let width = 50;
let height = 50;
let padding = 10;

// Graph is being drawn!
// Just need to figure out collisions and spacing
// Branches need to be aware of eachother somehow
// Maybe if each subgraph is its own group
// and subgraph are positioned relative to parent rather than root?
// That way, repositioning can happen by just moving the first parent of colliding group

function drawSvgTree(tree) {
    let svg = document.createElementNS(ns, 'svg');

    let maxWidth = tree.getMaxWidth() * (width + padding);
    let maxHeight = tree.getDepth() * (height + padding);
    setAtt(svg, 'width', maxWidth * 2);
    setAtt(svg, 'height', maxHeight);

    let g = document.createElementNS(ns, 'g');
    g.appendChild(makeNode(tree));
    setAtt(g, 'transform', `translate(${[maxWidth / 2, 0].join(',')})`);
    drawSubTree(tree, g, g);
    svg.appendChild(g);
    return svg;
}

function drawSubTree(n, parent, root) {
    let position = parent.getAttributeNS(null, 'transform').replace(/[^\d\.,]/g, '').split(',').map( parseFloat );
    n.children.forEach((child, i) => {
        let order = Math.floor(n.children.length / 2) - i;
        let node = makeNode(child);
        let newPosition = n.children.length % 2 === 0
                            ? [position[0] + (width + padding) * order - (width + padding) / 2, position[1] + height]
                            : [position[0] + (width + padding) * order, position[1] + height];
        node.setAttributeNS(null, 'transform', `translate(${newPosition.join(',')})`);
        root.appendChild(node);
        drawSubTree(child, node, root);
    });
}

function makeNode(node) {
    let group = document.createElementNS(ns, 'g');
    let rect = document.createElementNS(ns, 'rect');
    setSize(
        setAtt(rect, 'fill', 'rgba(0,0,0,0)'),
        width, height
    )
    group.appendChild(rect);
    setInfo(group, node.info);
    return group;
}

function setInfo(el, info) {
    let text = document.createElementNS(ns, 'text');
    text.innerHTML = info;
    el.appendChild(text);
}

function setAtt(el, attr, val) { el.setAttributeNS(null, attr, val); return el;}
function setSize(el, width, height) {
    setAtt(el, 'width', width);
    setAtt(el, 'height', height);
    return el;
}