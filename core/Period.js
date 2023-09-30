import { getFormattedSubject, addSubSubject, sortMarks, _getSortedMarks, calculateAverages, getCacheSubject } from "./Subject";

function getFormattedPeriod(jsonData) {
  var subjects = new Map();
  jsonData.ensembleMatieres.disciplines.map(subjectData => {
    var subject = getFormattedSubject(subjectData)
    const subjectCode = subject.code.length === 0 ? "--" : subject.code;
    if (!subject.isSubSubject) { subjects.set(subjectCode, subject); }
    else { addSubSubject(subjects.get(subjectCode), subject); }
  })
  
  return {
    "code": jsonData.codePeriode,
    "title": jsonData.periode,
    "isFinished": jsonData.cloture,
    "marks": new Array(),
    "subjects": subjects,
    "average": undefined,
    "classAverage": undefined,
  };
}

function addMark(period, mark) {
  period.marks.push(mark);
  period.subjects.get(mark.subjectCode).marks.push(mark);
}

function sortAllMarks(period) {
  period.marks = _getSortedMarks(period.marks);
  period.subjects.forEach(subject => {
    sortMarks(subject);
  });
}

function calculateAllAverages(period) {
  period.average = _getCalculatedGeneralAverage(period);
  period.classAverage = _getCalculatedGeneralClassAverage(period);
}

function _getCalculatedGeneralAverage(period) {
  let sum = 0;
  let coefficient = 0;

  for (let [_, subject] of period.subjects) {
    calculateAverages(subject);
    if (subject.average === undefined) { continue; }
    sum += subject.average * subject.coefficient;
    coefficient += subject.coefficient;
  }

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function _getCalculatedGeneralClassAverage(period) {
  let sum = 0;
  let coefficient = 0;
  
  for (let [_, subject] of period.subjects) {
    if (subject.classAverage === undefined) { continue; }
    sum += subject.classAverage * subject.coefficient;
    coefficient += subject.coefficient;
  }

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function getCachePeriod(period) {
  const subjects = new Array();
  for (let [_, subject] of period.subjects) { subjects.push(getCacheSubject(subject)); }
  
  return {
    "code": period.code,
    "title": period.title,
    "isFinished": period.isFinished,
    "marks": Array.from(period.marks),
    "subjects": Array.from(subjects),
    "average": period.average,
    "classAverage": period.classAverage,
  };
}


export { getFormattedPeriod, addMark, sortAllMarks, calculateAllAverages, getCachePeriod };