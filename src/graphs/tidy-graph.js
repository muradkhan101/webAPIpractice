class DrawTree {
    constructor(tree, parent = null, depth = 0, number = 1) {
        this.x = 0;
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
        let arr = node.children[ node.children.length - 1];

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
        
    }
}