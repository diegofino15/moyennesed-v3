import { useEffect } from "react";
import useState from "react-usestateref";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthStack } from "./ui/views/authstack/AuthStack";
import { AppStack } from "./ui/views/appstack/AppStack";
import { useFonts, refreshTheme } from "./ui/hooks/useStyles";
import { UserData } from "./core/UserData";
import { Preferences } from "./core/Preferences";
import { CoefficientManager } from "./core/CoefficientsManager";
import { AppContextProvider } from "./utils/AppContext";
import { Logger } from "./utils/Logger";
import AdsHandler from "./utils/AdsHandler";


// Keep SplashScreen on while app is loading
SplashScreen.preventAutoHideAsync();

// Main App
function App() {
  // App state needed to show either AppStack or AuthStack
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  useEffect(() => { if (isAppLoaded) { SplashScreen.hideAsync(); } }, [isAppLoaded]);

  // Light/Dark mode
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => { setIsDarkMode(Preferences.isDarkMode); }, [Preferences.isDarkMode]);
  refreshTheme(theme, isDarkMode);

  // Main initialize function
  useEffect(() => { initialize(); }, []);
  async function initialize() {
    try {
      // Load fonts
      await useFonts();

      // Load credentials file to detect already logged-in account
      const jsonCredentials = await AsyncStorage.getItem("credentials");
      if (jsonCredentials) {
        Logger.load("Detected logged-in account, loading cache...");

        // Load all local files
        await Preferences.load();
        await CoefficientManager.load();
        await UserData.loadCache();
        setLoggedIn(true);

        // Setup admob
        await AdsHandler.setupAdmob({ checkForConsent: true });

        setIsAppLoaded(true);
      } else {
        // Setup admob
        await AdsHandler.setupAdmob({ checkForConsent: false });

        Logger.load("No account detected, showing AuthStack");
        setIsAppLoaded(true);
      }
    } catch (e) {
      Logger.load("An error occured on startup", true);
      Logger.load(e, true);
      setIsAppLoaded(true);
    }
  }

  // Don't load UI until app is loaded
  if (!isAppLoaded) { return null; }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Top status bar */}
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <BottomSheetModalProvider>
        {/* Update UI when logging-in/out */}
        <AppContextProvider state={{ loggedIn, setLoggedIn }}>
          {/* AuthStack / AppStack */}
          {loggedIn
            ? <AppStack setIsDarkMode={setIsDarkMode} theme={theme}/>
            : <AuthStack theme={theme}/>}
        </AppContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default App;