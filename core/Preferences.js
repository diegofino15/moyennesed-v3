import AsyncStorage from "@react-native-async-storage/async-storage";


export class Preferences {
  // Guess coefficients
  static haveBeenChanged = false;
  static guessMarksCoefficients = false;
  static setGuessMarksCoefficients(value) {
    Preferences.guessMarksCoefficients = value;
    Preferences.haveBeenChanged = true;
  }
  static guessSubjectCoefficients = false;
  static setGuessSubjectCoefficients(value) {
    Preferences.guessSubjectCoefficients = value;
    Preferences.haveBeenChanged = true;
  }
  static async loadGuessCoefficients() {
    AsyncStorage.getItem("guess-preferences").then(jsonValue => {
      if (jsonValue != null) {
        const guessPreferences = JSON.parse(jsonValue);
        Preferences.guessMarksCoefficients = guessPreferences.guessMarksCoefficients;
        Preferences.guessSubjectCoefficients = guessPreferences.guessSubjectCoefficients;
        Preferences.haveBeenChanged = true;
      }
    });
  }
  static async saveGuessCoefficients() {
    AsyncStorage.setItem("guess-preferences", JSON.stringify({
      guessMarksCoefficients: Preferences.guessMarksCoefficients,
      guessSubjectCoefficients: Preferences.guessSubjectCoefficients,
    }));
  }

  // Custom coefficients
  static customCoefficients = new Map();
  static async loadCustomCoefficients() {
    await AsyncStorage.getItem("custom-coefficients").then(jsonValue => {
      if (jsonValue != null) {
        this.customCoefficients = new Map(JSON.parse(jsonValue));
      }
    });
  }
  static async saveCustomCoefficients() {
    await AsyncStorage.setItem("custom-coefficients", JSON.stringify(Array.from(this.customCoefficients.entries())));
  }

  // Default ED coefficients
  static defaultEDCoefficients = new Map();
  static async loadDefaultEDCoefficients() {
    await AsyncStorage.getItem("default-ed-coefficients").then(jsonValue => {
      if (jsonValue != null) {
        this.defaultEDCoefficients = new Map(JSON.parse(jsonValue));
      }
    });
  }
  static async saveDefaultEDCoefficients() {
    await AsyncStorage.setItem("default-ed-coefficients", JSON.stringify(Array.from(this.defaultEDCoefficients.entries())));
  }

  // Main functions
  static async load() {
    await this.loadGuessCoefficients();
    await this.loadCustomCoefficients();
    await this.loadDefaultEDCoefficients();
    console.log(`Preferences loaded : Marks : ${Preferences.guessMarksCoefficients} | Subjects : ${Preferences.guessSubjectCoefficients}`);
  }
  static async save() {
    await this.saveGuessCoefficients();
    await this.saveCustomCoefficients();
    await this.saveDefaultEDCoefficients();
  }
  static async erase() {
    Preferences.haveBeenChanged = false;
    Preferences.guessMarksCoefficients = false;
    Preferences.guessSubjectCoefficients = false;
    Preferences.customCoefficients = new Map();
    Preferences.defaultEDCoefficients = new Map();
    await AsyncStorage.removeItem("guess-preferences");
    await AsyncStorage.removeItem("custom-coefficients");
    await AsyncStorage.removeItem("default-ed-coefficients");
  }
}
