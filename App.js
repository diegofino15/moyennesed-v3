import { useEffect, useCallback } from "react";
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
import { AdsHandler } from "./utils/AdsHandler";
import { AppContextProvider } from "./utils/AppContext";
import { Logger } from "./utils/Logger";


// Keep SplashScreen on while app is loading
SplashScreen.preventAutoHideAsync();

// Main App
function App() {
  // AppOpen Ad
  const [wasAppOpenAdShowed, setWasAppOpenAdShowed] = useState(false);
  useEffect(() => { AdsHandler.initialize(setWasAppOpenAdShowed); }, []);
  useEffect(() => { if (isAppLoaded && wasAppOpenAdShowed && !isSplashScreenHidded) {
    SplashScreen.hideAsync();
    setIsSplashScreenHidden(true);
  }}, [wasAppOpenAdShowed]);

  // App state needed to show either AppStack or AuthStack
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // Light/Dark mode
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => { setIsDarkMode(Preferences.isDarkMode); }, [Preferences.isDarkMode]);
  refreshTheme(theme, isDarkMode);

  // Hide SplashScreen once app is loaded
  const [isSplashScreenHidded, setIsSplashScreenHidden] = useState(false);
  const onLayoutRootView = useCallback(async () => {
    if (isAppLoaded && (wasAppOpenAdShowed || !loggedIn)) {
      await SplashScreen.hideAsync();
      setIsSplashScreenHidden(true);
    }
  }, [isAppLoaded]);

  // Main initialize function
  useEffect(() => { initialize(); });
  async function initialize() {
    if (isAppLoaded || loggedIn || wasAppOpenAdShowed) { return; }

    try {
      // Load fonts
      await useFonts();

      // Load credentials file to detect already logged-in account
      const jsonCredentials = await AsyncStorage.getItem("credentials");
      if (jsonCredentials) {
        Logger.load("Detected logged-in account, loading cache...");

        // Show AppOpen ad
        if (Math.random() <= 0.33) { AdsHandler.showAppOpenAd(setWasAppOpenAdShowed); }
        else { setWasAppOpenAdShowed(true); }

        // Load all local files
        await Preferences.load();
        await CoefficientManager.load();
        await UserData.loadCache();

        setLoggedIn(true);
      } else {
        Logger.load("No account detected, showing AuthStack");
      }
    } catch (e) {
      Logger.load("An error occured on startup", true);
      Logger.load(e, true);
    } finally {
      setIsAppLoaded(true);
    }
  }

  // Don't load UI until app is loaded
  if (!isAppLoaded) { return null; }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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