import { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Text, Image, Switch, ActivityIndicator, Dimensions, Platform, StatusBar, useWindowDimensions } from 'react-native';
import { BrainCircuitIcon, BugIcon, CheckIcon, ChevronLeftIcon, MailIcon, MessageSquareDashedIcon, MoonIcon, RefreshCcwIcon, SunIcon, UserIcon, WrenchIcon, XIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from "expo-haptics";

import { CustomButton } from '../global_components/CustomButton';
import { CustomSquareButton } from '../global_components/CustomSquareButton';
import { Separator } from '../global_components/Separator';
import { CustomLink } from '../global_components/CustomLink';
import { BottomSheet } from '../global_components/BottomSheet';
import { UnavailableServers } from '../global_components/UnavailableServers';
import { BugReportPopup } from './components/BugReportPopup';
import { UserData } from '../../../core/UserData';
import { Preferences } from '../../../core/Preferences';
import { CoefficientManager } from '../../../core/CoefficientsManager';
import { HapticsHandler } from '../../../utils/HapticsHandler';
import AdsHandler from '../../../utils/AdsHandler';


function ProfilePage({
  connectedRef, connectingRef,
  refreshLogin,
  scrollViewRef,
  profilePhotoRef,
  logout,
  updateScreen,
  updateScreenRef,
  setIsDarkMode,
  theme
}) {
  async function closeProfilePage() { scrollViewRef.current?.scrollTo({x: 0, animated: true}); }
  
  const [allowGuessMarkCoefficients, setAllowGuessMarkCoefficients] = useState(Preferences.allowGuessMarkCoefficients);
  useEffect(() => {
    setAllowGuessMarkCoefficients(Preferences.allowGuessMarkCoefficients);
  }, [Preferences.allowGuessMarkCoefficients, updateScreenRef.current]);
  const [allowGuessSubjectCoefficients, setAllowGuessSubjectCoefficients] = useState(Preferences.allowGuessSubjectCoefficients);
  useEffect(() => {
    setAllowGuessSubjectCoefficients(Preferences.allowGuessSubjectCoefficients);
  }, [Preferences.allowGuessSubjectCoefficients, updateScreenRef.current]);
  const [allowCustomCoefficients, setAllowCustomCoefficients] = useState(Preferences.allowCustomCoefficients);
  useEffect(() => {
    setAllowCustomCoefficients(Preferences.allowCustomCoefficients);
  }, [Preferences.allowCustomCoefficients, updateScreenRef.current]);
  const [allowVibrations, setAllowVibrations] = useState(Preferences.vibrate);
  useEffect(() => {
    setAllowVibrations(Preferences.vibrate);
  }, [Preferences.vibrate, updateScreenRef.current]);

  const [unavailableServers, setUnavailableServers] = useState(UserData.unavailableServers);
  useEffect(() => {
    setUnavailableServers(UserData.unavailableServers);
  }, [UserData.unavailableServers, updateScreenRef.current]);

  // Window dimensions
  const windowDimensions = useWindowDimensions();

  // Bug report popup
  const [bugReportPopupOpen, setBugReportPopupOpen] = useState(false);
  function renderBugReportPopup() {
    if (!bugReportPopupOpen) { return null; }
    return <BottomSheet
      isOpen={bugReportPopupOpen}
      onClose={() => setBugReportPopupOpen(false)}
      snapPoints={[
        Math.min(550 / Dimensions.get('screen').height * windowDimensions.fontScale, 1) * 100 + "%",
      ]}
      children={<BugReportPopup windowDimensions={windowDimensions} theme={theme}/>}
      theme={theme}
    />;
  }
  
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
      style={{
        paddingHorizontal: 20,
        width: Dimensions.get('window').width,
        backgroundColor: theme.colors.background,
      }}
    >
      <SafeAreaView style={{
        backgroundColor: theme.colors.background,
        marginTop: 10,
        width: '100%',
        height: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
        {/* Title and go-back button */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          height: 70,
          marginBottom: 20,
        }}>
          <CustomSquareButton
            icon={<ChevronLeftIcon size={40} color={theme.colors.onSurfaceDisabled}/>}
            theme={theme}
            onPress={closeProfilePage}
          />
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: Dimensions.get('window').width - 130,
            marginLeft: 20,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={[
                theme.fonts.titleSmall,
                { fontFamily: 'Montserrat-Medium' }
              ]}>Profil</Text>
              <PressableScale
                onPress={() => {
                  setIsDarkMode(!Preferences.isDarkMode);
                  HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
                  Preferences.isDarkMode = !Preferences.isDarkMode;
                  Preferences.save();
                }}
                style={{
                  backgroundColor: theme.colors.surface,
                  padding: 5,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
              }}>
                {Preferences.isDarkMode ? <SunIcon size={20} color={theme.colors.onSurfaceDisabled}/> : <MoonIcon size={20} color={theme.colors.onSurfaceDisabled}/>}
                <Text style={[theme.fonts.labelMedium, { marginLeft: 5 }]}>Mode</Text>
              </PressableScale>
            </View>
            <Text style={theme.fonts.labelMedium} numberOfLines={2}>{UserData.mainAccount.isParent ? "Gérez vos" : "Gère tes"} paramètres et préférences de l'appli</Text>
          </View>
        </View>

        {/* Profile info */}
        <View style={{
          backgroundColor: theme.colors.surface,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 10,
          marginBottom: 10,
          marginTop: UserData.mainAccount.isParent ? 0 : 20,
          height: 60,
        }}>
          {!UserData.mainAccount.isParent ? <View style={{
            position: 'absolute',
            top: -20,
            left: 10,
          }}>
            <CustomSquareButton
              key={profilePhotoRef.current}
              icon={profilePhotoRef.current ? <Image source={{ uri: profilePhotoRef.current }} style={{ width: 80, height: 80, transform: [{ translateY: 5 }] }}/> : <UserIcon size={40} color={theme.colors.onSurfaceDisabled}/>}
              theme={theme}
              hasShadow={true}
            />
          </View> : null}
          <View style={{
            marginLeft: UserData.mainAccount.isParent ? 0 : 80,
            flexDirection: 'column',
            justifyContent: 'center',
            height: 40,
          }}>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Text style={[theme.fonts.titleSmall, { overflow: 'visible' }]} numberOfLines={1}>
                  {UserData.mainAccount.fullName()}
                </Text>
              </ScrollView>
            </View>
            <Text style={theme.fonts.labelMedium} numberOfLines={1}>{UserData.mainAccount.isParent ? "Compte parent" : UserData.mainAccount.classLabel ? UserData.mainAccount.classLabel : "Compte élève"}</Text>
          </View>
        </View>

        {/* Connection status */}
        <PressableScale style={{
          marginBottom: 20,
        }}>
          <View style={{
            backgroundColor: connectedRef.current ? theme.colors.secondary : connectingRef.current ? theme.colors.primary : theme.colors.tertiary,
            borderRadius: 10,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
              {connectingRef.current
              ? null
              : connectedRef.current
                ? <CheckIcon size={20 * windowDimensions.fontScale} color={theme.colors.onPrimary}/>
                : <XIcon size={20 * windowDimensions.fontScale} color={theme.colors.onPrimary}/>}
              <Text style={[
                theme.fonts.labelLarge,
                { color: theme.colors.onPrimary, marginLeft: 10 }
              ]}>{connectedRef.current ? `Connecté${UserData.mainAccount.getSuffix()}` : connectingRef.current ? "Connexion en cours..." : `Non connecté${UserData.mainAccount.getSuffix()}`}</Text>
            </View>
            <PressableScale
              onPress={() => {
                if (!connectingRef.current) {
                  HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Medium);
                  refreshLogin().then(() => {
                    HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Medium);
                  });
                }
              }}
              style={{
                borderColor: theme.colors.background,
                borderLeftWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50
              }}
            >
              {connectingRef.current
              ? <ActivityIndicator size={25 * windowDimensions.fontScale} color={theme.colors.onPrimary}/>
              : <RefreshCcwIcon size={25 * windowDimensions.fontScale} color={theme.colors.onPrimary}/>}
            </PressableScale>
          </View>
        </PressableScale>
        {unavailableServers && <View>
          <Separator theme={theme} style={{ marginBottom: 10 }}/>
          <UnavailableServers style={{ marginBottom: 10 }} theme={theme}/>
        </View>}

        <Separator theme={theme}/>

        {/* Advanced settings  */}
        <Text style={[theme.fonts.titleSmall, { marginTop: 20, marginBottom: 10 }]}>Fonctions avancées  <Text style={theme.fonts.labelLarge}>(auto)</Text></Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify' }]}>{UserData.mainAccount.isParent ? "Vous n'avez" : "Tu n'as"} pas les coefs ? L'IA de MoyennesED est là pour les deviner !</Text>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>Une icône <BrainCircuitIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ transform: [{ rotate: '90deg' }] }}/> apparaîtra auprès des coefficients estimés.</Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - 140 }]}>Devine coefficient notes</Text>
            <Switch
              value={allowGuessMarkCoefficients}
              onValueChange={async (value) => {
                Preferences.setAllowGuessMarkCoefficients(value);
                Preferences.save();
                UserData.recalculateAllCoefficients();
                CoefficientManager.save();
                setAllowGuessMarkCoefficients(value);
                updateScreen();
              }}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
            <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - 140 }]}>Devine coefficient matières</Text>
            <Switch
              value={allowGuessSubjectCoefficients}
              onValueChange={async (value) => {
                Preferences.setAllowGuessSubjectCoefficients(value);
                Preferences.save();
                UserData.recalculateAllCoefficients();
                CoefficientManager.save();
                setAllowGuessSubjectCoefficients(value);
                updateScreen();
              }}
            />
          </View>

          <Separator theme={theme} style={{ marginTop: 10, marginBottom: 10, backgroundColor: theme.colors.background }}/>

          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>{UserData.mainAccount.isParent ? "Vous pourrez" : "Tu pourras"} toujours spécifier un coefficient personnalisé, et une icône <WrenchIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/> apparaîtra.</Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - 140 }]}>Coefficients personnalisés</Text>
            <Switch
              value={allowCustomCoefficients}
              onValueChange={async (value) => {
                Preferences.setAllowCustomCoefficients(value);
                Preferences.save();
                UserData.recalculateAllCoefficients();
                CoefficientManager.isAverageHistoryUpdated = false;
                CoefficientManager.save();
                setAllowCustomCoefficients(value);
                updateScreen();
              }}
            />
          </View>
          <PressableScale onPress={() => {
            CoefficientManager.customMarkCoefficients.clear();
            CoefficientManager.customSubjectCoefficients.clear();
            CoefficientManager.isAverageHistoryUpdated = false;
            CoefficientManager.save();
            UserData.recalculateAllCoefficients();
            updateScreen();
            HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
          }} style={{
            marginTop: 5,
          }}>
            <Text style={[theme.fonts.labelLarge, { color: theme.colors.tertiary }]}>Effacer coefficients personnalisés</Text>
          </PressableScale>
        </View>

        {/* Bug report */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Un problème ?</Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
          <CustomLink title="Signaler un bug" onPress={() => setBugReportPopupOpen(true)} icon={<BugIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>} windowDimensions={windowDimensions} theme={theme}/>
          <Text style={[theme.fonts.labelLarge, { alignSelf: 'center' }]}>ou</Text>
          <CustomLink title="Envoyer un mail" link='mailto:moyennesed@gmail.com' icon={<MailIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>} windowDimensions={windowDimensions} theme={theme}/>
        </View>

        {/* Informations */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Informations</Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>MoyennesED est une application non-officielle, elle ne peut être tenue responsable de problèmes potentiels liés à son utilisation.</Text>
          <CustomLink title="Site officiel ÉcoleDirecte" link='https://www.ecoledirecte.com' style={{ marginBottom: 10 }} windowDimensions={windowDimensions} theme={theme}/>
          <CustomLink title="Confidentialité" link='https://moyennesed.my.to/privacy-policy.html' windowDimensions={windowDimensions} theme={theme}/>

          <Separator theme={theme} style={{ marginTop: 10, marginBottom: 10, backgroundColor: theme.colors.background }}/>

          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>L'application {UserData.mainAccount.isParent ? "vous est" : "t'es"} utile ? Écri{UserData.mainAccount.isParent ? "vez" : "s"} un commentaire pour soutenir le développeur !</Text>
          <CustomLink title="Écrire un commentaire" link={Platform.OS == 'ios' ? 'https://apps.apple.com/app/apple-store/id6446418445?action=write-review' : 'https://play.google.com/store/apps/details?id=me.diegof.moyennesed&showAllReviews=true'} style={{ marginBottom: 10 }} icon={<MessageSquareDashedIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>} windowDimensions={windowDimensions} theme={theme}/>
        </View>

        {/* Preferences */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Préférences</Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - 140 }]}>Vibrations</Text>
            <Switch
              value={allowVibrations}
              onValueChange={async (value) => {
                Preferences.vibrate = value;
                Preferences.save();
                setAllowVibrations(value);
                updateScreen();
              }}
            />
          </View>
        </View>

        {/* DEV */}
        {__DEV__ && (
          <View>
            <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Dev options</Text>
            <View style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 20,
              marginBottom: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}>
              <CustomLink
                title={"Open ad inspector"}
                onPress={() => {
                  AdsHandler.openDebugger();
                }}
                windowDimensions={windowDimensions}
                theme={theme}
              />
            </View>
          </View>
        )}
        
        {/* Disconnect button */}
        <CustomButton
          theme={theme}
          title="Déconnexion"
          confirmTitle={`${UserData.mainAccount.isParent ? "Êtes-vous" : "Es-tu"} sûr${UserData.mainAccount.getSuffix()} ?`}
          confirmLabel="Toutes les préférences seront effacées"
          onPress={logout}
          willLoad={true}
          loadIcon={<ActivityIndicator size={20} color={theme.colors.tertiary}/>}
          style={{
            backgroundColor: theme.colors.background,
            borderWidth: 2,
            borderColor: theme.colors.tertiary,
          }}
          textStyle={{
            color: theme.colors.tertiary,
          }}
        />

        {/* Extra space */}
        <View style={{ height: 20 }}></View>

        {/* Bug report popup */}
        {renderBugReportPopup()}
      </SafeAreaView>
    </ScrollView>
  );
}

export { ProfilePage };