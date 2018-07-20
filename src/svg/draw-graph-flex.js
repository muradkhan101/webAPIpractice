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
            let info = node.querySelector('.content');
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
    div.classList.add('content');
    node.appendChild(div);
    return node;
}

function drawConnectors(node) {
    let childs = node.querySelector('.childs')
    if (childs.children.length) {
        drawConnector(node, childs);
        Array.prototype.forEach.call(childs.children,
            (child) => drawConnectors(child)
        );
    }
}
function drawConnector(node, childs) {
    let span = document.createElement('span');
    span.classList.add('treeConnector');
    let parent = node.getBoundingClientRect();

    let children = childs.children;
    let fChild = children[0].getBoundingClientRect();
    let lChild = children[children.length - 1].getBoundingClientRect();
    let width = Math.abs((lChild.left + lChild.width / 2) - (fChild.left + fChild.width / 2));
    let moveLeft = (fChild.left + fChild.width / 2) - parent.left;
    span.style.left = moveLeft + 'px';
    span.style.width = width + 'px';
    node.insertBefore(span, childs);
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
    .content {
        border: 1px solid grey;
        display: inline-block;
        padding: 12px 16px;
    }
    .treeConnector { display: block; position: relative; }
    .treeConnector::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #313131;
    }
    .hidden {
        display: none;
    }`;
    document.querySelector('head').appendChild(style);
}

function addClickListeners(node) {
    node.addEventListener('click', function(e) {
        let t = event.target;
        if (event.target.tagName === 'SPAN') {
            t = t.parentElement;
        }
        t.querySelector('.childs').classList.toggle('hidden');
    })
}

function findDeepest(root, deepest = -Infinity, depth = 0) {
    let childs = root.querySelector('childs');
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

function findNodeAtDepth(root, depth, currentDepth = 0) {
    let childs = root.querySelector('childs');
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