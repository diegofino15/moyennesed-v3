const subjectColors = [
  ['#FF6242', '#FFA590'], // Red
  ['#5BAEB7', '#A5DEF2'], // Blue
  ['#FCCF55', '#FDDF8E'], // Yellow
  ['#658354', '#A3C585'], // Green
  ['#A17BB9', '#C09ADB'], // Purple
  ['#C58940', '#E5BA73'], // Brown
  ['#AA8E85', '#D7C0AE'], // Gray
];

const attribuatedSubjectColors = {};

var currentIndex = 0;
function registerSubject(subjectCode) {
  if (attribuatedSubjectColors[subjectCode]) { return; }
  attribuatedSubjectColors[subjectCode] = subjectColors[currentIndex];
  currentIndex = (currentIndex + 1) % subjectColors.length;
}

function getSubjectColor(subjectCode, isLight = false) {
  if (attribuatedSubjectColors[subjectCode]) {
    if (isLight) { return attribuatedSubjectColors[subjectCode][1]; }
    return attribuatedSubjectColors[subjectCode][0];
  }

  attribuatedSubjectColors[subjectCode] = subjectColors[currentIndex];
  currentIndex = (currentIndex + 1) % subjectColors.length;
  if (isLight) { return attribuatedSubjectColors[subjectCode][1]; }
  return attribuatedSubjectColors[subjectCode][0];
}


export { registerSubject, getSubjectColor };