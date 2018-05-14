const NS = 'http://www.w3.org/2000/svg';
class SvgContainer {
    constructor(svgContainer) {
        this.container = svgContainer;
        // let eventContainerWrapper = eventWrapper(this.container);
        makeSvgDragger(svgContainer);
        debounceEvent(svgContainer, 'mousewheel', wheelScroll, 15);
        // addEvent(svgContainer, 'scroll');
        // this.container.addEventListener('')
    }
    async addImage(url) {
        let imgContainer = document.createElementNS(NS, 'image');
        imgContainer.setAttributeNS(null, 'href', url);
        let imgObj = await loadImage(url);
        console.log(imgObj);
        Object.keys(imgObj).forEach(attr => imgContainer.setAttributeNS(null, attr, imgObj[attr]));
        this.container.appendChild(imgContainer);
        return this;
    }
}

function loadImage(url) {
    let img = new Image();
    return new Promise( (resolve, reject) => {
        img.onload = function() {
            resolve({
                width: this.width,
                height: this.height,
                href: url
            });
        }
        img.src = url;
    });
}

makeDragger(document.getElementById('test'), updateDivLocation);