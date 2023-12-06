import { useCallback, useEffect } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
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
import { BottomSheet } from './ui/views/global_components/BottomSheet';
import { AndroidAdverstisement } from './ui/views/global_components/AndroidAdvertisement';
import { AppContextProvider } from './utils/AppContext';
import { UserData } from './core/UserData';
import { Preferences, DEBUG } from './core/Preferences';
import { CoefficientManager } from './core/CoefficientsManager';
import { Logger } from './utils/Logger';


// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// AppOpen Ad
const willAppOpenAdBeDisplayed = Math.random() <= 0.33; // 1/3 chance
Logger.info(`Display AppOpen ad ? | ${willAppOpenAdBeDisplayed}`);
const appOpenAdUnitID = DEBUG ? "ca-app-pub-3940256099942544/9257395921" : Platform.OS === "ios" ? "ca-app-pub-1869877675520642/7552640661" : "ca-app-pub-1869877675520642/2337387712";
var appOpenAd;
if (willAppOpenAdBeDisplayed) {
  appOpenAd = AppOpenAd.createForAdRequest(appOpenAdUnitID, {
    requestNonPersonalizedAdsOnly: true,
  });
}

function App() {
  // AppOpen Ad
  if (willAppOpenAdBeDisplayed) {
    appOpenAd.addAdEventsListener((event) => {
      if (event.type === AdEventType.LOADED) {
        setIsAppOpenAdLoaded(true);
        if (loggedInLoadedRef.current && !wasAppOpenAdShowedRef.current && loggedInRef.current) {
          setWasAppOpenAdShowed(true);
          appOpenAd.show();
        }
      } else if (event.type == AdEventType.CLOSED) {
        SplashScreen.hideAsync();
      } else if (event.type == AdEventType.ERROR) {
        Logger.info("AppOpen Ad couldn't open...", true);
        Logger.info(event.payload, true);
      }
    });
  }
  const [_isAppOpenAdLoaded, setIsAppOpenAdLoaded, isAppOpenAdLoadedRef] = useState(false);
  const [_wasAppOpenAdShowed, setWasAppOpenAdShowed, wasAppOpenAdShowedRef] = useState(false);

  // Decide to show AppStack or AuthStack
  const [loggedIn, setLoggedIn, loggedInRef] = useState(false);
  const [_loggedInLoaded, setLoggedInLoaded, loggedInLoadedRef] = useState(false);

  // Android advertisement
  const [isAndroidAdvertisementShown, setIsAndroidAdvertisementShown] = useState(false);
  useEffect(() => {
    if (loggedIn && !Preferences.androidAdvertisementShown && Platform.OS == "ios") {
      setIsAndroidAdvertisementShown(true);
      Preferences.androidAdvertisementShown = true;
      Preferences.save();
    }
  }, [loggedIn]);
  function renderAndroidAdvertisement() {
    if (!isAndroidAdvertisementShown) { return null; }
    else {
      return <BottomSheet
        key={"android"}
        isOpen={isAndroidAdvertisementShown}
        onClose={() => setIsAndroidAdvertisementShown(false)}
        snapPoints={["70%"]}
        children={<AndroidAdverstisement windowDimensions={Dimensions.get('screen')} theme={theme}/>}
        theme={theme}
      />;
    }
  }

  // Initialize UI data
  const [_fontsLoaded, setFontsLoaded, fontsLoadedRef] = useState(false);
  const theme = useTheme();

  const [_isDarkMode, setIsDarkMode] = useState(Preferences.isDarkMode);
  setThemeData(theme); // Here to get updated when changing light/dark mode

  // Prepare function
  useEffect(() => {
    async function prepare() {
      if (willAppOpenAdBeDisplayed) { appOpenAd.load(); }
      
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
      if (!willAppOpenAdBeDisplayed) { await SplashScreen.hideAsync(); }
      else {
        if (!wasAppOpenAdShowedRef.current) {
          if (isAppOpenAdLoadedRef.current && loggedInRef.current) {
            setWasAppOpenAdShowed(true);
            appOpenAd.show();
          } else {
            await SplashScreen.hideAsync();
          }
        }
      }
    }
  }, [fontsLoadedRef.current, loggedInLoadedRef.current]);

  // Return null if UI is not loaded
  if (!fontsLoadedRef.current || !loggedInLoadedRef.current) { return null; }

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
          
          {/* Android advertisement */}
          {renderAndroidAdvertisement()}
        </AppContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default App;