function getFormattedSubjectGroup(jsonData) {
  return {
    "id": jsonData.id,
    "name": jsonData.discipline.toUpperCase(),
    "subjectCodes": new Array(),
    "average": undefined,
    "classAverage": undefined,
  };
}

function addSubjectToSubjectGroup(subjectGroup, subjectCode) {
  subjectGroup.subjectCodes.push(subjectCode);
}

export { getFormattedSubjectGroup, addSubjectToSubjectGroup };