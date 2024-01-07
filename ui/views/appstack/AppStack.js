import { useRef, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import useState from 'react-usestateref'

import { MainPage } from './MainPage';
import { ProfilePage } from './ProfilePage';
import { UserData } from '../../../core/UserData';
import { useAppContext } from '../../../utils/AppContext';
import { Logger } from '../../../utils/Logger';


function AppStack({ setIsDarkMode, theme }) {
  // Log-out of account
  const appCtx = useAppContext();
  async function logout() {
    await UserData.logout();
    appCtx.setLoggedIn(false);
  }
  
  // Main connection states
  const [_connected, setConnected, connectedRef] = useState(UserData.connected);
  useEffect(() => { if (connectedRef.current && !UserData.connected) { setConnected(UserData.connected); } }, [UserData.connected]);
  const [_connecting, _setConnecting, connectingRef] = useState(UserData.connecting);
  const [_triedToConnect, _setTriedToConnect, triedToConnectRef] = useState(false);

  // Auto-connect (only first launch)
  if (!(connectedRef.current || connectingRef.current) && !triedToConnectRef.current) {
    triedToConnectRef.current = true;
    Logger.info("Auto-connecting...");
    refreshLogin();
  }

  // Refresh login
  async function refreshLogin() {
    connectingRef.current = true;
    setConnected(false);
    const successful = await UserData.refreshLogin();
    connectingRef.current = false;
    setConnected(successful == 1);
  }

  // Update screen from anywhere
  const [_updateScreen, setUpdateScreen, updateScreenRef] = useState(false);
  function updateScreen() { setUpdateScreen(!updateScreenRef.current); }
  
  // For switching between main page and profile page
  const scrollViewRef = useRef(null);

  // Profile photo (used in MainPage and ProfilePage)
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
    >
      {/* Main mage */}
      <MainPage
        connectedRef={connectedRef}
        connectingRef={connectingRef}
        profilePhotoRef={profilePhotoRef}
        openProfilePage={() => scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width, animated: true })}
        updateScreen={updateScreen}
        theme={theme}
      />

      {/* Profile page */}
      <ProfilePage
        connectedRef={connectedRef}
        connectingRef={connectingRef}
        refreshLogin={refreshLogin}
        closeProfilePage={() => scrollViewRef.current?.scrollTo({x: 0, animated: true})}
        profilePhotoRef={profilePhotoRef}
        logout={logout}
        updateScreen={updateScreen}
        setIsDarkMode={setIsDarkMode}
        theme={theme}
      />
    </ScrollView>
  );
}

export { AppStack };