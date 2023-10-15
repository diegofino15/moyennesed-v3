function formatMark(mark) {
    if (mark.value == null) { return "N/A"; }
    if (mark.valueOn != 20) { return `${mark.value.toString().replace(".", ",")}/${mark.valueOn}`; }
    return mark.valueStr;
}

function formatAverage(average) {
    if (average == null) { return "--"; }
    return average.toFixed(2).replace(".", ",");
}

const daysNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];
const monthsNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];
function formatDate(givenDate) {
    const date = new Date(givenDate);
    return `${daysNames[date.getDay()]} ${date.getDate()} ${monthsNames[date.getMonth()]}`;
}

export { formatMark, formatAverage, formatDate };