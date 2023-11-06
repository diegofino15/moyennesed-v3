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

function addMarkToSubject(subject, mark) {
  if (mark.subSubjectCode && !subject.isSubSubject) {
    var subSubject = subject.subSubjects.get(mark.subSubjectCode);
    if (subSubject == undefined) {
      console.warn("Detected mark without sub-subject, creating it...");
      subSubject = getFormattedSubject({
        id: parseInt(Math.random().toString(36).substring(2, 9)),
        coef: 0,
        codeMatiere: mark.subjectCode,
        codeSousMatiere: mark.subSubjectCode,
        discipline: mark.subSubjectCode,
        professeurs: [],
        sousMatiere: true,
      });
      subject.subSubjects.set(mark.subSubjectCode, subSubject);
    }
    addMarkToSubject(subSubject, mark);
  }
  subject.marks.push(mark.id);
}

function calculateSubjectAverages(subject, getMark) {
  for (let [_, subSubject] of subject.subSubjects) {
    calculateSubjectAverages(subSubject, getMark);
  }

  subject.average = _getCalculatedSubjectAverage(subject, getMark);
  subject.classAverage = _getCalculatedSubjectClassAverage(subject, getMark);
}

function _getCalculatedSubjectAverage(subject, getMark) {
  let sum = 0;
  let coefficient = 0;

  if (subject.subSubjects.size == 0) {
    subject.marks.forEach(markID => {
      const mark = getMark(markID);
      if (mark.isEffective) {
        sum += (mark.value / mark.valueOn * 20) * mark.coefficient;
        coefficient += mark.coefficient;
      }
    });
  }

  subject.subSubjects.forEach((subSubject, _) => {
    if (subSubject.marks.length != 0) {
      sum += _getCalculatedSubjectAverage(subSubject, getMark) * subSubject.coefficient;
      coefficient += subSubject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function _getCalculatedSubjectClassAverage(subject, getMark) {
  let sum = 0;
  let coefficient = 0;

  if (subject.subSubjects.size == 0) {
    subject.marks.forEach(markID => {
      const mark = getMark(markID);
      if (mark.isEffective && mark.classValue) {
        sum += (mark.classValue / mark.valueOn * 20) * mark.coefficient;
        coefficient += mark.coefficient;
      }
    });
  }

  subject.subSubjects.forEach((subSubject, _) => {
    let subSubjectAverage = _getCalculatedSubjectClassAverage(subSubject, getMark);
    if (subSubjectAverage) {
      sum += subSubjectAverage * subSubject.coefficient;
      coefficient += subSubject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
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
    console.warn("Invalid cache was loaded, skipping sub subjects...");
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

export { getFormattedSubject, addSubSubjectToSubject, addMarkToSubject, calculateSubjectAverages, getCacheSubject, getSubjectFromCache };