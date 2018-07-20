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
        // Generate linked list of siblings
        iyl = updateIYL(minY, i, iyl);
    }
    // Position parent X based on location of children
    positionRoot(tree);
    setExtremes(tree);
}

/*
 * @description - Sets leftmost and rightmost children on parent
 *                and saves their current mod value
 * 
*/
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
    let rightContour = tree.children[i - 1];
    let modRightContour = rightContour.mod;
    let leftContour = tree.children[i];
    let modLeftContour = leftContour.mod;
    while (rightContour && leftContour) {
        // If the rightContour's bottom is lower than the lowest sibling Y, advance pointer?
        if (bottom(rightContour) > iyl.lowY) iyl = iyl.next;
        // Distance between left sibling and current
        let dist = (modRightContour + rightContour.prelim + rightContour.width)
            - (modLeftContour + leftContour.prelim);
        // If left tree is more to the right than the right tree
        if (dist > 0) {
            modLeftContour += dist;
            // Move the curre
            moveSubtree(tree, i, iyl.index, dist);
        }
        let leftBottom = bottom(leftContour),
            rightBottom  = bottom(rightContour);
        
        if (rightBottom <= leftBottom) {
            rightContour = nextRightContour(rightContour);
            if (rightContour) modRightContour += rightContour.mod;
        }
        if (rightBottom <= leftBottom) {
            leftContour = nextLeftContour(leftContour);
            if (leftContour) modLeftContour += leftContour.mod;
        }
    }
    if (!rightContour && leftContour)
        setLeftThread(tree, i, leftContour, modLeftContour);
    else if (rightContour && !leftContour)
        setRightThread(tree, i, rightContour, modRightContour);
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

function setLeftThread(tree, i, contourLeft, modLeftContour) {
    let exLeft = tree.children[0].exLeft;
    exLeft.leftThread = contourLeft;
    let diff = (modLeftContour - contourLeft.mod) - tree.children[0].modLeft;
    exLeft.mod += diff;
    exLeft.prelim -= diff;
    tree.children[0].exLeft = tree.children[i].exLeft;
    tree.children[0].modLeft = tree.children[i - 1].modLeft;
}

function setRightThread(tree, i, contourRight, modRightContour) {
    let exRight = tree.children[i].exRight;
    exRight.rightThread = contourRight;
    let diff = ( modRightContour - contourRight.mod ) - tree.children[i].modRight;
    exRight.mod += diff;
    exRight.prelim -= diff;
    tree.children[i].exRight = tree.children[i - 1].exRight;
    tree.children[i].modRight = tree.children[i - 1].modRight;
}
/*
 * @params tree
 * description: Centers an element over its children
*/
function positionRoot(tree) {
    let first = tree.children[0];
    let last = getLast(tree.children);
    tree.prelim = (first.prelim
        + first.mod
        + last.mod
        + last.prelim
        + last.width
    ) / 2 - t.width / 2;
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
        let nr = i - iylIndex;
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
    let width = randInt(20, 125) + 16;
    let height = 50 + 16;
    let children = [];
    for (let i = 0; i < randInt(0, 9); i++) {
        if (Math.random() > 0.55) {
            let tree = treeGen(depth + 1);
            children.push(tree);
        }
    }
    return new Tree(width, height, depth, children);
}

function defaultAddContent(content, hasChildren, margin = 8) {
    let el = document.createElement('div');
    let styles = el.style;
    styles.position = 'relative';
    styles.border = '1px solid grey';
    styles.margin = `${margin}px`;

    let minusHeight = margin * 2 + 16;
    styles.height = `calc(100% - ${minusHeight}px)`;
    styles.top = '16px';
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

    el.appendChild(addContent(`${node.x}, ${node.y}`));
    node.htmlEl = el;
    return el;
}

function makeConnector(node) {
    function makeBottomLine(node) {
        let bottomLine = document.createElement('div');
        bottomLine.style.width = '1px';
        bottomLine.style.height = '16px';
        bottomLine.style.background = 'black';
        bottomLine.style.position = 'relative';
        bottomLine.style.top = '8px';
        node.htmlEl.appendChild(bottomLine);
    }
    function makeWideLine(node) {
        let parent = node.htmlEl.getBoundingClientRect();
        let leftChild = node.children[0].htmlEl.getBoundingClientRect();
        let rightChild = getLast(node.children).htmlEl;

        let leftStart = leftChild.left + leftChild.width / 2;
        let rightEnd = rightChild.left + rightChild.width / 2;

        let div = document.createElement('div');
        let styles = div.style;
        styles.position = 'relative';
        styles.bottom = '-8px';
        styles.left = ( leftStart - parent.left ) + 'px';
        styles.width = (rightEnd - leftStart) + 'px';
        styles.height = '1px';
        styles.background = 'black';
        node.htmlEl.appendChild(div);
        return div;
    }
    function makeChildPointers(node, wideLine) {
        let pointers = document.createElement('div');
        let styles = pointers.style;
        styles.position = 'relative';
        styles.width = wideLine.offsetWidth + 'px';
        styles.left = wideLine.style.left;
        styles.top = '8px';
        let wideLineBox = wideLine.getBoundingClientRect();
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i].htmlEl.getBoundingClientRect();
            let start = child.left + child.width / 2;
            let pointer = document.createElement('div');
            pointer.style.position = 'absolute';
            pointer.style.width = '1px';
            pointer.style.height = '8px';
            pointer.style.background = 'black';
            pointer.style.left = (start - wideLineBox.left) + 'px';
            pointers.appendChild(pointer);
        }
        node.htmlEl.appendChild(pointers);
    }
    if (node.children.length) {
        makeBottomLine(node);
        let line = makeWideLine(node);
        makeChildPointers(node, line);
    }
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
function drawConnectors(tree) {
    if (tree.children.length) {
        makeConnector(tree);
    }
    for (let child of tree.children) {
        drawConnectors(child);
    }
}
function renderTree(rootEl, tree) {
    drawTree(rootEl, tree);
    drawConnectors(tree);
}