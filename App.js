import { StatusBar } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import useState from 'react-usestateref'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from "expo-splash-screen";

import { useFonts, setThemeData } from './hooks/useStyles';
import { AuthStack } from './views/AuthStack';
import { AppStack } from './views/AppStack/AppStack';
import { UserData } from './core/UserData';
import { Preferences } from './core/Preferences';
import { AppContextProvider } from './utils/AppContext';
import { CoefficientManager } from './utils/CoefficientsManager';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';


function App() {
  // Decide to show AppStack or AuthStack
  const [loggedIn, setLoggedIn, loggedInRef] = useState(false);
  const [_loggedInLoaded, setLoggedInLoaded, loggedInLoadedRef] = useState(false);
  AsyncStorage.getItem('credentials').then(async (jsonValue) => {
    if (loggedInLoadedRef.current) { return; }
    if (jsonValue !== null) {
      console.log("Detected already logged-in account (loading cache...)");
      await Preferences.load();
      await CoefficientManager.load();
      await UserData.loadCache();
      setLoggedIn(true);
    } else {
      console.log("No account detected, showing auth stack");
    }
    setLoggedInLoaded(true);
    await SplashScreen.hideAsync();
  });

  // App theme
  const theme = useTheme();
  setThemeData(theme);

  // Fonts
  const [_fontsLoaded, setFontsLoaded, fontsLoadedRef] = useState(false);
  const loadFonts = async () => { await useFonts(); };
  if (!fontsLoadedRef.current) {
    loadFonts().then(() => { setFontsLoaded(true); });
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Provider needed to update UI when logging-in/out */}
      <AppContextProvider state={{ loggedIn, setLoggedIn }}>
        {/* Theme provider */}
        <PaperProvider theme={theme}>
          <BottomSheetModalProvider>
            {/* AuthStack / AppStack */}
            {loggedInLoadedRef.current
              ? loggedInRef.current
                ? <AppStack theme={theme}/>
                : <AuthStack theme={theme} />
              : null}
          </BottomSheetModalProvider>
        </PaperProvider>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;