import { useRef, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import useState from 'react-usestateref'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardedAd, TestIds, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';

import { MainPage } from './MainPage';
import { ProfilePage } from './ProfilePage';
import { UserData } from '../../../core/UserData';
import { useAppContext } from '../../../utils/AppContext';
import AdsHandler from '../../../utils/AdsHandler';
import { Logger } from '../../../utils/Logger';


function AppStack({ setIsDarkMode, theme }) {
  // Main connection states
  const [_connected, setConnected, connectedRef] = useState(UserData.connected);
  useEffect(() => { if (connectedRef.current && !UserData.connected) { setConnected(UserData.connected); } }, [UserData.connected]);
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
  
  // For switching between main page and profile page
  const scrollViewRef = useRef(null);

  // Profile photo
  const [_profilePhoto, setProfilePhoto, profilePhotoRef] = useState(UserData.temporaryProfilePhoto);
  const [_gettingProfilePhoto, _setGettingProfilePhoto, gettingProfilePhotoRef] = useState(false);
  useEffect(() => {
    function refreshProfilePhoto() {
      gettingProfilePhotoRef.current = true;
      UserData.loadProfilePhoto(UserData.mainAccount, (photo) => {
        setProfilePhoto(photo);
        gettingProfilePhotoRef.current = false;
      });
    }

    if (!UserData.mainAccount.isParent && !profilePhotoRef.current && !gettingProfilePhotoRef.current) {
      refreshProfilePhoto();
    }
  }, [UserData.mainAccount.photoURL]);

  // Update screen from anywhere
  const [_updateScreen, setUpdateScreen, updateScreenRef] = useState(false);
  function updateScreen() { setUpdateScreen(!updateScreenRef.current); }

  // AD STUFF //
  const AD_COOLDOWN = 12 * 60 * 60 * 1000;
  const [_currentAd, setCurrentAd, currentAdRef] = useState(null);
  const [_canShowContent, setCanShowContent, canShowContentRef] = useState(false);
  const [_triedToShowAd, setTriedToShowAd, triedToShowAdRef] = useState(false);
  const [_earnedReward, setEarnedReward, earnedRewardRef] = useState(false);
  function getAdUnitID() { return __DEV__ ? TestIds.REWARDED : Platform.select({
    ios: process.env.EXPO_PUBLIC_IOS_REWARDED_AD_UNIT_ID,
    android: process.env.EXPO_PUBLIC_ANDROID_REWARDED_AD_UNIT_ID,
  })}
  function getNewAd() { return RewardedAd.createForAdRequest(getAdUnitID(), {
    keywords: ['élève', 'lycéen', 'collège', 'lycée', 'école', 'éducation'],
    requestNonPersonalizedAdsOnly: !AdsHandler.servePersonalizedAds,
  });}
  function addAdListeners() {
    currentAdRef.current.addAdEventsListener(event => {
      if (event.type === AdEventType.LOADED) {
        if (triedToShowAdRef.current) { currentAdRef.current.show(); }
      } else if (event.type === RewardedAdEventType.EARNED_REWARD || event.type === AdEventType.ERROR) {
        Logger.info("Reward granted");
        setEarnedReward(event.type === RewardedAdEventType.EARNED_REWARD);
        setCanShowContent(true);
        AsyncStorage.setItem("canShowAverage", JSON.stringify({ lastAdShowedDate: Date.now() }));
      } else if (event.type === AdEventType.CLOSED && !earnedRewardRef.current) {
        Logger.info("Reward not granted");
        setCurrentAd(null);
      }
    });
  }
  useEffect(() => { if (!currentAdRef.current) {
    if (!AdsHandler.canServeAds) { setCanShowContent(true); return; }
    
    AsyncStorage.getItem("canShowAverage").then(value => {
      const data = JSON.parse(value);
      if (data) {
        const lastAdShowedDate = new Date(data?.lastAdShowedDate ?? 0);
        if (Date.now() - lastAdShowedDate <= AD_COOLDOWN) {
          setCanShowContent(true);
          return;
        }
      } else {
        setCanShowContent(true);
        AsyncStorage.setItem("canShowAverage", JSON.stringify({
          lastAdShowedDate: Date.now(),
        }));
        return;
      }

      setCurrentAd(getNewAd());
      addAdListeners();
      currentAdRef.current.load();
    });
  }}, [currentAdRef.current]);

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
        profilePhotoRef={profilePhotoRef}
        scrollViewRef={scrollViewRef}
        updateScreen={updateScreen}
        adStuff={{
          currentAd: currentAdRef.current,
          canShowContent: canShowContentRef.current,
          setTriedToShowAd: setTriedToShowAd,
        }}
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
        updateScreen={updateScreen}
        updateScreenRef={updateScreenRef}
        setIsDarkMode={setIsDarkMode}
        theme={theme}
      />
    </ScrollView>
  );
}

export { AppStack };