function getLast(arr) {
    return arr.length
        ? arr[arr.length - 1]
        : undefined;
}

function reverse(arr) { return arr.map( (item, i) => arr[arr.length - 1 - i]); }

// Some docs on what's going on because im not too sure either :P
// http://dirk.jivas.de/papers/buchheim02improving.pdf
// https://llimllib.github.io/pymag-trees/

class DrawTree {
    constructor(tree, parent = null, depth = 0, number = 1) {
        this.x = -1;
        this.y = depth * 10;
        this.tree = tree;
        this.children = tree.children.map((child, i) =>
            new DrawTree(child, this, depth + 1, i + 1))
        this.parent = parent;
        this.thread = null;
        this.offset = 0;
        this.ancestor = this;
        this.change = this.shift = 0;
        this.leftmostSibling = null;
        this.siblingNumber = number;
    }
    left() {
        return this.thread || (this.children.length && this.children[0])
    }
    right() {
        return this.thread || (getLast(this.children))
    }
    getLeftBrother() {
        let leaf = null;
        if (this.parent) {
            for (let sibling of this.parent.children) {
                if (sibling === this) return leaf;
                else leaf = sibling
            }
        }
        return leaf;
    }
    getLeftMostSibling() {
        if (!this.leftmostSibling
            && this.parent
            && this !== this.parent.children[0]) this.leftmostSibling = this.parent.children[0]
        return this.leftmostSibling;
    }
}

function buchheim(tree) {
    let dt = firstWalk(tree);
    return secondWalk(tree);
}

function firstWalk(node, distance = 1) {
    if (node.children.length === 0) {
        if (node.getLeftMostSibling()) {
            this.x = this.getLeftBrother().x + distance
        } else {
            this.x = 0;
        }
    } else {
        let defaultAncestor = node.children[0];
        for (let child of node.children) {
            firstWalk(child)
            defaultAncestor = apportion(child, defaultAncestor, distance)
        }
        executeShifts(node)
        let ell = node.children[0];
        let arr = getLast(node.children);

        let midpoint = (ell.x + arr.x) / 2;
        let sibling = node.getLeftBrother();
        if (sibling) {
            node.x = sibling.x + distance;
            node.mod = node.x - midpoint;
        } else {
            this.x = midpoint;
        }
    }
    return node;
}

function apportion(node, defaultAncestor, distance) {
    let sibling = node.getLeftBrother();
    if (sibling) {
        let vir = vor = node;
        let vil = sibling;
        let vol = node.leftmostSibling();
        let sir = sor = node.offset;
        let sil = vil.offset;
        let sol = vol.offset;
        while (vil.right() &&  vir.left()) {
            vil = vil.right();
            vir = vir.left();
            vol = vol.left();
            vor = vor.right();
            vor.ancestor = node;
            shift = (vil.x + sil) - (vir.x + sir) + distance;
            if (shift > 0) {
                moveSubtree(ancestor(vil, node, defaultAncestor), node, shift);
                sir = sir + shift;
                sor = sor + shift;
            }
            sil += vil.offset;
            sir += vir.offset;
            sol += vol.offset;
            sor += vor.offset;
        }
        if (vil.right() && vor.right()) {
            vor.thread = vil.right();
            vor.offset += (sil - sor);
        } else {
            if (vir.left() && !vol.left()) {
                vol.thread = vir.left();
                vol.offset += (sir - sol);
            }
            defaultAncestor = v;
        }
        return defaultAncestor;
    }
}

function moveSubtree(leftTree, rightTree, shift) {
    let subtrees = rightTree.number - leftTree.number;
    rightTree.change -= shift / subtrees;
    rightTree.shift += shift;
    leftTree.change += shift / subtrees;
    rightTree.x += shift;
    rightTree.offset += shift;
}

function executeShifts(node) {
    let shift = change = 0;
    for (let child of reverse(node.children)) {
        child.x += shift;
        child.offset += shift;
        change += child.change;
        shift += child.shift + change;
    }
}

function ancestor(vil, node, defaultAncestor) {
    if ( node.parent.children.indexOf(vil.ancestor) !== -1 ) {
        return vil.ancestor;
    } else {
        return defaultAncestor;
    }
}

function secondWalk(node, m = 0, depth = 0, min = null) {
    node.x += m;
    node.y = depth;

    if (!min || node.x < min) 
        min = node.x;
    
    for (let child of node.children) {
        min = secondWalk(child, m + node.offset, depth + 1, min)
    }
    return min;
}