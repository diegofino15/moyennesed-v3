import { Preferences } from "./Preferences";
import { CoefficientManager } from "./CoefficientsManager";
import { capitalizeWords } from "../utils/Utils";
import { Logger } from "../utils/Logger";


function getFormattedSubject(jsonData) {
  const subjectID = jsonData.id;
  
  var coefficient = CoefficientManager.setDefaultEDSubjectCoefficient(subjectID, parseFloat(jsonData.coef.toString().replace(",", ".")));
  var coefficientType = 0;
  var newCoefficient;
  if (Preferences.allowGuessSubjectCoefficients) {
    newCoefficient = CoefficientManager.getGuessedSubjectCoefficient(subjectID, jsonData.codeMatiere, jsonData.codeSousMatiere, jsonData.discipline);
    if (newCoefficient) {
      coefficient = newCoefficient;
      coefficientType = 1;
    }
  }
  if (Preferences.allowCustomCoefficients) {
    newCoefficient = CoefficientManager.getCustomSubjectCoefficient(subjectID);
    if (newCoefficient) {
      coefficient = newCoefficient;
      coefficientType = 2;
    }
  }

  var teachers = new Array();
  jsonData.professeurs.forEach(teacher => { teachers.push(teacher.nom); });

  return {
    "id": subjectID,
    "name": capitalizeWords(jsonData.discipline ? jsonData.discipline : jsonData.codeMatiere),
    "teachers": teachers,
    
    "isSubSubject": jsonData.sousMatiere,
    "subSubjects": new Map(),

    "marks": new Array(),
    "average": undefined,
    "classAverage": undefined,
    
    "coefficient": coefficient,
    "coefficientType": coefficientType,

    "code": jsonData.codeMatiere ? jsonData.codeMatiere : "---",
    "subCode": jsonData.codeSousMatiere,
    "subjectGroupID": jsonData.idGroupeMatiere,
  };
}

function addSubSubjectToSubject(subject, subSubject) {
  subSubject.name = subSubject.name.replace(subject.name, "").trim();
  subject.subSubjects.set(subSubject.subCode, subSubject);
}

function addMarkToSubject(subject, mark, isCustom) {
  if (mark.subSubjectCode && !subject.isSubSubject) {
    let subSubject = subject.subSubjects.get(mark.subSubjectCode);
    if (subSubject == undefined) {
      Logger.core("Detected mark without sub-subject, creating it...", true);
      subSubject = getFormattedSubject({
        id: parseInt(Math.random().toString(36).substring(2, 9)), // Random ID
        coef: 0,
        codeMatiere: mark.subjectCode,
        codeSousMatiere: mark.subSubjectCode,
        discipline: mark.subSubjectCode,
        professeurs: [],
        sousMatiere: true,
      });
      subject.subSubjects.set(mark.subSubjectCode, subSubject);
    }
    addMarkToSubject(subSubject, mark, isCustom);
  }
  if (!isCustom) { subject.marks.push(mark.id); }
  else { subject.marks.unshift(mark.id); }
}

function calculateSubjectAverages(subject, getMark) {
  for (let [_, subSubject] of subject.subSubjects) {
    calculateSubjectAverages(subSubject, getMark);
  }

  subject.average = _getCalculatedSubjectAverage(subject, getMark, false);
  subject.classAverage = _getCalculatedSubjectAverage(subject, getMark, true);
}

function _getCalculatedSubjectAverage(subject, getMark, isClass, set=true) {
  var sum = 0;
  var coefficient = 0;

  if (subject.subSubjects.size == 0) {
    subject.marks.forEach(markID => {
      let mark = getMark(markID);
      let classCheck = isClass ? mark.classValue : true;
      if (mark.isEffective && classCheck) {
        sum += ((isClass ? mark.classValue : mark.value) / mark.valueOn * 20) * mark.coefficient;
        coefficient += mark.coefficient;
      }
    });
  }

  subject.subSubjects.forEach((subSubject, _) => {
    let subSubjectAverage;
    if (set) {
      calculateSubjectAverages(subSubject, getMark);
      subSubjectAverage = isClass ? subSubject.classAverage : subSubject.average;
    } else {
      subSubjectAverage = _getCalculatedSubjectAverage(subSubject, getMark, isClass, false);
    }
    
    if (subSubjectAverage) {
      sum += subSubjectAverage * subSubject.coefficient;
      coefficient += subSubject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function sortAllSubjectMarks(subject) {
  subject.marks.reverse();
  subject.subSubjects.forEach(subSubject => {
    sortAllSubjectMarks(subSubject);
  });
}

function getCacheSubject(subject) {
  var savableSubSubjects = new Map();
  subject.subSubjects.forEach((subSubject, key) => {
    savableSubSubjects.set(key, getCacheSubject(subSubject));
  });
  
  return {
    "id": subject.id,
    "name": subject.name,
    "teachers": subject.teachers,

    "isSubSubject": subject.isSubSubject,
    "subSubjects": Array.from(savableSubSubjects.entries()),

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
  var subSubjects = new Map();
  try {
    new Map(cacheSubject.subSubjects).forEach((cacheSubSubject, key) => {
      subSubjects.set(key, getSubjectFromCache(cacheSubSubject));
    });
  } catch (e) {
    Logger.load("Invalid cache was loaded, skipping sub subjects...", true);
  }

  var marks = new Array();
  cacheSubject.marks.forEach(mark => {
    if (!mark.id) { marks.push(mark); }
    else { marks.push(mark.id); }
  });
  
  return {
    "id": cacheSubject.id,
    "name": cacheSubject.name,
    "teachers": cacheSubject.teachers,

    "isSubSubject": cacheSubject.isSubSubject,
    "subSubjects": subSubjects,

    "marks": marks,
    "average": cacheSubject.average,
    "classAverage": cacheSubject.classAverage,

    "coefficient": cacheSubject.coefficient,
    "coefficientType": cacheSubject.coefficientType,

    "code": cacheSubject.code,
    "subCode": cacheSubject.subCode,
    "subjectGroupID": cacheSubject.subjectGroupID,
  };  
}

export { getFormattedSubject, addSubSubjectToSubject, addMarkToSubject, calculateSubjectAverages, _getCalculatedSubjectAverage, sortAllSubjectMarks, getCacheSubject, getSubjectFromCache };