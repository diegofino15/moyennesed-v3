import AsyncStorage from "@react-native-async-storage/async-storage";


export class CoefficientManager {
  // Mark filters
  static markCoefficientFilter = new Map(Object.entries({
    "dm": 0.5,
    "ie": 1.0,
    "ds": 2.0, "dst": 2.0,
    "oraux": 3.0,
    "brevet": 3.0,
    "bac": 5.0,
  }));
  // Subject filters
  static subjectCoefficientFilter = new Map(Object.entries({
    "FRANCAIS": 3.0, "FRANÇAIS": 3.0, "FRANC": 3.0,
    "HISTOIRE": 3.0, "HIS": 3.0, "GEOGRAPHIE": 3.0, "GEO": 3.0, "GÉOGRAPHIE": 3.0, "GÉO": 3.0,
    "ANGLAIS": 3.0, "ANG": 3.0, "LV1": 3.0, "LVA": 3.0, "LV+": 3.0,
    "ESPAGNOL": 2.0, "ESP": 2.0, "LV2": 2.0, "LVB": 2.0,
    "ALLEMAND": 2.0, "ALL": 2.0,
    "SES": 2.0, "ECO": 2.0, "ÉCO": 2.0, "ÉCONOMIQUE": 2.0, "ECONOMIQUE": 2.0, "ÉCONOMIQUES": 2.0, "ECONOMIQUES": 2.0, "SOCIALE": 2.0, "SOCIALES": 2.0,
    "MATHEMATIQUES": 3.0, "MATHÉMATIQUES": 3.0, "MATHS": 3.0,
    "PHYSIQUE": 2.0, "CHIMIE": 2.0,
    "SVT": 2.0, "VIE": 2.0, "TERRE": 2.0, "SCIENCES": 2.0,
    "EPS": 2.0, "SPORT": 2.0, "SPORTIVE": 2.0,
  }));

  // Guessed mark coefficients
  static guessedMarkCoefficients = new Map();
  static getGuessedMarkCoefficient(markID, markTitle) {
    var coefficient = this.guessedMarkCoefficients.get(markID);
    if (coefficient == undefined) {
      coefficient = this.guessMarkCoefficient(markTitle);
      this.guessedMarkCoefficients.set(markID, coefficient);
    }
    return coefficient;
  }
  static guessMarkCoefficient(markTitle) {
    var coefficient = 1;
    const lowerCaseTitle = (markTitle ?? "").toLowerCase();
    this.markCoefficientFilter.forEach((value, key) => {
      if (lowerCaseTitle.includes(key)) {
        coefficient = value;
      }
    });
    return coefficient;
  }
  // Guessed subject coefficients
  static guessedSubjectCoefficients = new Map();
  static getGuessedSubjectCoefficient(subjectID, subjectCode, subjectSubCode, subjectName) {
    var coefficient = this.guessedSubjectCoefficients.get(`${subjectID}-${subjectCode}-${subjectSubCode}`);
    if (coefficient == undefined) {
      coefficient = this.guessSubjectCoefficient(subjectName);
      this.guessedSubjectCoefficients.set(`${subjectID}-${subjectCode}-${subjectSubCode}`, coefficient);
    }
    return coefficient;
  }
  static guessSubjectCoefficient(subjectName) {
    var coefficient = 1;
    const upperCaseTitle = (subjectName ?? "").toUpperCase();
    this.subjectCoefficientFilter.forEach((value, key) => {
      if (upperCaseTitle.includes(key)) {
        coefficient = value;
      }
    });
    return coefficient;
  }

  // Default mark coefficients
  static defaultEDMarkCoefficients = new Map();
  static setDefaultEDMarkCoefficient(markID, coefficient) {
    if (!coefficient) { coefficient = 1; }
    this.defaultEDMarkCoefficients.set(markID, coefficient);
    return coefficient;
  }
  static getDefaultEDMarkCoefficient(markID) {
    return this.defaultEDMarkCoefficients.get(markID);
  }
  // Default subject coefficients
  static defaultEDSubjectCoefficients = new Map();
  static setDefaultEDSubjectCoefficient(subjectID, coefficient) {
    if (!coefficient) { coefficient = 1; }
    this.defaultEDSubjectCoefficients.set(subjectID, coefficient);
    return coefficient;
  }
  static getDefaultEDSubjectCoefficient(subjectID) {
    return this.defaultEDSubjectCoefficients.get(subjectID);
  }

  // Custom mark coefficients
  static customMarkCoefficients = new Map();
  static setCustomMarkCoefficient(markID, coefficient) {
    coefficient = Math.min(Math.max(coefficient, 0), 50);
    this.customMarkCoefficients.set(markID, coefficient);
    console.log(this.customMarkCoefficients);
  }
  static getCustomMarkCoefficient(markID) {
    return this.customMarkCoefficients.get(markID);
  }
  static deleteCustomMarkCoefficient(markID) {
    this.customMarkCoefficients.delete(markID);
  }
  // Custom subject coefficients
  static customSubjectCoefficients = new Map();
  static setCustomSubjectCoefficient(subjectID, coefficient) {
    coefficient = Math.min(Math.max(coefficient, 0), 50);
    this.customSubjectCoefficients.set(subjectID, coefficient);
  }
  static getCustomSubjectCoefficient(subjectID) {
    return this.customSubjectCoefficients.get(subjectID);
  }
  static deleteCustomSubjectCoefficient(subjectID) {
    this.customSubjectCoefficients.delete(subjectID);
  }

  // Erase
  static async erase() {
    this.guessedMarkCoefficients.clear();
    this.guessedSubjectCoefficients.clear();
    this.defaultEDMarkCoefficients.clear();
    this.defaultEDSubjectCoefficients.clear();
    this.customMarkCoefficients.clear();
    this.customSubjectCoefficients.clear();
    await AsyncStorage.removeItem("coefficients");
  }

  // Save
  static async save() {
    await AsyncStorage.setItem("coefficients", JSON.stringify({
      guessedMarkCoefficients: Array.from(this.guessedMarkCoefficients.entries()),
      guessedSubjectCoefficients: Array.from(this.guessedSubjectCoefficients.entries()),
      defaultEDMarkCoefficients: Array.from(this.defaultEDMarkCoefficients.entries()),
      defaultEDSubjectCoefficients: Array.from(this.defaultEDSubjectCoefficients.entries()),
      customMarkCoefficients: Array.from(this.customMarkCoefficients.entries()),
      customSubjectCoefficients: Array.from(this.customSubjectCoefficients.entries()),
    }));
  }
  // Load
  static async load() {
    AsyncStorage.getItem("coefficients").then((jsonData) => {
      if (jsonData != null) {
        jsonData = JSON.parse(jsonData);
        this.guessedMarkCoefficients = new Map(jsonData.guessedMarkCoefficients);
        this.guessedSubjectCoefficients = new Map(jsonData.guessedSubjectCoefficients);
        this.defaultEDMarkCoefficients = new Map(jsonData.defaultEDMarkCoefficients);
        this.defaultEDSubjectCoefficients = new Map(jsonData.defaultEDSubjectCoefficients);
        this.customMarkCoefficients = new Map(jsonData.customMarkCoefficients);
        this.customSubjectCoefficients = new Map(jsonData.customSubjectCoefficients);
      }
    })
  }
}