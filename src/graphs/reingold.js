function getLast(arr) {
    return arr.length
        ? arr[arr.length - 1]
        : undefined;
}

class Tree {
    constructor(width, height, y, children) {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = y;
        this.children = children;

        this.shift = 0;
        this.change = 0;
        this.mod = 0;
        this.modLeft = 0;
        this.modRight = 0;
        this.prelim = 0;

        this.exLeft = null;
        this.exRight = null;
        this.rightThread = null;
        this.leftThread = null;
    }
}

function layout(tree) {
    firstWalk(tree);
    secondWalk(tree, 0);
}

function firstWalk(tree) {
    if (tree.children.length === 0) {
        setExtremes(tree);
        return;
    }
    firstWalk(tree.children[0]);
    let iyl = updateIYL( bottom(tree.children[0].exLeft), 0, null );
    for (let i = 1; i < tree.children.length; i++) {
        firstWalk(tree.children[i]);
        let minY = bottom(tree.children[i].exRight);
        separate(tree, i, iyl);
        iyl = updateIYL(minY, i, iyl);
    }
    positionRoot(tree);
    setExtremes(tree);
}

function setExtremes(tree) {
    if (tree.children.length === 0) {
        tree.exLeft = tree;
        tree.exRight = tree;
        tree.modLeft = 0;
        tree.modRight = 0;
    } else {
        tree.exLeft = tree.children[0].exLeft;
        tree.modLeft = tree.children[0].modLeft;
        tree.exRight = getLast(tree.children).exRight;
        tree.modRight = getLast(tree.children).modRight;
    }
}

function separate(tree, i, iyl) {
    let contourRight = tree.children[i - 1];
    let sumModRight = contourRight.mod;
    let contourLeft = tree.children[i];
    let sumModLeft = contourLeft.mod;
    while (contourRight && contourLeft) {
        if (bottom(contourRight) > iyl.lowY) iyl = iyl.next;
        let dist = (sumModRight + contourRight.prelim + contourRight.width) - (sumModLeft + contourLeft.prelim);
        if (dist > 0) {
            sumModLeft += dist;
            moveSubtree(tree, i, iyl.index, dist);
        }
        let minContRight = bottom(contourRight),
            minContLeft  = bottom(contourLeft);
        
            if (minContRight <= minContLeft) {
                contourRight = nextRightContour(contourRight);
                if (contourRight) sumModRight += contourRight.mod;
            }
            if (minContRight >= minContLeft) {
                contourLeft = nextLeftContour(contourLeft);
                if (contourLeft) sumModLeft += contourLeft.mod;
            }
    }
    if (!contourRight && contourLeft)
        setLeftThread(tree, i, contourLeft, sumModLeft);
    else if (contourRight && !contourLeft)
        setRightThread(tree, i, contourRight, sumModRight);
}

function moveSubtree(tree, i, iylIndex, dist) {
    tree.children[i].mod += dist;
    tree.children[i].modLeft += dist;
    tree.children[i].modRight += dist;
    distributeExtra(tree, i, iylIndex, dist);
}

function nextLeftContour(tree) {
    return tree.children.length === 0
        ? tree.leftThread
        : tree.children[0];
}

function nextRightContour(tree) {
    return tree.children.length === 0
        ? tree.rightThread
        : getLast(tree.children);
}

function bottom(tree) {
    return tree.y + tree.height;
}

function setLeftThread(tree, i, contourLeft, sumModLeft) {
    let exLeft = tree.children[0].exLeft;
    exLeft.leftThread = contourLeft;
    let diff = (sumModLeft - contourLeft.mod) - tree.children[0].modLeft;
    exLeft.mod += diff;
    exLeft.prelim -= diff;
    tree.children[0].exLeft = tree.children[i].exLeft;
    tree.children[0].modLeft = tree.children[i - 1].modLeft;
}

function setRightThread(tree, i, contourRight, sumModRight) {
    let exRight = tree.children[i].exRight;
    exRight.rightThread = contourRight;
    let diff = ( sumModRight - contourRight.mod ) - tree.children[i].modRight;
    exRight.mod += diff;
    exRight.prelim -= diff;
    tree.children[i].exRight = tree.children[i - 1].exRight;
    tree.children[i].modRight = tree.children[i - 1].modRight;
}

function positionRoot(tree) {
    let first = tree.children[0];
    let last = getLast(tree.children);
    tree.prelim = (first.prelim
        + first.mod
        + last.mod
        + last.prelim
        + last.width / 2
        - first.width / 2
    );
}

function secondWalk(tree, mod) {
    mod += tree.mod;
    tree.x = tree.prelim + mod;
    addChildSpacing(tree);
    for (let i = 0; i < tree.children.length; i++) {
        secondWalk(tree.children[i], mod);
    }
}

function distributeExtra(tree, i, iylIndex, dist) {
    if (iylIndex != i - 1) {
        let nr = i - si;
        tree.children[iylIndex + 1].shift += dist / nr;
        tree.children[i].shift -= dist / nr;
        tree.children[i].change -= dist - dist / nr;
    }
}

function addChildSpacing(tree) {
    let d = 0,
        mod = 0;
    for (let i = 0; i < tree.children.length; i++) {
        d += tree.children[i].shift;
        mod += d + tree.children[i].change;
        tree.children[i].mod += mod;
    }
}

// Linked list of indexes of left siblings and lowest coordinate
class IYL {
    constructor(lowY, index, next) {
        this.lowY = lowY;
        this.index = index;
        this.next = next;
    }
}

function updateIYL(minY, i, iyl) {
    while (iyl && minY >= iyl.lowY) iyl = iyl.next;
    return new IYL(minY, i, iyl);
}

// Rendering stuff

function treeGen(depth = 0) {
    let width = randInt(20, 125);
    let height = 50;
    let children = [];
    for (let i = 0; i < randInt(0, 9); i++) {
        if (Math.random() > 0.55) {
            let tree = treeGen(depth + 1);
            children.push(tree);
        }
    }
    return new Tree(width, height, depth, children);
}

function defaultAddContent(content) {
    let el = document.createElement('span');
    el.innerText = content;
    return el;
}

function makeNode(node, top = 0, addContent = defaultAddContent) {
    let el = document.createElement('div');
    let styles = el.style;
    styles.position = 'absolute';
    styles.top = top + 'px';
    styles.left = node.x + 'px';
    styles.width = node.width + 'px';
    styles.height = node.height + 'px';
    styles.border = '1px solid grey';
    el.appendChild(addContent(`${node.x}, ${node.y}`));
    return el;
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function drawTree(rootEl, tree, top = 0) {
    rootEl.appendChild(makeNode(tree, top));
    for (let child of tree.children) {
        drawTree(rootEl, child, top + child.height);
    }
}