const subjectColors = [
  ['#FF6242', '#FF7C69'],   // Red
  ['#FA8072', '#FFA8A1'],   // Salmon
  ['#5BAEB7', '#81C8D1'],   // Blue
  ['#FFD700', '#FFE877'],   // Pastel Yellow
  ['#C58940', '#D9A468'],   // Brown
  ['#AA8E85', '#C2B4A9'],   // Gray
  ['#A17BB9', '#B99BCB'],   // Purple
  ['#FFA07A', '#FFB59F'],   // Light Salmon
  ['#87CEFA', '#A2D9FF'],   // Pastel Blue
  ['#FFC300', '#FFD955'],   // Vivid Yellow
  ['#FFB6C1', '#FFC3D0'],   // Pastel Pink
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

  registerSubject(subjectCode);
  if (isLight) { return attribuatedSubjectColors[subjectCode][1]; }
  return attribuatedSubjectColors[subjectCode][0];
}

export { registerSubject, getSubjectColor };