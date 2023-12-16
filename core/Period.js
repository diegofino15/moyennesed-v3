import { getFormattedSubject, addSubSubjectToSubject, calculateSubjectAverages, getCacheSubject, getSubjectFromCache, addMarkToSubject, _getCalculatedSubjectAverage, sortAllSubjectMarks } from "./Subject";
import { addSubjectToSubjectGroup, getFormattedSubjectGroup } from "./SubjectGroup";
import { registerSubjectColor } from "../utils/Colors";
import { Logger } from "../utils/Logger";
import { _sortMarks } from "../utils/Utils";


function getFormattedPeriod(jsonData) {
  var subjects = new Map();
  var subjectGroups = new Map();
  
  jsonData.ensembleMatieres.disciplines.map(subjectData => {
    if (subjectData.groupeMatiere ?? false) {
      let subjectGroup = getFormattedSubjectGroup(subjectData);
      if (!subjectGroups.has(subjectGroup.id)) {
        subjectGroups.set(subjectGroup.id, subjectGroup);
      }
    } else {
      let subject = getFormattedSubject(subjectData);
      if (!subject.isSubSubject) {
        subjects.set(subject.code, subject);
        if (subject.subjectGroupID) {
          addSubjectToSubjectGroup(subjectGroups.get(subject.subjectGroupID), subject.code);
        }
      }
      else {
        let mainSubject = subjects.get(subject.code);
        if (mainSubject == undefined) {
          mainSubject = getSubjectFromCache(getCacheSubject(subject));
          mainSubject.name = subject.code;
          mainSubject.isSubSubject = false;
          mainSubject.subCode = "";
          subjects.set(subject.code, mainSubject);
        }
        addSubSubjectToSubject(mainSubject, subject);
      }
      registerSubjectColor(subject.code);
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
    "averageHistory": new Array(),
    "classAverage": undefined,
  };
}

function addMarkToPeriod(period, mark, isCustom) {
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
  addMarkToSubject(subject, mark, isCustom);
}

function removeMarkFromPeriod(period, mark) {
  if (!mark) { return; }
  period.marks.delete(mark.id);
  var subject = period.subjects.get(mark.subjectCode);
  subject.marks.splice(subject.marks.indexOf(mark.id), 1);
  if (mark.subSubjectCode) {
    let subSubject = subject.subSubjects.get(mark.subSubjectCode);
    subSubject.marks.splice(subSubject.marks.indexOf(mark.id), 1);
  }
}

function calculateAllPeriodAverages(period) {
  period.average = _getCalculatedGeneralAverage(period, true, false);
  period.classAverage = _getCalculatedGeneralAverage(period, true, true);

  period.subjectGroups.forEach(subjectGroup => {
    let sum = 0;
    let sumClass = 0;
    let coefficient = 0;
    let coefficientClass = 0;
    subjectGroup.subjectCodes.forEach(subjectCode => {
      let subject = period.subjects.get(subjectCode);
      if (subject.average) {
        sum += subject.average * subject.coefficient;
        coefficient += subject.coefficient;
      }
      if (subject.classAverage) {
        sumClass += subject.classAverage * subject.coefficient;
        coefficientClass += subject.coefficient;
      }
    });
    if (coefficient != 0) {
      subjectGroup.average = sum / coefficient;
    }
    if (coefficientClass != 0) {
      subjectGroup.classAverage = sumClass / coefficientClass;
    }
  });
}

function _getCalculatedGeneralAverage(period, set=true, isClass=false) {
  var sum = 0;
  var coefficient = 0;

  period.subjects.forEach((subject) => {
    let subjectAverage;
    if (set) {
      calculateSubjectAverages(subject, (markID) => { return period.marks.get(markID); });
      subjectAverage = isClass ? subject.classAverage : subject.average;
    } else {
      subjectAverage = _getCalculatedSubjectAverage(subject, (markID) => period.marks.get(markID), isClass, false);
    }
    if (subjectAverage) {
      sum += subjectAverage * subject.coefficient;
      coefficient += subject.coefficient;
    }
  });

  if (coefficient == 0) { return undefined; }
  if (!isClass) { period.averageHistory.push(sum / coefficient); }
  return sum / coefficient;
}

function sortAllPeriodMarks(period) {
  period.subjects.forEach(subject => {
    sortAllSubjectMarks(subject);
  });
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
    "averageHistory": period.averageHistory,
    "classAverage": period.classAverage,
  };
}

function getPeriodFromCache(cachePeriod) {
  var subjects = new Map();
  new Map(cachePeriod.subjects).forEach((cacheSubject, key) => {
    subjects.set(key, getSubjectFromCache(cacheSubject));
  });

  return {
    "code": cachePeriod.code,
    "title": cachePeriod.title,
    "isFinished": cachePeriod.isFinished,
    "marks": new Map(cachePeriod.marks),
    "subjects": subjects,
    "subjectGroups": new Map(cachePeriod.subjectGroups),
    "average": cachePeriod.average,
    "averageHistory": cachePeriod.averageHistory,
    "classAverage": cachePeriod.classAverage,
  };
}

export { getFormattedPeriod, addMarkToPeriod, removeMarkFromPeriod, calculateAllPeriodAverages, _getCalculatedGeneralAverage, sortAllPeriodMarks, getCachePeriod, getPeriodFromCache };