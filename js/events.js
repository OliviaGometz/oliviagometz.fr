const cssHidden = 'js-hidden';

// Afficher tous les contenus masqués si l'url se termine par ?private

if (window.location.href.endsWith('?private')) {
    document.querySelectorAll('.' + cssHidden).forEach((element) => {
        element.classList.remove(cssHidden);
    });
}

// Compléter le décompte + appliquer styles appropriés aux événements

const today = new Date();

const dayDiff = function(date) {
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 3600 * 24));
};

const displayDayDiff = function(text, block) {
    const eventDecompte = block.querySelectorAll('.event__decompte')[0];

    if (eventDecompte) {
        eventDecompte.textContent = text;
    }
};

const emphasisImminente = function(block) {
    const details = block.querySelectorAll('details')[0];

    if (details) {
        block.classList.add("card--white--emphasis");
        details.setAttribute("open", true);
    }
};

document.querySelectorAll('[data-js="event"]').forEach((event) => {
    const eventStart = new Date(event.dataset.eventstart);
    const eventEnd = new Date(event.dataset.eventend);

    if (dayDiff(eventEnd) < 0) {
        event.classList.add(cssHidden);
        displayDayDiff('Terminé', event);
    } else if (dayDiff(eventStart) < 1) {
        emphasisImminente(event);
        displayDayDiff('En ce moment', event);
    } else if (dayDiff(eventStart) == 1) {
        emphasisImminente(event);
        displayDayDiff('Demain', event);
    } else if (dayDiff(eventStart) < 11) {
        displayDayDiff('Dans ' + dayDiff(eventStart) + ' jours', event);
    } else if (dayDiff(eventStart) < 28) {
        displayDayDiff('Dans ' + Math.round(dayDiff(eventStart)/7) + ' semaines', event);
    } else {
        displayDayDiff('Dans ' + Math.round(dayDiff(eventStart)/30) + ' mois', event);
    }
});
