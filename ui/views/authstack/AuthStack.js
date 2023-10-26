import { useRef, useEffect, } from 'react';
import { View, SafeAreaView, ScrollView, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { ChevronRightIcon } from 'lucide-react-native';
import useState from 'react-usestateref'

import { WelcomePage } from './WelcomePage';
import { FeaturesPage } from './FeaturesPage';
import { LoginPage } from './LoginPage';
import { LoggedInPage } from './LoggedInPage';
import { CustomButton } from '../global_components/CustomButton';
import { useAppContext } from '../../../utils/AppContext';


function AuthStack({ theme }) {
  // Is logged in ?
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (loggedIn) {
      setScreenIndex(3);
      setTimeout(() => scrollViewRef.current?.scrollTo({x: Dimensions.get('window').width * screenIndexRef.current, animated: true}), 300);
    }
  }, [loggedIn]);

  const [isConnecting, setIsConnecting, isConnectingRef] = useState(false);

  // To change to AppStack once logged-in
  const appCtx = useAppContext();

  // For scroll and button click
  const [_screenIndex, setScreenIndex, screenIndexRef] = useState(0);
  const scrollViewRef = useRef(null);
  async function buttonClick() {
    if (loggedIn) {
      appCtx.setLoggedIn(true);
      return;
    }

    if (screenIndexRef.current < 2) {
      scrollViewRef.current?.scrollTo({x: Dimensions.get('window').width * (screenIndexRef.current + 1), animated: true});    
    } else {
      setIsConnecting(true);
    }
  };

  return (
    <SafeAreaView style={{
      backgroundColor: theme.colors.background,
      width: '100%',
      height: '100%',
    }}>
      {/* Main scrollable component */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').width}
        bounces={false}
        scrollEnabled={loggedIn ? false : true}
        decelerationRate={0}
        snapToAlignment='center'
        ref={scrollViewRef}
        scrollEventThrottle={240} // 5 x second
        onScroll={(event) => {
          setScreenIndex(Math.floor((event.nativeEvent.contentOffset.x + Dimensions.get('window').width / 2) / Dimensions.get('window').width));
        }}
      >
        {/* Welcome page */}
        <WelcomePage pageStyle={styles.pageView} theme={theme}/>

        {/* Features page  */}
        <FeaturesPage pageStyle={styles.pageView} theme={theme}/>

        {/* Login page  */}
        <LoginPage
          isConnecting={isConnecting}
          setIsConnecting={setIsConnecting}
          setLoggedIn={setLoggedIn}
          pageStyle={styles.pageView}
          theme={theme}
        />

        {/* Logged-in view */}
        {loggedIn && <LoggedInPage pageStyle={styles.pageView} theme={theme}/>}
      </ScrollView>
      
      {/* Continue button */}
      <SafeAreaView>
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: Dimensions.get('window').width - 40,
        }}>
          <CustomButton
            title={screenIndexRef.current < 2 ? "Continuer" : loggedIn ? "C'est parti !" : "Connexion"}
            onPress={buttonClick}
            rightIcon={screenIndexRef.current < 2 ? <ChevronRightIcon size={20} color={theme.colors.onPrimary} /> : null}
            loadIcon={<ActivityIndicator size={20} color={theme.colors.onPrimary} />}
            overrideIsLoading={isConnectingRef.current}
            willLoad={screenIndexRef.current === 2}
            theme={theme}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

// Page style
const styles = StyleSheet.create({
  pageView: {
    width: Dimensions.get('window').width,
    height: '100%',
    paddingHorizontal: 20,
  },
});

export { AuthStack };