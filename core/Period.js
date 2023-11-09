import { getFormattedSubject, addSubSubjectToSubject, calculateSubjectAverages, getCacheSubject, getSubjectFromCache, addMarkToSubject } from "./Subject";
import { addSubjectToSubjectGroup, getFormattedSubjectGroup } from "./SubjectGroup";
import { registerSubject } from "../utils/Colors";
import { Logger } from "../utils/Logger";


function getFormattedPeriod(jsonData) {
  var subjects = new Map();
  var subjectGroups = new Map();
  
  jsonData.ensembleMatieres.disciplines.map(subjectData => {
    if (subjectData.groupeMatiere ?? false) {
      var subjectGroup = getFormattedSubjectGroup(subjectData);
      if (!subjectGroups.has(subjectGroup.id)) {
        subjectGroups.set(subjectGroup.id, subjectGroup);
      }
    } else {
      var subject = getFormattedSubject(subjectData);
      if (!subject.isSubSubject) {
        subjects.set(subject.code, subject);
        if (subject.subjectGroupID) {
          addSubjectToSubjectGroup(subjectGroups.get(subject.subjectGroupID), subject.code);
        }
      }
      else {
        var mainSubject = subjects.get(subject.code);
        if (mainSubject == undefined) {
          mainSubject = getSubjectFromCache(getCacheSubject(subject));
          mainSubject.name = subject.code;
          mainSubject.isSubSubject = false;
          mainSubject.subCode = "";
          subjects.set(subject.code, mainSubject);
        }
        addSubSubjectToSubject(mainSubject, subject);
      }
      registerSubject(subject.code);
    }
  })
  
  return {
    "code": jsonData.codePeriode,
    "title": jsonData.periode,
    "isFinished": jsonData.cloture,
    "marks": new Map(),
    "subjects": subjects,
    "subjectGroups": subjectGroups,
    "average": undefined,
    "classAverage": undefined,
  };
}

function addMarkToPeriod(period, mark) {
  period.marks.set(mark.id, mark);
  var subject = period.subjects.get(mark.subjectCode);
  if (subject == undefined) {
    Logger.core("Detected mark without subject, creating it...", true);
    subject = getFormattedSubject({
      id: parseInt(Math.random().toString(36).substring(2, 9)),
      coef: 0,
      codeMatiere: mark.subjectCode,
      discipline: mark.subjectCode,
      professeurs: [],
      sousMatiere: false,
    });
    period.subjects.set(mark.subjectCode, subject);
  }
  addMarkToSubject(subject, mark);
}

function calculateAllPeriodAverages(period) {
  period.average = _getCalculatedGeneralAverage(period);
  period.classAverage = _getCalculatedGeneralClassAverage(period);

  period.subjectGroups.forEach(subjectGroup => {
    let sum = 0;
    let coefficient = 0;
    subjectGroup.subjectCodes.forEach(subjectCode => {
      const subject = period.subjects.get(subjectCode);
      if (subject.average) {
        sum += subject.average * subject.coefficient;
        coefficient += subject.coefficient;
      }
    });
    if (coefficient != 0) {
      subjectGroup.average = sum / coefficient;
    }
  });
}

function _getCalculatedGeneralAverage(period) {
  let sum = 0;
  let coefficient = 0;

  period.subjects.forEach((subject) => {
    calculateSubjectAverages(subject, (markID) => {
      return period.marks.get(markID);
    });
    if (subject.average) {
      sum += subject.average * subject.coefficient;
      coefficient += subject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function _getCalculatedGeneralClassAverage(period) {
  let sum = 0;
  let coefficient = 0;
  
  period.subjects.forEach((subject) => {
    if (subject.classAverage) {
      sum += subject.classAverage * subject.coefficient;
      coefficient += subject.coefficient;
    }
  });

  if (coefficient === 0) { return undefined; }
  return sum / coefficient;
}

function getCachePeriod(period) {
  var savableSubjects = new Map();
  period.subjects.forEach((subject, key) => {
    savableSubjects.set(key, getCacheSubject(subject));
  });
  
  return {
    "code": period.code,
    "title": period.title,
    "isFinished": period.isFinished,
    "marks": Array.from(period.marks.entries()),
    "subjects": Array.from(savableSubjects.entries()),
    "subjectGroups": Array.from(period.subjectGroups.entries()),
    "average": period.average,
    "classAverage": period.classAverage,
  };
}

function getPeriodFromCache(cachePeriod) {
  var subjects = new Map();
  new Map(cachePeriod.subjects).forEach((cacheSubject, key) => {
    subjects.set(key, getSubjectFromCache(cacheSubject));
  });

  var subjectGroups = new Map();
  new Map(cachePeriod.subjectGroups).forEach((cacheSubjectGroup, key) => {
    subjectGroups.set(key, cacheSubjectGroup);
  });
  
  return {
    "code": cachePeriod.code,
    "title": cachePeriod.title,
    "isFinished": cachePeriod.isFinished,
    "marks": new Map(cachePeriod.marks),
    "subjects": subjects,
    "subjectGroups": subjectGroups,
    "average": cachePeriod.average,
    "classAverage": cachePeriod.classAverage,
  };
}

export { getFormattedPeriod, addMarkToPeriod, calculateAllPeriodAverages, getCachePeriod, getPeriodFromCache };