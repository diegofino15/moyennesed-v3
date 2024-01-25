import { loadAsync } from 'expo-font';


// Load all fonts used troughout the app
const useFonts = async () => await loadAsync({
  'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
  'Montserrat-Medium': require('../../assets/fonts/Montserrat-Medium.ttf'),
  'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),

  'Bitter-Regular': require('../../assets/fonts/Bitter-Regular.ttf'),
  'Bitter-Medium': require('../../assets/fonts/Bitter-Medium.ttf'),
  'Bitter-Bold': require('../../assets/fonts/Bitter-Bold.ttf'),
});

// Function called on startup and on light/dark mode switch
function refreshTheme(theme, isDarkMode) {
  if (!isDarkMode) {
    theme.colors = {
      background: '#FFF',
      onBackground: '#000',
    
      surface: '#ECECEC',
      onSurface: '#000',
      onSurfaceDisabled: '#888',
    
      primary: '#1985A1',
      onPrimary: '#FFF',
      onPrimaryDisabled: '#888',
  
      secondary: '#4CAF50',
      onSecondary: '#000',
  
      tertiary: '#DA3633',
    };
  } else {
    theme.colors = {
      background: '#0D1117',
      onBackground: '#E6EDF3',
    
      surface: '#21262D',
      onSurface: '#C9D1D9',
      onSurfaceDisabled: '#7D8591',
    
      primary: '#1985A1',
      onPrimary: '#E6EDF3',
      onPrimaryDisabled: '#888',
  
      secondary: '#238636',
      onSecondary: '#0D1117',
  
      tertiary: '#DA3633',
    };
  }

  theme.fonts = {
    default: {
      fontSize: 17,
      fontWeight: 'normal',
      fontFamily: 'Montserrat-Medium',
    },
  
    titleLarge: {
      fontSize: 35.0,
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onBackground,
    },
    titleMedium: {
      fontSize: 25.0,
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onBackground,
    },
    titleSmall: {
      fontSize: 20.0,
      fontFamily: 'Montserrat-Medium',
      color: theme.colors.onBackground,
    },
  
    headlineLarge: {
      fontSize: 35.0,
      fontFamily: 'Bitter-Bold',
      color: theme.colors.onBackground,
    },
    headlineMedium: {
      fontSize: 20.0,
      fontFamily: 'Bitter-Medium',
      color: theme.colors.onBackground,
    },
    headlineSmall: {
      fontSize: 12.0,
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
}

export { useFonts, refreshTheme };