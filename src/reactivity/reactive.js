class Dependency {
    constructor() {
        this.subscribers = [];
    }
    update() {
        this.subscribers.forEach(sub => sub());
    }
    watch() {
        if (toWatch && !this.subscribers.includes(toWatch)) {
            this.subscribers.push(toWatch)
        }
    }
}

let toWatch = null;

function setWatchingProxy(obj) {
    let depMap = new Map();
    return new Proxy( obj,
        {
            get: (obj, key) => {
                let dep = depMap.get(key);
                if (!dep) {
                    dep = new Dependency();
                    depMap.set(key, dep);
                }
                dep.watch();
                return obj[key];
            },
            set: (obj, key, val) => {
                obj[key] = val;
                let dep = depMap.get(key);
                if (dep) dep.update();
                return true;
            },
            deleteProperty: (obj, key) => {
                depMap.delete(key);
                delete obj[key];
            },
        }
    )
}

function watcher(func) {
    toWatch = func;
    toWatch();
    toWatch = null;
}
