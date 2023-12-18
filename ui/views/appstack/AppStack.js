import { useRef, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import useState from 'react-usestateref'

import { MainPage } from './MainPage';
import { ProfilePage } from './ProfilePage';
import { UserData } from '../../../core/UserData';
import { useAppContext } from '../../../utils/AppContext';
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