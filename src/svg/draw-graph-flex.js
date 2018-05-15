function drawTreeFlex(tree) {
    let {node, children} = makeNodeFlex(tree);
    addClickListeners(node);
    createCssClasses();
    drawSubTreeFlex(tree, children, node);
    return node;
}

function drawSubTreeFlex(tree, parent, root) {
    tree.children.forEach( (child, i) => {
        let {node, children} = makeNodeFlex(child);
        drawSubTreeFlex(child, children, root);
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
    let span = document.createElement('span');
    span.classList.add('treeConnector');
    span.innerHTML = info;
    node.appendChild(span);
    return node;
}
function createCssClasses() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .subTree {
        padding: 8px;
        border: 1px solid grey;
        text-align: center;
    }
    .childs {
        display: flex;
        justify-content: space-evenly;
        flex-grow: 1;
    }
    .treeConnector { display:block; position: relative; }
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