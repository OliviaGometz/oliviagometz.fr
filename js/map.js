const html = document.getElementsByTagName('html')[0];
const container = document.getElementsByClassName('map')[0];
const zoomButtons = {
    minus: document.getElementById('zoomMinus'),
    plus: document.getElementById('zoomPlus'),
};
const scaleElement = {};

['a', 'b', 'c'].forEach(letter => {
    scaleElement[letter] = document.getElementsByClassName('level-' + letter)[0];
});

const grabbingCss = 'js-grabbing';

// Is dragging var

var isDragging = false;

// Moove with grab

let pos = { top: 0, left: 0, x: 0, y: 0 };

const mouseMoveHandler = function(e) {
    isDragging = true;

    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    html.scrollLeft = pos.left - dx;
    html.scrollTop = pos.top - dy;
};

const mouseUpHandler = function() {
    container.removeEventListener('mousemove', mouseMoveHandler);
    container.removeEventListener('mouseup', mouseUpHandler);

    container.classList.remove(grabbingCss);
};

const mouseDownHandler = function(e) {
    isDragging = false;
    container.classList.add(grabbingCss);

    pos = {
        // The current scroll 
        left: html.scrollLeft,
        top: html.scrollTop,
        // The current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    container.addEventListener('mousemove', mouseMoveHandler);
    container.addEventListener('mouseup', mouseUpHandler);
};

container.addEventListener('mousedown', mouseDownHandler);

// Zoom

const minZoom = 1;
const maxZoom = 4.5;
let zoom = 1;

/**
 * 
 * @param {number} z 
 */
const setZoom = function(z) {
    zoom += z;

    if (zoom <= minZoom) {
        zoom = minZoom;
        zoomButtons.minus.setAttribute('disabled', 'disabled');
    } else if (zoom >= maxZoom) {
        zoom = maxZoom;
        zoomButtons.plus.setAttribute('disabled', 'disabled');
    } else {
        zoom = Math.round(zoom * 100) / 100;
        zoomButtons.minus.removeAttribute('disabled');
        zoomButtons.plus.removeAttribute('disabled');
    }
};

const scaleWidth = {
    a: 18,
    b: 10.8,
    c: 5.4
};

const mapZoom = function() {
    html.setAttribute('data-zoom', Math.round(zoom * 2) / 2);
    container.style.width = zoom * 100 + '%';

    for (const [key, value] of Object.entries(scaleWidth)) {
        scaleElement[key].style.width = (zoom * value) + 'vw';
    }
};

// Zoom with buttons

zoomButtons.minus.addEventListener('click', function() {
    setZoom(-0.5);
    mapZoom();
});

zoomButtons.plus.addEventListener('click', function() {
    setZoom(0.5);
    mapZoom();
});

// Zoom with wheel

container.addEventListener('wheel', function(e) {
    if (!(e.ctrlKey || e.metaKey)) {
        return;
    }
    e.preventDefault();

    setZoom(e.deltaY < 0 ? 0.1 : -0.1);
    mapZoom(zoom);
    return;
});
