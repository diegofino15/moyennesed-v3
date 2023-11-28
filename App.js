import { useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import useState from 'react-usestateref'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AdEventType, AppOpenAd } from 'react-native-google-mobile-ads';
import * as SplashScreen from "expo-splash-screen";

import { useFonts, setThemeData } from './ui/hooks/useStyles';
import { AuthStack } from './ui/views/authstack/AuthStack';
import { AppStack } from './ui/views/appstack/AppStack';
import { UserData } from './core/UserData';
import { Preferences } from './core/Preferences';
import { CoefficientManager } from './core/CoefficientsManager';
import { AppContextProvider } from './utils/AppContext';
import { Logger } from './utils/Logger';


// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// AppOpen Ad
const appOpenAdUnitID = "ca-app-pub-1869877675520642/7552640661";
const appOpenAd = AppOpenAd.createForAdRequest(appOpenAdUnitID, {
  requestNonPersonalizedAdsOnly: true,
});

function App() {
  // Was app showed
  const [_isAdLoaded, setIsAdLoaded, isAdLoadedRef] = useState(false);
  const [_wasAdShowed, setWasAdShowed, wasAdShowedRef] = useState(false);

  // Decide to show AppStack or AuthStack
  const [loggedIn, setLoggedIn, loggedInRef] = useState(false);
  const [_loggedInLoaded, setLoggedInLoaded, loggedInLoadedRef] = useState(false);

  // Initialize UI data
  const [_fontsLoaded, setFontsLoaded, fontsLoadedRef] = useState(false);
  const theme = useTheme();
  setThemeData(theme); // Here to get updated when changing light/dark mode
  const [_isDarkMode, setIsDarkMode] = useState(Preferences.isDarkMode);
  useEffect(() => {
    setIsDarkMode(Preferences.isDarkMode);
  }, [Preferences.isDarkMode]);

  // Prepare function
  useEffect(() => {
    // Load AppOpen Ad
    appOpenAd.load();
    appOpenAd.addAdEventsListener((event) => {
      if (event.type === AdEventType.LOADED) {
        setIsAdLoaded(true);
        if (loggedInLoadedRef.current && !wasAdShowedRef.current && loggedInRef.current) {
          setWasAdShowed(true);
          appOpenAd.show();
        }
      } else if (event.type == AdEventType.CLOSED) {
        SplashScreen.hideAsync();
      } else if (event.type == AdEventType.ERROR) {
        Logger.info("AppOpen Ad couldn't open...", true);
      }
    });

    async function prepare() {
      try {
        if (!fontsLoadedRef.current) {
          await useFonts();
          setFontsLoaded(true);
        }
        
        if (!loggedInLoadedRef.current) {
          const jsonCredentials = await AsyncStorage.getItem('credentials');
          if (jsonCredentials !== null) {
            Logger.info("Detected already logged-in account (loading cache...)");
            await Preferences.load();
            await CoefficientManager.load();
            await UserData.loadCache();
            setLoggedIn(true);
          } else {
            Logger.info("No account detected, showing auth stack");
          }
        }
      } catch (e) {
        Logger.info(`An error occured on startup, ${e}`, true);
      } finally {
        setLoggedInLoaded(true);
      }
    }
    prepare();
  }, []);

  // Hide splash screen
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoadedRef.current && loggedInLoadedRef.current) {
      if (!wasAdShowedRef.current) {
        if (isAdLoadedRef.current && loggedInRef.current) {
          setWasAdShowed(true);
          appOpenAd.show();
        } else {
          await SplashScreen.hideAsync();
        }
      }
    }
  }, [fontsLoadedRef.current, loggedInLoadedRef.current]);

  // Return null if UI is not loaded
  if (!fontsLoadedRef.current || !loggedInLoadedRef.current) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/* Top status bar */}
      <StatusBar
        translucent={true}
        barStyle={Preferences.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor='transparent'
      />
      <BottomSheetModalProvider>
        {/* Provider needed to update UI when logging-in/out */}
        <AppContextProvider state={{ loggedIn, setLoggedIn }}>
          {/* AuthStack / AppStack */}
          {loggedInRef.current
            ? <AppStack setIsDarkMode={setIsDarkMode} theme={theme}/>
            : <AuthStack theme={theme}/>}
        </AppContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default App;