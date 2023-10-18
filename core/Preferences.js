import AsyncStorage from "@react-native-async-storage/async-storage";


export class Preferences {
  static haveBeenChanged = false;

  // Guess coefficient preferences
  static allowGuessMarkCoefficients = false;
  static setAllowGuessMarkCoefficients(value) {
    this.allowGuessMarkCoefficients = value;
    this.haveBeenChanged = true;
  }
  static allowGuessSubjectCoefficients = false;
  static setAllowGuessSubjectCoefficients(value) {
    this.allowGuessSubjectCoefficients = value;
    this.haveBeenChanged = true;
  }

  // Custom coefficient preferences
  static allowCustomCoefficients = true;
  static setAllowCustomCoefficients(value) {
    this.allowCustomCoefficients = value;
    this.haveBeenChanged = true;
  }

  // Save
  static async save() {
    if (!this.haveBeenChanged) { return; }
    await AsyncStorage.setItem("coefficients-preferences", JSON.stringify(Array.from({
      allowGuessMarkCoefficients: this.allowGuessMarkCoefficients,
      allowGuessSubjectCoefficients: this.allowGuessSubjectCoefficients,
      allowCustomCoefficients: this.allowCustomCoefficients,
    })));
  }
  // Load
  static async load() {
    await AsyncStorage.getItem("coefficients-preferences").then(jsonValue => {
      if (jsonValue != null) {
        const preferences = JSON.parse(jsonValue);
        this.allowGuessMarkCoefficients = preferences.allowGuessMarkCoefficients;
        this.allowGuessSubjectCoefficients = preferences.allowGuessSubjectCoefficients;
        this.allowCustomCoefficients = preferences.allowCustomCoefficients;
        this.haveBeenChanged = true;
      }
    });
  }

  // Erase
  static async erase() {
    this.allowGuessMarkCoefficients = false;
    this.allowGuessSubjectCoefficients = false;
    this.allowCustomCoefficients = true;
    await AsyncStorage.removeItem("coefficients-preferences");
  }
}
