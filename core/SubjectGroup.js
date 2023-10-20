function getFormattedSubjectGroup(jsonData) {
  return {
    "id": jsonData.id,
    "name": jsonData.discipline.toUpperCase(),
    "subjectCodes": new Array(),
    "average": undefined,
  };
}

function addSubject(subjectGroup, subjectCode) {
  subjectGroup.subjectCodes.push(subjectCode);
}


export { getFormattedSubjectGroup, addSubject };