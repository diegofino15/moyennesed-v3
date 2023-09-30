import AsyncStorage from "@react-native-async-storage/async-storage";


export class Preferences {
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

  static async load() {
    AsyncStorage.getItem("preferences").then(jsonValue => {
      if (jsonValue != null) {
        const preferences = JSON.parse(jsonValue);
        Preferences.guessMarksCoefficients = preferences.guessMarksCoefficients;
        Preferences.guessSubjectCoefficients = preferences.guessSubjectCoefficients;
        Preferences.haveBeenChanged = true;
      }
      console.log(`Preferences loaded : Marks : ${Preferences.guessMarksCoefficients} | Subjects : ${Preferences.guessSubjectCoefficients}`);
    });
  }

  static async save() {
    const guessMarksCoefficients = Preferences.guessMarksCoefficients;
    const guessSubjectCoefficients = Preferences.guessSubjectCoefficients;
    AsyncStorage.setItem("preferences", JSON.stringify({
      guessMarksCoefficients,
      guessSubjectCoefficients,
    }));
  }
}
