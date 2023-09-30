import { ScrollView, Dimensions } from 'react-native';
import { useRef, useEffect } from 'react';
import useState from 'react-usestateref'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppContext } from '../../utils/AppContext';
import { UserData } from '../../core/UserData';

import { MainPage } from './MainPage';
import { ProfilePage } from './ProfilePage';


function AppStack({ theme }) {
  // Main connection states
  const [_connected, setConnected, connectedRef] = useState(UserData.connected);
  const [_connecting, setConnecting, connectingRef] = useState(UserData.connecting);
  const [_triedToConnect, setTriedToConnect, triedToConnectRef] = useState(false);

  // Auto-connect (only first launch)
  if (!(connectedRef.current || connectingRef.current) && !triedToConnectRef.current) {
    setTriedToConnect(true);
    console.log("Auto-connecting...");
    AsyncStorage.getItem('credentials').then((jsonValue) => {
      const value = JSON.parse(jsonValue);
      if (value !== null && !connectedRef.current && !connectingRef.current) {
        setConnecting(true);
        setConnected(false);
        UserData.login(value.username, value.password).then((result) => {
          setConnected(result);
          setConnecting(false);
        });
      }
    });
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
  }, []);

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
        theme={theme}
      />

      {/* Profile page */}
      <ProfilePage
        connectedRef={connectedRef}
        connectingRef={connectingRef}
        scrollViewRef={scrollViewRef}
        profilePhotoRef={profilePhotoRef}
        refreshProfilePhoto={refreshProfilePhoto}
        logout={logout}
        theme={theme}
      />
    </ScrollView>
  );
}

export { AppStack };