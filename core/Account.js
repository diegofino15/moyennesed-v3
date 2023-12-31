import { getFormattedPeriod, addMarkToPeriod, calculateAllPeriodAverages, getCachePeriod, getPeriodFromCache, _getCalculatedGeneralAverage, sortAllPeriodMarks } from "./Period";
import { getFormattedMark } from "./Mark";
import { Preferences } from "./Preferences";
import { CoefficientManager } from "./CoefficientsManager";
import { _sortMarks, capitalizeWords } from "../utils/Utils";
import { Logger } from '../utils/Logger';


export class Account {
  id = 0;
  firstName = "";
  lastName = "";
  isParent = false;
  classLabel = "";
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
      this.classLabel = isChild ? jsonData.classe.libelle : jsonData.profile.classe.libelle;
      this.gender = isChild ? jsonData.sexe : jsonData.profile.sexe;
      this.photoURL = isChild ? jsonData.photo : jsonData.profile.photo;
      this.periods = new Map();
    }
  }

  fromCache(cacheData) {
    this.id = cacheData.id;
    this.firstName = cacheData.firstName;
    this.lastName = cacheData.lastName;
    this.classLabel = cacheData.classLabel;
    this.gender = cacheData.gender;
    this.isParent = cacheData.isParent;
    this.photoURL = cacheData.photoURL;

    if (!this.isParent) {
      let cachePeriods = new Map(cacheData.periods);
      cachePeriods.forEach((cachePeriodData, key) => {
        this.periods.set(key, getPeriodFromCache(cachePeriodData));
      });
    }
  }
  toCache() {
    var savablePeriods = new Map();
    this.periods.forEach((period) => {
      savablePeriods.set(period.code, getCachePeriod(period));
    });
    
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      isParent: this.isParent,
      classLabel: this.classLabel,
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
      Preferences.setAllowGuessMarkCoefficients(!(jsonData.parametrage.coefficientNote ?? false));
      Preferences.setAllowGuessSubjectCoefficients(!((jsonData.parametrage.moyenneCoefMatiere ?? false) || (jsonData.parametrage.colonneCoefficientMatiere ?? false)));
      Preferences.save();
      Logger.core(`Preferences have been changed : Marks : ${Preferences.allowGuessMarkCoefficients} | Subjects : ${Preferences.allowGuessSubjectCoefficients}`);
    }
    
    // Save periods
    const possiblePeriodCodes = new Array("A001", "A002", "A003");
    (jsonData.periodes ?? []).forEach(periodData => {
      if (possiblePeriodCodes.includes(periodData.codePeriode)) {
        let period = getFormattedPeriod(periodData)
        this.periods.set(period.code, period);
      }
    });

    // Add marks
    var sortedMarks = new Array();
    (jsonData.notes ?? []).forEach(markData => {
      let mark = getFormattedMark(markData);
      if (mark.valueStr) {
        sortedMarks.push(mark);
      } else {
        Logger.core(`Mark : ${mark.title} (${mark.valueStr}) is invalid`, true);
      }
    });
    _sortMarks(sortedMarks);
    sortedMarks.forEach(mark => {
      let period = this.periods.get(mark.periodCode);
      if (period) {
        addMarkToPeriod(period, mark);
        _getCalculatedGeneralAverage(period, false, false);
      } else {
        Logger.core(`Mark : ${mark.title} (${mark.valueStr}) has invalid period code : ${mark.periodCode}`, true);
      }
    });
    CoefficientManager.isAverageHistoryUpdated = true;

    // Calculate averages
    for (let [_, period] of this.periods) {
      sortAllPeriodMarks(period);
      calculateAllPeriodAverages(period);
    }

    CoefficientManager.save();
    saveCalculatedMarks(this.periods);
  }

  // Erase all data when logging-out
  erase() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    if (!this.isParent && this.periods) { this.periods.clear(); }
    this.isParent = false;
    this.classLabel = "";
    this.gender = "M";
    this.photoURL = "";
  }
}