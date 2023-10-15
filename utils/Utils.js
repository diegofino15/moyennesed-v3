function formatMark(mark, isClass) {
    if (!isClass) {
        if (!mark.value) { return mark.valueStr; }
        if (mark.valueOn != 20) { return `${mark.value.toString().replace(".", ",")}/${mark.valueOn.toString().replace(".", ",")}`; }
        return mark.value.toString().replace(".", ",");
    } else {
        if (!mark.classValue) { return "--"; }
        if (mark.valueOn != 20) { return `${mark.classValue.toString().replace(".", ",")}/${mark.valueOn.toString().replace(".", ",")}`; }
        return mark.classValue.toString().replace(".", ","); 
    }
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
function formatDate2(givenDate) {
    const date = new Date(givenDate);
    return `${date.getDate()} ${monthsNames[date.getMonth()].substring(0, 3)}.`;
}

export { formatMark, formatAverage, formatDate, formatDate2 };