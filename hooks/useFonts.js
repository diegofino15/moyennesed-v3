import { loadAsync } from 'expo-font';

const useFonts = async () =>
  await loadAsync({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),

    'Bitter-Regular': require('../assets/fonts/Bitter-Regular.ttf'),
    'Bitter-Medium': require('../assets/fonts/Bitter-Medium.ttf'),
    'Bitter-Bold': require('../assets/fonts/Bitter-Bold.ttf'),
  });

export { useFonts };
