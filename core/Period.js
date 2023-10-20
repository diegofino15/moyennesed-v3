import { getFormattedSubject, addSubSubject, sortMarks, _sortMarks, calculateAverages, getCacheSubject, getSubjectFromCache, addMarkToSubject } from "./Subject";
import { registerSubject } from "../utils/Colors";
import { addSubject, getFormattedSubjectGroup } from "./SubjectGroup";

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
      const subjectCode = subject.code.length === 0 ? "---" : subject.code;
      if (!subject.isSubSubject) {
        subjects.set(subjectCode, subject);
        if (subject.subjectGroupID) {
          addSubject(subjectGroups.get(subject.subjectGroupID), subject.code);
        }
      }
      else { addSubSubject(subjects.get(subjectCode), subject); }
      registerSubject(subject.code);
    }
  })
  
  return {
    "code": jsonData.codePeriode,
    "title": jsonData.periode,
    "isFinished": jsonData.cloture,
    "marks": new Array(),
    "subjects": subjects,
    "subjectGroups": subjectGroups,
    "average": undefined,
    "classAverage": undefined,
  };
}

function addMark(period, mark) {
  period.marks.push(mark);
  addMarkToSubject(period.subjects.get(mark.subjectCode), mark);
}

function sortAllMarks(period) {
  _sortMarks(period.marks);
  period.subjects.forEach(subject => {
    sortMarks(subject);
  });
}

function calculateAllAverages(period) {
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

  period.subjects.forEach((subject, key) => {
    calculateAverages(subject);
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
  
  period.subjects.forEach((subject, key) => {
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
    "marks": period.marks,
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
    "marks": cachePeriod.marks,
    "subjects": subjects,
    "subjectGroups": subjectGroups,
    "average": cachePeriod.average,
    "classAverage": cachePeriod.classAverage,
  };
}


export { getFormattedPeriod, addMark, sortAllMarks, calculateAllAverages, getCachePeriod, getPeriodFromCache };