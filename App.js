import { StatusBar } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import useState from 'react-usestateref'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts, setThemeData } from './hooks/useStyles';
import { AuthStack } from './views/AuthStack';
import { AppStack } from './views/AppStack/AppStack';
import { AppContextProvider } from './utils/AppContext';
import { UserData } from './core/UserData';
import { Preferences } from './core/Preferences';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function App() {
  // Decide to show app or auth stack
  const [loggedIn, setLoggedIn, loggedInRef] = useState(false);
  const [_loggedInLoaded, setLoggedInLoaded, loggedInLoadedRef] = useState(false);
  AsyncStorage.getItem('credentials').then(async (jsonValue) => {
    if (loggedInLoadedRef.current) { return; }
    if (jsonValue !== null) {
      console.log("Detected already logged-in account (loading cache...)");
      await Preferences.load();
      await UserData.loadCache();
      setLoggedIn(true);
    } else {
      console.log("No account detected, showing auth stack");
    }
    setLoggedInLoaded(true);
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
        {/* Set status bar color for app */}
        <StatusBar
          animated={true}
          barStyle='dark-content'
        />
        {/* Theme provider */}
        <PaperProvider theme={theme}>
          {/* AuthStack / AppStack */}
          {loggedInLoadedRef.current
            ? loggedInRef.current
              ? <AppStack theme={theme}/>
              : <AuthStack theme={theme} />
            : null}
        </PaperProvider>
      </AppContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;

/*
TODO:
  -> Integrate sub subjects in popups
  -> Sliders for coefficients
  -> Make the preferences customizable
  -> Bug report system

DONE:
  -> AuthStack + Log-in/out
  -> Profile photo (+ cache)
  -> Auto-connect + auto-get marks (+ cache)
  -> UI structure
  -> Account switcher + period switcher
  -> Subject cards
    -> Subject popups
  -> Marks cards
*/

