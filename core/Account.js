import { getFormattedPeriod, addMark, sortAllMarks, calculateAllAverages, getCachePeriod } from "./Period";
import { getFormattedMark } from "./Mark";
import { Preferences } from "./Preferences";

export class Account {
  id = 0;
  firstName = "";
  lastName = "";
  isParent = false;
  gender = "M";
  photoURL = "";
  periods = new Map();
  
  init(jsonData, isChild) {
    this.id = jsonData.id;

    const words = jsonData.prenom.toLowerCase().split(" ");
    for (let i = 0; i < words.length; i++) { words[i] = words[i][0].toUpperCase() + words[i].substr(1); }
    this.firstName = words.join(" ");

    this.lastName = jsonData.nom.toUpperCase();
    if (isChild) { this.isParent = false; }
    else { this.isParent = jsonData.typeCompte !== "E"; }

    if (this.isParent) { this.gender = jsonData.civilite === "M." ? "M" : "F"; }
    else {
      this.gender = isChild ? jsonData.sexe : jsonData.profile.sexe;
      this.photoURL = isChild ? jsonData.photo : jsonData.profile.photo;
      this.periods = new Map();
    }
  }

  fromCache(cacheData) {
    this.id = cacheData.id;
    this.firstName = cacheData.firstName;
    this.lastName = cacheData.lastName;
    this.isParent = cacheData.isParent;
    this.gender = cacheData.gender;
    if (!this.isParent) {
      this.photoURL = cacheData.photoURL;
      cacheData.periods.forEach(periodData => {
        var formattedPeriodData = periodData;
        formattedPeriodData.marks = new Array(periodData.marks);
        formattedPeriodData.subjects = new Map();
        periodData.subjects.forEach(subjectData => {
          var formattedSubjectData = subjectData;
          formattedSubjectData.marks = new Map(subjectData.marks);
          formattedSubjectData.subSubjects = new Map();
          subjectData.subSubjects.forEach(subSubjectData => {
            var formattedSubSubjectData = subSubjectData;
            formattedSubSubjectData.marks = new Map(subSubjectData.marks);
            formattedSubjectData.subSubjects.set(subSubjectData.subCode, formattedSubSubjectData);
          });
          formattedPeriodData.subjects.set(subjectData.code, formattedSubjectData);
        });

        this.periods.set(periodData.code, formattedPeriodData);
      });
    }
  }
  toCache() {
    var periods;
    if (!this.isParent) {
      periods = new Array();
      for (let [_, period] of this.periods) { periods.push(getCachePeriod(period)); }
    }

    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      isParent: this.isParent,
      gender: this.gender,
      photoURL: this.isParent ? "" : this.photoURL,
      periods: this.isParent ? {} : periods,
    };
  }

  // Getters
  fullName() { return `${this.firstName} ${this.lastName}`; }
  getSuffix() { return this.gender == "M" ? "" : "e"; }

  // Only for students accounts
  gotMarks() { return this.periods.size > 0; }
  formatReceivedMarks(jsonData) {
    // Set preferences
    if (!Preferences.haveBeenChanged) {
      Preferences.setGuessMarksCoefficients(!(jsonData.parametrage.coefficientNote ?? false));
      Preferences.setGuessSubjectCoefficients(!(jsonData.parametrage.moyenneCoefMatiere ?? false));
      Preferences.save();
      console.log(`Preferences have been changed : Marks : ${Preferences.guessMarksCoefficients} | Subjects : ${Preferences.guessSubjectCoefficients}`);
    }
    
    // Save periods
    const possiblePeriodCodes = new Array("A001", "A002", "A003");
    jsonData.periodes.forEach(periodData => {
      if (possiblePeriodCodes.includes(periodData.codePeriode)) {
        const period = getFormattedPeriod(periodData)
        this.periods.set(period.code, period);
      }
    });

    // Add marks
    jsonData.notes.forEach(markData => {
      const mark = getFormattedMark(markData);
      const period = this.periods.get(mark.periodCode);
      addMark(period, mark);
    });

    // Calculate averages
    for (let [_, period] of this.periods) {
      sortAllMarks(period);
      calculateAllAverages(period);
    }
  }

  // Erase all data when logging-out
  erase() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    if (!this.isParent && this.periods) { this.periods.clear(); }
    this.isParent = false;
    this.gender = "M";
    this.photoURL = "";
  }
}