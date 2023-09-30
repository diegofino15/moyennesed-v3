import { Preferences } from "./Preferences";
import { getSubjectCoefficient } from "../utils/CoefficientsManager";


function getFormattedSubject(jsonData) {
  var coefficient = parseFloat(jsonData.coef.toString().replace(",", "."));
  if (coefficient === 0) { coefficient = 1; }

  var teachers = new Array();
  jsonData.professeurs.forEach(teacher => {
    teachers.push(teacher.nom);
  });
  
  return {
    "id": jsonData.id,
    "name": jsonData.discipline ?? "---",
    "code": jsonData.codeMatiere.isEmpty ? "---" : jsonData.codeMatiere,
    "subCode": jsonData.codeSousMatiere,
    "isSubSubject": jsonData.sousMatiere,
    "subSubjects": new Map(),
    "teachers": teachers,
    "marks": new Array(),
    "average": undefined,
    "classAverage": undefined,
    "coefficient": Preferences.guessSubjectCoefficients ? getSubjectCoefficient(jsonData.discipline ?? "") : coefficient,
  };
}

function addSubSubject(subject, subSubject) {
  subject.subSubjects.set(subSubject.subCode, subSubject);
}

function addMark(subject, mark) {
  subject.marks.push(mark);
}

function sortMarks(subject) {
  subject.marks = _getSortedMarks(subject.marks);
  for (let [_, subSubject] of subject.subSubjects) {
    sortMarks(subSubject);
  }
}

function _getSortedMarks(marks) {
  return marks.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  });
}

function calculateAverages(subject) {
  for (let [_, subSubject] of subject.subSubjects) {
    calculateAverages(subSubject);
  }

  subject.average = _getCalculatedAverage(subject);
  subject.classAverage = _getCalculatedClassAverage(subject);
}

function _getCalculatedAverage(subject) {
  let sum = 0;
  let coefficient = 0;

  subject.marks.forEach(mark => {
    if (mark.isEffective) {
      sum += (mark.value / mark.valueOn * 20) * mark.coefficient;
      coefficient += mark.coefficient;
    }
  });

  for (let [_, subSubject] of subject.subSubjects) {
    if (subSubject.marks.length === 0) { continue; }
    sum += (subSubject.average ? subSubject.average : _getCalculatedAverage(subSubject)) * subSubject.coefficient;
    coefficient += subSubject.coefficient;
  }

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function _getCalculatedClassAverage(subject) {
  let sum = 0;
  let coefficient = 0;

  subject.marks.forEach(mark => {
    if (mark.isEffective) {
      sum += (mark.classValue / mark.valueOn * 20) * mark.coefficient;
      coefficient += mark.coefficient;
    }
  });

  for (let [_, subSubject] of subject.subSubjects) {
    if (subSubject.marks.length === 0) { continue; }
    sum += (subSubject.classAverage ? subSubject.classAverage : _getCalculatedClassAverage(subSubject)) * subSubject.coefficient;
    coefficient += subSubject.coefficient;
  }

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function getCacheSubject(subject) {
  return {
    "id": subject.id,
    "name": subject.name,
    "code": subject.code,
    "subCode": subject.subCode,
    "isSubSubject": subject.isSubSubject,
    "subSubjects": Array.from(subject.subSubjects.values()),
    "teachers": subject.teachers,
    "marks": Array.from(subject.marks),
    "average": subject.average,
    "classAverage": subject.classAverage,
    "coefficient": subject.coefficient,
  };
}


export { getFormattedSubject, addSubSubject, addMark, sortMarks, _getSortedMarks, calculateAverages, getCacheSubject };