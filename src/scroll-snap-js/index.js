var itemCount = document.querySelectorAll('.item').length;
var container = document.querySelector('.container');
var navigation = document.querySelector('.navigation');
for (let i = 0; i < itemCount; i++) {
    const marker = document.createElement('div');
    marker.classList.add('marker');
    navigation.appendChild(marker);
}
navigation.children[0].classList.add('active');

function animatedScroll(el, from, to, time, dir = 'vertical') {
    const startTime = Date.now();
    const diff = to - from;
    function scroll(at) {
        const scrollLeft = to - at;
        if (Math.abs(scrollLeft) < 1) return;
        const timePassed = Date.now() - startTime;
        const mult = Math.pow(Math.min(1, timePassed / time), 2);
        // const mult = Math.min(1, Math.sqrt(timePassed / time));
        const scrollDist = (from + mult * diff) - at;
        if (dir === 'horizontal')
            el.scrollLeft += scrollDist;
        else
            el.scrollTop += scrollDist;
        window.requestAnimationFrame(() => {
            scroll(at + scrollDist);
        });
    }
    scroll(from);
}

function setUpScrollSnap(container, pos = 'start') {
    let count = 0;
    container.addEventListener('scroll', () => {
        count++;
        let ref = count;
        setTimeout(() => {
            if (ref !== count) return;
            const scrollAmt = container.scrollTop;
            const children = container.children;
            let width = 0;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const lastWidth = width;
                width = addDist(width, child.offsetHeight
                    + (parseInt(getComputedStyle(child).marginBottom) || 0)
                    + (parseInt(getComputedStyle(child).marginTop) || 0), pos);
                if (scrollAmt < (width + lastWidth) / 2) {
                    Array.from(navigation.children).forEach(nChild => nChild.classList.remove('active'));
                    navigation.children[i].classList.add('active');
                    // child.scrollIntoView();
                    animatedScroll(child.parentElement, scrollAmt, lastWidth, 250);
                    break;
                }
            }
        }, 50);

    });
}

function addDist(currentTotal, nextAmt, pos) {
    if (pos === 'center') {
        return currentTotal + 3 * nextAmt / 2;
    } else if (pos === 'end') {
        return currentTotal + 2 * nextAmt;
    } else {
        return currentTotal + nextAmt;
    }
}

setUpScrollSnap(container, 'start');