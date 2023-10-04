import { StatusBar } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import useState from 'react-usestateref'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFonts } from './hooks/useFonts';
import { AuthStack } from './views/AuthStack';
import { AppStack } from './views/AppStack/AppStack';
import { AppContextProvider } from './utils/AppContext';
import { UserData } from './core/UserData';
import { Preferences } from './core/Preferences';


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
  theme.colors = {
    background: '#FFF',
    onBackground: '#000',

    surface: '#ECECEC',
    onSurface: '#000',
    onSurfaceDisabled: '#888',

    primary: '#1985A1',
    onPrimary: '#FFF',
    onPrimaryDisabled: '#888',
  };
  theme.fonts = {
    default: {
      fontSize: 17,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Medium',
    },

    titleLarge: {
      fontSize: 35.0,
      fontWeight: 'bold',
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onBackground,
    },
    titleMedium: {
      fontSize: 25.0,
      fontWeight: 'bold',
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onBackground,
    },
    titleSmall: {
      fontSize: 20.0,
      fontWeight: 'bold',
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onBackground,
    },

    headlineLarge: {
      fontSize: 35.0,
      fontWeight: 'bold',
      fontFamily: 'Bitter-Bold',
      color: theme.colors.onBackground,
    },
    headlineMedium: {
      fontSize: 17.0,
      fontWeight: 'bold',
      fontFamily: 'Bitter-Medium',
      color: theme.colors.onBackground,
    },
    headlineSmall: {
      fontSize: 12.0,
      fontWeight: 'bold',
      fontFamily: 'Bitter-Medium',
      color: theme.colors.onBackground,
    },

    bodyLarge: {
      fontSize: 17.0,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onSurface,
    },
    bodyMedium: {
      fontSize: 15.0,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onSurface,
    },
    bodySmall: {
      fontSize: 13.0,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onSurface,
    },

    labelLarge: {
      fontSize: 17.0,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Regular',
      color: theme.colors.onSurfaceDisabled,
    },
    labelMedium: {
      fontSize: 15.0,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Regular',
      color: theme.colors.onSurfaceDisabled,
    },
    labelSmall: {
      fontSize: 13.0,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Regular',
      color: theme.colors.onSurfaceDisabled,
    },
  };

  // Fonts
  const [_fontsLoaded, setFontsLoaded, fontsLoadedRef] = useState(false);
  const loadFonts = async () => { await useFonts(); };
  if (!fontsLoadedRef.current) {
    loadFonts().then(() => { setFontsLoaded(true); });
    return null;
  }

  return (
    // Provider needed to update UI when logging-in/out
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
  );
}

export default App;

/*
TODO:
  -> Fix possible empty data like class mark values
  -> Make the preferences customizable
  -> Create marks UI (marks, popups, sliders...)
  -> Bug report system
  -> Infos about the app (on profile page)

DONE:
  -> AuthStack + Log-in/out
  -> Profile photo (+ cache)
  -> Auto-connect + auto-get marks
  -> UI structure
  -> Finish implementing cache
*/

