import AsyncStorage from "@react-native-async-storage/async-storage";
import { Logger } from "../utils/Logger";

const DEBUG = true;
export { DEBUG };

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

  // Dark mode
  static isDarkMode = false;

  // Allow vibrations
  static vibrate = true;

  // Was Android advertisement shown
  static androidAdvertisementShown = false;

  // Save
  static async save() {
    await AsyncStorage.setItem("coefficients-preferences", JSON.stringify({
      allowGuessMarkCoefficients: this.allowGuessMarkCoefficients,
      allowGuessSubjectCoefficients: this.allowGuessSubjectCoefficients,
      allowCustomCoefficients: this.allowCustomCoefficients,
      isDarkMode: this.isDarkMode,
      vibrate: this.vibrate,
      androidAdvertisementShown: this.androidAdvertisementShown,
    }));
  }
  // Load
  static async load() {
    await AsyncStorage.getItem("coefficients-preferences").then(jsonValue => {
      if (jsonValue != null) {
        let preferences = JSON.parse(jsonValue);
        this.allowGuessMarkCoefficients = preferences.allowGuessMarkCoefficients;
        this.allowGuessSubjectCoefficients = preferences.allowGuessSubjectCoefficients;
        this.allowCustomCoefficients = preferences.allowCustomCoefficients;
        this.isDarkMode = preferences.isDarkMode ?? false;
        this.vibrate = preferences.vibrate ?? true;
        this.androidAdvertisementShown = preferences.androidAdvertisementShown ?? false;
        this.haveBeenChanged = true;
        Logger.load("Preferences loaded !");
        Logger.load(`-> AllowGuessMarkCoefficients : ${this.allowGuessMarkCoefficients}`);
        Logger.load(`-> AllowGuessSubjectCoefficients : ${this.allowGuessSubjectCoefficients}`);
        Logger.load(`-> AllowCustomCoefficients : ${this.allowCustomCoefficients}`);
        Logger.load(`-> DarkMode : ${this.isDarkMode}`);
        Logger.load(`-> Vibrate : ${this.vibrate}`);
        Logger.load(`-> AndroidAdvertisementShown : ${this.androidAdvertisementShown}`);
      }
    });
  }

  // Erase
  static async erase() {
    this.haveBeenChanged = false;
    this.allowGuessMarkCoefficients = false;
    this.allowGuessSubjectCoefficients = false;
    this.allowCustomCoefficients = true;
    this.isDarkMode = false;
    this.androidAdvertisementShown = false;
    this.vibrate = true;
    await AsyncStorage.removeItem("coefficients-preferences");
  }
}