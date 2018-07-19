class Node {
    constructor( info ) {
        this.info = info;
        this.children = [];
        this.getMaxWidth = () => Array.apply(null, { length: this.getDepth() + 1 })
                .reduce((max, _, i) => Math.max(max, this.getWidthAtLevel(i)), -Infinity)
    }
    updateInfo( newInfo ) {
        this.info = newInfo;
        return this;
    }
    addChild( child ) {
        this.children.push( child );
        return this;
    }
    addChildren(...children) {
        this.children.push(...children);
        return this;
    }
    getDepth() {
        return 1 + Math.max(
            ...this.children.map(child => child.getDepth()), 0
        )
    }
    getWidthAtLevel(n) {
        if (n === 0) return 0;
        if (n === 1) return 1;
        return this.children.reduce( (count, child) => count + child.getWidthAtLevel(n - 1), 0)
    }

    drawStr(depth = 0, ind = this.getMaxWidth(), str) {
        if (depth === 0) {
            let width = this.getMaxWidth();
            let depth = this.getDepth();
            str = Array.from({length: depth}).map( () =>
                Array.from({length: width * 2}).map(() => '*')
            )
        }
        let putInd = ind;
        while (str[depth][putInd] !== '*') {
            if ( ind < Math.floor(str[0].length / 2)) putInd--;
            else putInd++;
        }
        str[depth][putInd] = this.info;
        this.children.forEach( (child, i) => {
            let len = this.children.length;
            let nextInd = ind - len % 2 ? (ind - Math.floor(len / 2) +  i) : (ind - len / 2 +  i);
            child.drawStr(depth + 1, nextInd, str);
        })
        return str.map(a => a.join(' ') + '\n').join('');
    }
}
function getRandInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomTree(size = 20, deep = false) {
    let nodes = [];
    nodes.push(new Node('s'));
    if (deep) {
        nodes[0].addChild(new Node('-1'));
        for (let i = 0; i < size; i++) {
            let depth = nodes[0].getDepth();
            let level = getRandInt(depth, depth / 1.5);
            let currentDepth = 0;
            let toAdd = nodes[0];
            while (currentDepth < level) {
                let childrenCount = toAdd.children.length;
                let newChild = toAdd.children[getRandInt(childrenCount - 1)];
                toAdd = newChild ? newChild : toAdd;
                currentDepth++;
            }
            toAdd.addChild(new Node(i));
        }
    } else {
        for (let i = 0; i < size; i++) {
            let newNode = new Node(i);
            nodes[ getRandInt(nodes.length) ].addChild(newNode);
            nodes.push(newNode);
        }
    }
    return nodes[0];
}