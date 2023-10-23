import { Preferences } from "./Preferences";
import { CoefficientManager } from "./CoefficientsManager";
import { capitalizeWords } from "../utils/Utils";


function getFormattedSubject(jsonData) {
  const subjectID = jsonData.id;
  
  var coefficient = CoefficientManager.setDefaultEDSubjectCoefficient(subjectID, parseFloat(jsonData.coef.toString().replace(",", ".")));
  var coefficientType = 0;
  var newCoefficient;
  if (Preferences.allowGuessSubjectCoefficients) {
    newCoefficient = CoefficientManager.getGuessedSubjectCoefficient(jsonData.id, jsonData.codeMatiere, jsonData.codeSousMatiere, jsonData.discipline);
    if (newCoefficient) {
      coefficient = newCoefficient;
      coefficientType = 1;
    }
  }
  if (Preferences.allowCustomCoefficients) {
    newCoefficient = CoefficientManager.getCustomSubjectCoefficient(subjectID);
    if (newCoefficient != undefined) {
      coefficient = newCoefficient;
      coefficientType = 2;
    }
  }

  var teachers = new Array();
  jsonData.professeurs.forEach(teacher => {
    teachers.push(teacher.nom);
  });
  
  return {
    "id": subjectID,
    "name": capitalizeWords(jsonData.discipline ?? "---"),
    "teachers": teachers,
    
    "isSubSubject": jsonData.sousMatiere,
    "subSubjects": new Map(),

    "marks": new Array(),
    "average": undefined,
    "classAverage": undefined,
    
    "coefficient": coefficient,
    "coefficientType": coefficientType,

    "code": jsonData.codeMatiere.isEmpty ? "---" : jsonData.codeMatiere,
    "subCode": jsonData.codeSousMatiere,
    "subjectGroupID": jsonData.idGroupeMatiere,
  };
}

function addSubSubject(subject, subSubject) {
  subject.subSubjects.set(subSubject.subCode, subSubject);
}

function addMarkToSubject(subject, mark) {
  if (mark.subSubjectCode) {
    if (subject.subSubjects.has(mark.subSubjectCode)) {
      addMarkToSubject(subject.subSubjects.get(mark.subSubjectCode), mark);
    }
  }
  subject.marks.push(mark);
}

function sortMarks(subject) {
  _sortMarks(subject.marks);
  for (let [_, subSubject] of subject.subSubjects) {
    _sortMarks(subSubject.marks);
  }
}

function _sortMarks(marks) {
  marks.sort((a, b) => {
    if (a.dateEntered < b.dateEntered) {
      return 1;
    }
    if (a.dateEntered > b.dateEntered) {
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

  if (subject.subSubjects.size == 0) {
    subject.marks.forEach(mark => {
      if (mark.isEffective) {
        sum += (mark.value / mark.valueOn * 20) * mark.coefficient;
        coefficient += mark.coefficient;
      }
    });
  }

  subject.subSubjects.forEach((subSubject, _) => {
    if (subSubject.marks.length != 0) {
      sum += _getCalculatedAverage(subSubject) * subSubject.coefficient;
      coefficient += subSubject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function _getCalculatedClassAverage(subject) {
  let sum = 0;
  let coefficient = 0;

  if (subject.subSubjects.size == 0) {
    subject.marks.forEach(mark => {
      if (mark.isEffective && mark.classValue) {
        sum += (mark.classValue / mark.valueOn * 20) * mark.coefficient;
        coefficient += mark.coefficient;
      }
    });
  }

  subject.subSubjects.forEach((subSubject, _) => {
    let subSubjectsAverage = _getCalculatedClassAverage(subSubject);
    if (subSubjectsAverage) {
      sum += subSubjectsAverage * subSubject.coefficient;
      coefficient += subSubject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function getCacheSubject(subject) {
  return {
    "id": subject.id,
    "name": subject.name,
    "teachers": subject.teachers,

    "isSubSubject": subject.isSubSubject,
    "subSubjects": Array.from(subject.subSubjects.entries()),

    "marks": subject.marks,
    "average": subject.average,
    "classAverage": subject.classAverage,

    "coefficient": subject.coefficient,
    "coefficientType": subject.coefficientType,

    "code": subject.code,
    "subCode": subject.subCode,
    "subjectGroupID": subject.subjectGroupID,
  };
}

function getSubjectFromCache(cacheSubject) {
  return {
    "id": cacheSubject.id,
    "name": cacheSubject.name,
    "teachers": cacheSubject.teachers,

    "isSubSubject": cacheSubject.isSubSubject,
    "subSubjects": new Map(cacheSubject.subSubjects),

    "marks": cacheSubject.marks,
    "average": cacheSubject.average,
    "classAverage": cacheSubject.classAverage,

    "coefficient": cacheSubject.coefficient,
    "coefficientType": cacheSubject.coefficientType,

    "code": cacheSubject.code,
    "subCode": cacheSubject.subCode,
    "subjectGroupID": cacheSubject.subjectGroupID,
  };  
}

export { getFormattedSubject, addSubSubject, addMarkToSubject, sortMarks, _sortMarks, calculateAverages, getCacheSubject, getSubjectFromCache };