const popin = '.popin';

const clickHandler = function(e) {
    if (!isDragging) {
        const elementStyle = getComputedStyle(this);

        if (elementStyle.opacity > 0 && elementStyle.cursor == 'pointer') {
            closeHandler();

            document.querySelectorAll(popin + '[data-popin="' + this.dataset.popin + '"]').forEach((target) => {
                target.classList.add(activeCss);
            });

            e.stopPropagation();
        }
    }
};

const closeHandler = function() {   
    document.querySelectorAll(popin).forEach((element) => {
        element.classList.remove(activeCss);
    });
};

document.querySelectorAll('[data-js="popin"]').forEach((button) => {
    button.addEventListener('click', clickHandler);
});

document.querySelectorAll(popin + ' button').forEach((button) => {
    button.addEventListener('click', closeHandler);
});