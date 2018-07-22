function drawTreeFlex(rootEl, tree, randHeight = false) {
    let {node, children} = makeNodeFlex(tree);
    addClickListeners(node);
    createCssClasses();
    drawSubTreeFlex(tree, children, node, randHeight);
    rootEl.appendChild(node);
    drawConnectors(node);
    return node;
}

function drawSubTreeFlex(tree, parent, root, randHeight = false) {
    tree.children.forEach( (child, i) => {
        let {node, children} = makeNodeFlex(child);
        drawSubTreeFlex(child, children, root, randHeight);
        if (randHeight) {
            let info = node.querySelector('.graph-content');
            info.style.height = getRandInt(55, 25) + 'px';
        }
        parent.appendChild(node);
    });
}

function makeNodeFlex(tree) {
    let node = document.createElement('div');
    addInfo(node, tree.info);
    node.classList.add('subTree');
    let children = document.createElement('div');
    children.classList.add('childs');
    // addAttributes(children);
    node.appendChild(children);
    return {node, children};
}

function addAttributes(node) {
    node.style.display = 'flex';
    node.style.justifyContent = 'space-evenly';
    node.style.flexGrow = '1';
    return node;
}

function addInfo(node, info) {
    let div = document.createElement('div');
    div.innerHTML = info;
    div.classList.add('graph-content');
    node.appendChild(div);
    return node;
}

function drawConnectors(node, depth = 0) {
    let childs = node.querySelector('.childs');
    if (depth > 0) {
        node.insertBefore(makeNodeTopExtender(), node.querySelector('.graph-content'));
    }
    if (childs.children.length) {
        let wideLine = makeWideLine(node, childs);
        node.insertBefore(wideLine, childs);
        updateWideLine(node);
        let bottomLine = makeNodeBottomExtender(node, wideLine);
        node.insertBefore(bottomLine, wideLine);
        Array.prototype.forEach.call(childs.children,
            (child) => drawConnectors(child, depth + 1)
        );
    }
}
function makeNodeBottomExtender() {
    let line = document.createElement('div');
    line.classList.add('bottomConnector');
    return line;
}
function makeNodeTopExtender() {
    let line = document.createElement('div');
    line.classList.add('topConnector');
    return line;
}
function makeWideLine(node) {
    let span = document.createElement('span');
    span.classList.add('treeConnector');
    return span;
}

function updateWideLine(node) {
    let line = node.querySelector('.treeConnector');
    if (line) {
        let children = node.querySelector('.childs').children;
        let parent = node.getBoundingClientRect();
    
        let fChild = children[0].getBoundingClientRect();
        let lChild = children[children.length - 1].getBoundingClientRect();
        let width = Math.abs((lChild.left + lChild.width / 2) - (fChild.left + fChild.width / 2));
        let moveLeft = (fChild.left + fChild.width / 2) - parent.left;
        line.style.left = moveLeft + 'px';
        line.style.width = width + 'px';
    }
}

function createCssClasses() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .subTree {
        margin: 8px;
        text-align: center;
    }
    .childs {
        display: flex;
        justify-content: space-evenly;
        flex-grow: 1;
    }
    .graph-content {
        border: 1px solid grey;
        display: inline-block;
        padding: 12px 16px;
        margin: 8px 4px;
        color: purple;
    }
    .treeConnector { display: block; position: relative; }
    .treeConnector::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: purple;
    }
    .bottomConnector {
        width: 1px;
        height: 16px;
        background: purple;
        margin: 0px auto;
    }
    .topConnector {
        width: 1px;
        height: 16px;
        position: relative;
        background: purple;
        margin: 0 auto;
        top: -8px;
    }
    .hidden {
        display: none;
    }`;
    document.querySelector('head').appendChild(style);
}

function addClickListeners(node) {
    node.addEventListener('click', function(e) {
        let t = event.target;
        let childs = t.querySelector('.childs');
        while (!childs) {
            t = t.parentElement;
            childs = t.querySelector('.childs')
        }
        t.querySelector('.childs').classList.toggle('hidden');
    })
    window.addEventListener('resize', function(e) {
        function updateLines(node) {
            updateWideLine(node);
            let children = node.querySelector('.childs').children;
            Array.from(children).forEach(child => updateLines(child));
        }
        updateLines(node);
    })
}

function findDeepest(root, deepest = -Infinity, depth = 0) {
    let childs = root.querySelector('.childs');
    let deepestNode;
    if (depth > deepest) {
        deepestNode = root;
    }
    Array.from(childs.children)
        .forEach((child) => {
            let { node, nodeDepth } = findDeepest(child, deepest, depth + 1);
            if (nodeDepth > deepest) {
                deepestNode = node;
                deepest = nodeDepth
            }
        })
    return { node: deepestNode, nodeDepth: deepest }
}

function findMostRight(root, farthest = -Infinity, node = root) {
    let childs = root.querySelector('.childs');
    let box = root.getBoundingClientRect();
    if (box.left + box.width > farthest) {
        farthest = box.left + box.width;
        node = root;
    }
    Array.from(childs.children)
        .forEach((child) => {
            let { node: farthestNode, distance } = findMostRight(child, farthest, node);
            if (distance > farthest) {
                node = farthestNode;
                farthest = distance
            }
        })
    return { node: node, distance: farthest }
}

function findNodeAtDepth(root, depth, currentDepth = 0) {
    let childs = root.querySelector('.childs');
    if (depth === currentDepth) {
        return root;
    } else if (childs) {
        for (let i = 0; i < childs.children.length; i++) {
            let node = findDepth(childs.children[i], depth, currentDepth + 1);
            if (node) return node;
        }
    }
    return null
}

