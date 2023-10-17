import { getFormattedPeriod, addMark, sortAllMarks, calculateAllAverages, getCachePeriod, getPeriodFromCache } from "./Period";
import { getFormattedMark } from "./Mark";
import { Preferences } from "./Preferences";
import { capitalizeWords } from "../utils/Utils";

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

    this.firstName = capitalizeWords(jsonData.prenom);

    this.lastName = jsonData.nom.toUpperCase();
    if (isChild) { this.isParent = false; }
    else { this.isParent = jsonData.typeCompte !== "E"; }

    if (this.isParent) { this.gender = jsonData.civilite === "Mme." ? "F" : "M"; }
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
    this.gender = cacheData.gender;
    this.isParent = cacheData.isParent;
    this.photoURL = cacheData.photoURL;

    if (!this.isParent) {
      const cachePeriods = new Map(cacheData.periods);
      cachePeriods.forEach((cachePeriodData, key) => {
        this.periods.set(key, getPeriodFromCache(cachePeriodData));
      });
    }
  }
  toCache() {
    var savablePeriods = new Map();
    this.periods.forEach((period, key) => {
      savablePeriods.set(period.code, getCachePeriod(period));
    });
    
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      isParent: this.isParent,
      gender: this.gender,
      photoURL: this.photoURL,
      periods: this.isParent ? {} : Array.from(savablePeriods.entries()),
    };
  }

  // Getters
  fullName() { return `${this.firstName} ${this.lastName}`; }
  getSuffix() { return this.gender == "M" ? "" : "e"; }

  // Only for students accounts
  gotMarks() { return this.periods.size > 0; }
  formatReceivedMarks(jsonData, saveCalculatedMarks) {
    // Set preferences
    if (!Preferences.haveBeenChanged) {
      Preferences.setGuessMarksCoefficients(!(jsonData.parametrage.coefficientNote ?? false));
      Preferences.setGuessSubjectCoefficients(!(jsonData.parametrage.moyenneCoefMatiere ?? false));
      Preferences.saveGuessCoefficients();
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
      if (mark.valueStr) {
        const period = this.periods.get(mark.periodCode);
        addMark(period, mark);
      }
    });

    // Calculate averages
    for (let [_, period] of this.periods) {
      sortAllMarks(period);
      calculateAllAverages(period);
    }

    saveCalculatedMarks(this.periods);
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