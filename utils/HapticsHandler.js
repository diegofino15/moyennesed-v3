import * as Haptics from "expo-haptics";

import { Preferences } from "../core/Preferences";


export class HapticsHandler {
  static vibrate(impactWeight) {
    if (Preferences.vibrate) {
      Haptics.impactAsync(impactWeight);
    }
  }
}