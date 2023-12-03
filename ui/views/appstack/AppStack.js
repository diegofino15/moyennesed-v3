import { useRef, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import useState from 'react-usestateref'
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

import { MainPage } from './MainPage';
import { ProfilePage } from './ProfilePage';
import { UserData } from '../../../core/UserData';
import { useAppContext } from '../../../utils/AppContext';
import { Logger } from '../../../utils/Logger';
import { DEBUG } from '../../../core/Preferences';


// Interstitial Ad
const interstitialAdDelay = 60000; // 1min
const interstitialAdUnitID = DEBUG ? 'ca-app-pub-3940256099942544/1033173712' : Platform.OS == "ios" ? "ca-app-pub-1869877675520642/8836784242" : "ca-app-pub-1869877675520642/2850794547";
var interstitialAd;

function AppStack({ setIsDarkMode, theme }) {
  // Main connection states
  const [_connected, setConnected, connectedRef] = useState(UserData.connected);
  useEffect(() => {
    if (connectedRef.current && !UserData.connected) { setConnected(UserData.connected); }
  }, [UserData.connected]);
  const [_connecting, setConnecting, connectingRef] = useState(UserData.connecting);
  const [_triedToConnect, setTriedToConnect, triedToConnectRef] = useState(false);

  // Auto-connect (only first launch)
  if (!(connectedRef.current || connectingRef.current) && !triedToConnectRef.current) {
    setTriedToConnect(true);
    Logger.info("Auto-connecting...");
    refreshLogin();
  }

  // Refresh login
  async function refreshLogin() {
    setConnecting(true);
    setConnected(false);
    const successful = await UserData.refreshLogin();
    setConnected(successful == 1);
    setConnecting(false);
  }

  // Log-out of account
  const appCtx = useAppContext();
  async function logout() {
    await UserData.logout();
    appCtx.setLoggedIn(false);
  }
  
  // For switching between pages
  const scrollViewRef = useRef(null);

  // Profile photo
  const [_profilePhoto, setProfilePhoto, profilePhotoRef] = useState(UserData.temporaryProfilePhoto);
  const [_gettingProfilePhoto, _setGettingProfilePhoto, gettingProfilePhotoRef] = useState(false);
  function refreshProfilePhoto(force=false) {
    gettingProfilePhotoRef.current = true;
    UserData.loadProfilePhoto(UserData.mainAccount, (photo) => {
      setProfilePhoto(photo);
      gettingProfilePhotoRef.current = false;
    }, force);
  }
  useEffect(() => {
    if (!UserData.mainAccount.isParent && !profilePhotoRef.current && !gettingProfilePhotoRef.current) {
      refreshProfilePhoto(false);
    }
  }, [UserData.mainAccount.photoURL]);

  // Update screen from anywhere
  const [_updateScreen, setUpdateScreen, updateScreenRef] = useState(false);

  // Interstitial Ad
  const [lastTimeClosedInterstitialAd, setLastTimeClosedInterstitialAd, lastTimeClosedInterstitialAdRef] = useState(Date.now());
  useEffect(() => {
    Logger.info("Reloaded Interstitial Ad");
    interstitialAd = InterstitialAd.createForAdRequest(interstitialAdUnitID, {
      requestNonPersonalizedAdsOnly: true,
    });
    interstitialAd.load();
    interstitialAd.addAdEventsListener((event) => {
      if (event.type == AdEventType.CLOSED) {
        setIsShowingInterstitialAd(false);
        interstitialAd.removeAllListeners();
        setLastTimeClosedInterstitialAd(Date.now());
      } else if (event.type == AdEventType.ERROR) {
        Logger.info("Interstitial Ad couldn't open...", true);
        Logger.info(event.payload, true);
      }
    });
  }, [lastTimeClosedInterstitialAdRef.current]);
  const [isShowingInterstitialAd, setIsShowingInterstitialAd] = useState(false);
  function maybeOpenInterstitialAd() {
    if (interstitialAd?.loaded && !isShowingInterstitialAd && (Date.now() - lastTimeClosedInterstitialAd) >= interstitialAdDelay) {
      setIsShowingInterstitialAd(true);
      interstitialAd?.show();
    }
  }

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      snapToInterval={Dimensions.get('window').width}
      bounces={false}
      scrollEnabled={false}
      decelerationRate={0}
      snapToAlignment='center'
      ref={scrollViewRef}
      scrollEventThrottle={240} // 5 x second
    >
      {/* Main mage */}
      <MainPage
        connectedRef={connectedRef}
        connectingRef={connectingRef}
        scrollViewRef={scrollViewRef}
        profilePhotoRef={profilePhotoRef}
        updateScreenRef={updateScreenRef}
        setUpdateScreen={setUpdateScreen}
        maybeOpenInterstitialAd={maybeOpenInterstitialAd}
        theme={theme}
      />

      {/* Profile page */}
      <ProfilePage
        connectedRef={connectedRef}
        connectingRef={connectingRef}
        refreshLogin={refreshLogin}
        scrollViewRef={scrollViewRef}
        profilePhotoRef={profilePhotoRef}
        logout={logout}
        updateScreenRef={updateScreenRef}
        setUpdateScreen={setUpdateScreen}
        setIsDarkMode={setIsDarkMode}
        maybeOpenInterstitialAd={maybeOpenInterstitialAd}
        theme={theme}
      />
    </ScrollView>
  );
}

export { AppStack };