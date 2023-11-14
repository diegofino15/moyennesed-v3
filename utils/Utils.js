// Core
function _sortMarks(marks, rev=true) {
    marks.sort((a, b) => {
        if (rev ? (a.dateEntered > b.dateEntered) : (a.dateEntered < b.dateEntered)) {
            return 1;
        }
        if (rev ? (a.dateEntered < b.dateEntered) : (a.dateEntered > b.dateEntered)) {
            return -1;
        }
        return 0;
    });
}


// UI
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

function formatAverage(average, decimals=true) {
    if (average == null) { return "--"; }
    if (decimals) { return average.toFixed(2).replace('.', ','); }
    return (Math.round(average * 100) / 100).toString().replace('.', ',');
}

function formatCoefficient(coefficient) {
    if (coefficient == null) { return "--"; }
    return coefficient.toString().replace(".", ",");
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
function formatDate2(givenDate, sub=3) {
    const date = new Date(givenDate);
    return `${date.getDate()} ${monthsNames[date.getMonth()].substring(0, sub)}.`;
}

function capitalizeWords(string) {
    const words = string.trim().toLowerCase().replace("  ", " ").split(" ");
    for (let i = 0; i < words.length; i++) { words[i] = (words[i][0] ?? "").toUpperCase() + words[i].substr(1); }
    return words.join(" ");
}

export { formatMark, formatAverage, formatCoefficient, formatDate, formatDate2, capitalizeWords, _sortMarks };