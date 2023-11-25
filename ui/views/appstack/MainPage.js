import { useEffect } from "react";
import { View, ScrollView, SafeAreaView, Text, Image, RefreshControl, Dimensions } from "react-native";
import { UserIcon } from "lucide-react-native";
import useState from "react-usestateref";
import * as Haptics from "expo-haptics";

import { EmbeddedMarksView } from './components/EmbeddedMarksView';
import { CustomSquareButton } from "../global_components/CustomSquareButton";
import { ChildSwitcher } from "./components/ChildSwitcher";
import { UserData } from "../../../core/UserData";
import { Logger } from "../../../utils/Logger";


function MainPage({
  connectedRef, connectingRef,
  scrollViewRef,
  profilePhotoRef, 
  updateScreenRef, setUpdateScreen,
  theme
}) {
  // Account shown on screen
  const [_selectedChildAccount, setSelectedChildAccount, selectedChildAccountRef] = useState("");
  function getAccount() {
    if (!UserData.mainAccount.isParent) { return UserData.mainAccount; }
    else {
      if (selectedChildAccountRef.current.length === 0) {
        selectedChildAccountRef.current = UserData.childrenAccounts.keys().next().value;
        Logger.core(`Automatically selecting child account : ${selectedChildAccountRef.current}`);
      }
      return UserData.childrenAccounts.get(selectedChildAccountRef.current);
    }
  }
  const [_shownAccount, setShownAccount, shownAccountRef] = useState(getAccount());
  useEffect(() => {
    setShownAccount(getAccount());
  }, [connectedRef.current, selectedChildAccountRef.current]);

  // Is user refreshing the page ?
  const [_refreshing, setRefreshing, refreshingRef] = useState(false);
  const [_manualRefreshing, setManualRefreshing, manualRefreshingRef] = useState(false);

  // All possible statuses
  const [_gotMarks, _setGotMarks, gotMarksRef] = useState(UserData.gotMarksFor);
  const [_gettingMarks, _setGettingMarks, gettingMarksRef] = useState(new Map());
  const [_marksNeedUpdate, _setMarksNeedUpdate, marksNeedUpdateRef] = useState(UserData.marksNeedUpdate);
  
  // Main function to get marks
  useEffect(() => {
    async function handleGetMarks(accountToUpdate) {
      // Return if marks are already loading
      if (gettingMarksRef.current.has(accountToUpdate.id) && gettingMarksRef.current.get(accountToUpdate.id)) { return; }
      
      if (!gotMarksRef.current.has(accountToUpdate.id) || !gotMarksRef.current.get(accountToUpdate.id)) {
        Logger.marks(`Getting marks for ${accountToUpdate.id}...`);
        setRefreshing(true);
        gettingMarksRef.current.set(accountToUpdate.id, true);
        gotMarksRef.current.set(accountToUpdate.id, false); UserData.gotMarksFor.set(accountToUpdate.id, false);
        
        const marks = await UserData.getMarks(accountToUpdate.id);
        if (marks == -1) {
          gettingMarksRef.current.set(accountToUpdate.id, false);
          Logger.marks(`Couldn't get marks for ${accountToUpdate.id}`, true);
          setRefreshing(false);
          setManualRefreshing(false);
          return;
        }

        accountToUpdate.formatReceivedMarks(marks, (periods) => {
          UserData.marksDataCache.set(accountToUpdate.id.toString(), periods);
        });
        gotMarksRef.current.set(accountToUpdate.id, true); UserData.gotMarksFor.set(accountToUpdate.id, true);
        gettingMarksRef.current.set(accountToUpdate.id, false);
        await UserData.saveCache();
        Logger.marks(`Got marks for ${accountToUpdate.id} !`);

        setUpdateScreen(!updateScreenRef.current);
        setRefreshing(false);
        if (manualRefreshingRef.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setManualRefreshing(false);
        }
      } else if (marksNeedUpdateRef.current.has(accountToUpdate.id) && marksNeedUpdateRef.current.get(accountToUpdate.id)) {
        Logger.core(`Refreshing marks for ${accountToUpdate.id}...`);
        setRefreshing(true);
        gettingMarksRef.current.set(accountToUpdate.id, true);
        marksNeedUpdateRef.current.set(accountToUpdate.id, false); UserData.marksNeedUpdate.set(accountToUpdate.id, false);
        
        const marks = await UserData.getMarks(accountToUpdate.id);
        if (marks == -1) {
          gotMarksRef.current.set(accountToUpdate.id, false); UserData.gotMarksFor.set(accountToUpdate.id, false);
          gettingMarksRef.current.set(accountToUpdate.id, false);
          Logger.core(`Couldn't refresh marks for ${accountToUpdate.id}`, true);
          setRefreshing(false);
          setManualRefreshing(false);
          return;
        }

        accountToUpdate.formatReceivedMarks(marks, (periods) => {
          UserData.marksDataCache.set(accountToUpdate.id.toString(), periods);
        });
        gettingMarksRef.current.set(accountToUpdate.id, false);
        await UserData.saveCache();
        Logger.core(`Refreshed marks for ${accountToUpdate.id} !`);

        setUpdateScreen(!updateScreenRef.current);
        setRefreshing(false);
        if (manualRefreshingRef.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setManualRefreshing(false);
        }
      }
    }
    
    if (connectedRef.current) {
      handleGetMarks(shownAccountRef.current);
    } else {
      setManualRefreshing(false);
    }
  }, [shownAccountRef.current, connectingRef.current, manualRefreshingRef.current]);

  // Refresh marks
  function refresh() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    marksNeedUpdateRef.current.set(shownAccountRef.current.id, true); UserData.marksNeedUpdate.set(shownAccountRef.current.id, true);
    setManualRefreshing(true);
  }

  // Open profile page
  async function openProfilePage() { scrollViewRef.current?.scrollTo({ x: Dimensions.get('window').width, animated: true }); }

  // Welcome message
  const [welcomeMessage, setWelcomeMessage] = useState("");
  useEffect(() => {
    var welcomeMessages = [];
    if (UserData.mainAccount.isParent) {
      welcomeMessages.push(
        `Les résultats de ${UserData.childrenAccounts.size > 1 ? "vos" : "votre"} champion${UserData.childrenAccounts.size > 1 ? "s" : ""} sont disponibles !`,
        `Le plus important c'est d'encourager ${UserData.childrenAccounts.size > 1 ? "vos" : "votre"} enfant${UserData.childrenAccounts.size > 1 ? "s" : ""} !`,
        `Pas toujours facile de devoir gérer ${UserData.childrenAccounts.size} enfant${UserData.childrenAccounts.size > 1 ? "s" : ""}...`,
        `La clé du succès de ${UserData.childrenAccounts.size > 1 ? "vos" : "votre"} enfant${UserData.childrenAccounts.size > 1 ? "s" : ""} ? Votre soutien !`,
        `Il${UserData.childrenAccounts.size > 1 ? "s" : ""} en donne${UserData.childrenAccounts.size > 1 ? "nt" : ""} du ${UserData.childrenAccounts.size > 1 ? "leur" : "sien"} ! Chacun son niveau.`,
        "Si vous aimez bien l'appli hésitez pas à aller la noter !",
        "Restez à l'affut des mises à jour !",
      );
    } else {
      welcomeMessages.push(
        "Allez, les cours sont bientôt finis !",
        "Plus que quelques jours avant le week-end...",
        `Quelques nouvelles notes pour ${UserData.mainAccount.gender == "M" ? "monsieur" : "madame"} ?`,
        "Perd pas la forme, les notes c'est pas tout !",
        "Pense juste pas au bac et tout va bien",
        `Tu seras ${UserData.mainAccount.gender == "M" ? "premier" : "première"} de classe un jour t'inquiète 🔥`,
        "Allez, pense aux grandes vacances c'est pas si loin...",
        "Déjà des contrôles toutes les semaines...",
        "Si t'aimes bien l'appli hésite pas à aller la noter !",
        "Corrige les coefs manuellement si ceux-ci ne sont pas bons !",
        "Alors, les graphiques ?",
        "Signale un bug si l'appli ne fonctionne pas bien !",
        "Reste à l'affut des mises à jour !",
      );
    }
    setWelcomeMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  }, []);

  // Update screen
  const [_refresh, _setRefresh] = useState(false);
  useEffect(() => {
    _setRefresh(!_refresh);
  }, [updateScreenRef.current]);

  return (
    <ScrollView
      bounces={true}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={manualRefreshingRef.current} onRefresh={refresh} tintColor={theme.colors.onBackground}/>
      }
      style={{
        width: Dimensions.get('window').width,
        backgroundColor: theme.colors.background,
      }}
    >
      <SafeAreaView style={{
        backgroundColor: theme.colors.background,
        marginTop: 10,
        width: '100%',
        height: '100%',
      }}>
        {/* Title */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 70,
          marginBottom: 20,
          marginHorizontal: 20,
        }}>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: Dimensions.get('window').width - 130,
          }}>
            <Text style={[
              theme.fonts.titleSmall,
              { fontFamily: 'Montserrat-Medium', marginBottom: 5 }
            ]} numberOfLines={1}>{UserData.mainAccount.firstName.length === 0 && connectingRef.current ? "Connexion..." : UserData.mainAccount.firstName.length === 0 ? "Déconnecté" : `Bonjour ${UserData.mainAccount.firstName} !`}</Text>
            <Text style={[
              theme.fonts.labelMedium,
              { overflow: 'visible', maxHeight: 50 }
            ]}>{welcomeMessage}</Text>
          </View>
          <CustomSquareButton
            key={profilePhotoRef.current}
            icon={profilePhotoRef.current ? <Image source={{ uri: profilePhotoRef.current }} style={{ width: 80, height: 80, transform: [{ translateY: 5 }]}}/> : <UserIcon size={40} color={theme.colors.onSurfaceDisabled}/>}
            theme={theme}
            onPress={openProfilePage}
            hasShadow={profilePhotoRef.current ? true : false}
          />
        </View>
        
        {/* Children account chooser for parents */}
        {UserData.mainAccount.isParent ? <ChildSwitcher
          selectedChildAccount={selectedChildAccountRef.current}
          setSelectedChildAccount={setSelectedChildAccount}
          theme={theme}
        /> : null}

        {/* Shown account grades */}
        <EmbeddedMarksView
          shownAccountRef={shownAccountRef}
          isConnected={connectedRef.current}
          isConnecting={connectingRef.current}
          gotMarks={gotMarksRef.current.get(shownAccountRef.current.id)}
          marksNeedUpdate={marksNeedUpdateRef.current.get(shownAccountRef.current.id)}
          autoRefreshing={!manualRefreshingRef.current && refreshingRef.current}
          refresh={refresh}
          manualRefreshingRef={manualRefreshingRef}
          theme={theme}
        />

        {/* Extra space */}
        <View style={{ height: 20 }}></View>
      </SafeAreaView>
    </ScrollView>
  );
}

export { MainPage };