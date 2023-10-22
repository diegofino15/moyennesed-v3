import { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Text, Image, Switch, ActivityIndicator, Dimensions } from 'react-native';
import { BrainCircuitIcon, BugIcon, CheckIcon, ChevronLeftIcon, MailIcon, RefreshCcwIcon, UserIcon, WrenchIcon, XIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from "expo-haptics";

import { CustomButton } from '../../../components/global/CustomButton';
import { CustomSquareButton } from '../../../components/appstack/CustomSquareButton';
import { Separator } from '../../../components/global/Separator';
import { CustomLink } from '../../../components/global/CustomLink';
import { BottomSheet } from '../../../components/appstack/BottomSheet';
import { UserData } from '../../../core/UserData';
import { Preferences } from '../../../core/Preferences';
import { CoefficientManager } from '../../../utils/CoefficientsManager';
import { UnavailableServers } from '../../../components/global/UnavailableServers';
import { BugReportPopup } from '../../../components/global/BugReportPopup';


function ProfilePage({
  connectedRef, connectingRef,
  refreshLogin,
  scrollViewRef,
  profilePhotoRef,
  logout,
  updateScreenRef, setUpdateScreen,
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

  const [unavailableServers, setUnavailableServers] = useState(UserData.unavailableServers);
  useEffect(() => {
    setUnavailableServers(UserData.unavailableServers);
  }, [UserData.unavailableServers, updateScreenRef.current]);

  // Bug report popup
  const [bugReportPopupOpen, setBugReportPopupOpen] = useState(false);
  function renderBugReportPopup() {
    if (!bugReportPopupOpen) { return null; }
    return <BottomSheet
      key={"mamamao"}
      isOpen={bugReportPopupOpen}
      onClose={() => setBugReportPopupOpen(false)}
      snapPoints={["80%"]}
      children={<BugReportPopup theme={theme}/>}
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
      }}>
        {/* Title and go-back button */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          height: 70,
          marginBottom: 20,
        }}>
          <CustomSquareButton
            icon={<ChevronLeftIcon size={40} color={theme.colors.onSurfaceDisabled} />}
            theme={theme}
            onPress={closeProfilePage}
          />
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: Dimensions.get('window').width - 130,
            marginLeft: 20,
          }}>
            <Text style={[
              theme.fonts.titleSmall,
              { fontFamily: 'Montserrat-Medium' }
            ]}>Profil</Text>
            <Text style={[
              theme.fonts.labelMedium,
              { overflow: 'visible', maxHeight: 40 }
            ]}>{UserData.mainAccount.isParent ? "Gérez vos" : "Gère tes"} paramètres et préférences de l'appli</Text>
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
              icon={profilePhotoRef.current ? <Image source={{ uri: profilePhotoRef.current }} style={{ width: 80, height: 80, transform: [{ translateY: 5 }] }} /> : <UserIcon size={40} color={theme.colors.onSurfaceDisabled} />}
              theme={theme}
              onPress={() => {}}
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
            <Text style={theme.fonts.labelMedium}>{UserData.mainAccount.isParent ? "Compte parent" : UserData.mainAccount.classLabel ? UserData.mainAccount.classLabel : "Compte élève"}</Text>
          </View>          
        </View>

        {/* Connection status */}
        <PressableScale style={{
          marginBottom: 20,
        }}>
          <View style={{
            backgroundColor: connectedRef.current ? '#4CAF50' : connectingRef.current ? '#2296F3' : '#DA3633',
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
                ? <CheckIcon size={20} color='white' />
                : <XIcon size={20} color='white' />}
              <Text style={[
                theme.fonts.labelLarge,
                { color: 'white', marginLeft: 10 }
              ]}>{connectedRef.current ? `Connecté${UserData.mainAccount.getSuffix()}` : connectingRef.current ? "Connexion en cours..." : `Non connecté${UserData.mainAccount.getSuffix()}`}</Text>
            </View>
            <PressableScale
              onPress={() => {
                if (!connectingRef.current) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  refreshLogin().then(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  });
                }
              }}
              style={{
                borderColor: 'white',
                borderLeftWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: 50
              }}
            >
              {connectingRef.current
              ? <ActivityIndicator size={25} color='white' />
              : <RefreshCcwIcon size={25} color='white' />}
            </PressableScale>
          </View>
        </PressableScale>
        {unavailableServers && <View>
          <Separator theme={theme} style={{ marginBottom: 10 }}/>
          <UnavailableServers style={{ marginBottom: 10 }} theme={theme}/>
        </View>}

        <Separator theme={theme} style={{ marginBottom: 20 }}/>

        {/* Advanced settings  */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Fonctions avancées  <Text style={theme.fonts.labelLarge}>(auto)</Text></Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify' }]}>{UserData.mainAccount.isParent ? "Votre" : "Ton"} établissement ne fournit pas les coefs ? L'IA de MoyennesED est là pour les deviner !</Text>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>Une icône <BrainCircuitIcon size={20} color={theme.colors.onSurfaceDisabled} style={{ transform: [{ rotate: '90deg' }] }}/> apparaîtra auprès des coefficients estimés.</Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={theme.fonts.bodyLarge}>Devine coefficient notes</Text>
            <Switch
              value={allowGuessMarkCoefficients}
              onValueChange={async (value) => {
                Preferences.setAllowGuessMarkCoefficients(value);
                Preferences.save();
                UserData.recalculateAllCoefficients();
                CoefficientManager.save();
                setAllowGuessMarkCoefficients(value);
                setUpdateScreen(!updateScreenRef.current);
              }}
            />
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
            <Text style={theme.fonts.bodyLarge}>Devine coefficient matières</Text>
            <Switch
              value={allowGuessSubjectCoefficients}
              onValueChange={async (value) => {
                Preferences.setAllowGuessSubjectCoefficients(value);
                Preferences.save();
                UserData.recalculateAllCoefficients();
                CoefficientManager.save();
                setAllowGuessSubjectCoefficients(value);
                setUpdateScreen(!updateScreenRef.current);
              }}
            />
          </View>

          <Separator theme={theme} style={{ marginTop: 10, marginBottom: 10, backgroundColor: theme.colors.background }}/>

          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>{UserData.mainAccount.isParent ? "Vous pourrez" : "Tu pourras"} toujours spécifier un coefficient personnalisé, et une icône <WrenchIcon size={20} color={theme.colors.onSurfaceDisabled}/> apparaîtra.</Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={theme.fonts.bodyLarge}>Coefficients personnalisés</Text>
            <Switch
              value={allowCustomCoefficients}
              onValueChange={async (value) => {
                Preferences.setAllowCustomCoefficients(value);
                Preferences.save();
                UserData.recalculateAllCoefficients();
                CoefficientManager.save();
                setAllowCustomCoefficients(value);
                setUpdateScreen(!updateScreenRef.current);
              }}
            />
          </View>
          <PressableScale onPress={() => {
            CoefficientManager.customMarkCoefficients.clear();
            CoefficientManager.customSubjectCoefficients.clear();
            CoefficientManager.save();
            UserData.recalculateAllCoefficients();
            setUpdateScreen(!updateScreenRef.current);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }} style={{
            marginTop: 5,
          }}>
            <Text style={[theme.fonts.labelLarge, { color: 'red' }]}>Effacer coefficients personnalisés</Text>
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
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify' }]}>L'appli ne fonctionne pas bien ?</Text>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>Envo{UserData.mainAccount.isParent ? "yez" : "ie"} un signalement de bug tout en restant complêtement anonyme.</Text>
          <CustomLink title="Signaler un bug" onPress={() => setBugReportPopupOpen(true)} icon={<BugIcon size={20} color={theme.colors.onSurfaceDisabled}/>} theme={theme}/>
          <Text style={[theme.fonts.labelLarge, { alignSelf: 'center' }]}>ou</Text>
          <CustomLink title="Envoyer un mail" link='mailto:moyennesed@gmail.com' icon={<MailIcon size={20} color={theme.colors.onSurfaceDisabled}/>} theme={theme}/>
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
          <CustomLink title="Site officiel ÉcoleDirecte" link='https://www.ecoledirecte.com' style={{ marginBottom: 10 }} theme={theme}/>
          <CustomLink title="Confidentialité" link='https://moyennesed.my.to/privacy-policy.html' theme={theme}/>
        </View>
        
        {/* Disconnect button */}
        <CustomButton
          theme={theme}
          title="Déconnexion"
          confirmTitle={`Êtes vous sûr${UserData.mainAccount.getSuffix()} ?`}
          onPress={logout}
          willLoad={true}
          loadIcon={<ActivityIndicator size={20} color='#DA3633'/>}
          style={{
            backgroundColor: theme.colors.background,
            borderWidth: 2,
            borderColor: '#DA3633'
          }}
          textStyle={{
            color: '#DA3633',
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