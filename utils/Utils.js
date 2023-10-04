function formatMark(mark) {
    if (mark.value == null) { return "N/A"; }
    if (mark.valueOn != 20) { return `${mark.value.toString().replace(".", ",")}/${mark.valueOn}`; }
    return mark.value.toString().replace(".", ",");
}

function formatAverage(average) {
    if (average == null) { return "--"; }
    return average.toFixed(2).replace(".", ",");
}


export { formatMark, formatAverage };