const subjectColors = [
  ['#FF6242', '#FF7C69'],   // Red
  ['#5BAEB7', '#81C8D1'],   // Blue
  ['#FA8072', '#FFA8A1'],   // Salmon
  ['#AA8E85', '#C2B4A9'],   // Gray
  ['#C58940', '#D9A468'],   // Brown
  ['#FFA07A', '#FFB59F'],   // Light Salmon
  ['#A17BB9', '#B99BCB'],   // Purple
  ['#87CEFA', '#A2D9FF'],   // Pastel Blue
  ['#FFC300', '#FFD955'],   // Vivid Yellow
  ['#FFB6C1', '#FFC3D0'],   // Pastel Pink
];

var attribuatedSubjectColors = {};

var currentIndex = 0;
function registerSubjectColor(subjectCode) {
  if (attribuatedSubjectColors[subjectCode]) { return; }
  attribuatedSubjectColors[subjectCode] = subjectColors[currentIndex];
  currentIndex = (currentIndex + 1) % subjectColors.length;
}

function getSubjectColor(subjectCode, isLight = false) {
  if (attribuatedSubjectColors[subjectCode]) {
    if (isLight) { return attribuatedSubjectColors[subjectCode][1]; }
    return attribuatedSubjectColors[subjectCode][0];
  }

  registerSubjectColor(subjectCode);
  if (isLight) { return attribuatedSubjectColors[subjectCode][1]; }
  return attribuatedSubjectColors[subjectCode][0];
}

function resetSubjectColors() {
  currentIndex = 0;
  attribuatedSubjectColors = {};
}

export { registerSubjectColor, getSubjectColor, resetSubjectColors };