import { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Text, Image, Switch, ActivityIndicator, Dimensions } from 'react-native';
import { ArrowRightIcon, BrainCircuitIcon, Check, ChevronLeft, RefreshCcw, UserIcon, WrenchIcon, X } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from "expo-haptics";

import { CustomButton } from '../../components/global/custom_button';
import { CustomSquareButton } from '../../components/appstack/custom_square_button';
import { Separator } from '../../components/global/separator';
import { CustomLink } from '../../components/appstack/custom_link';
import { UserData } from '../../core/UserData';
import { Preferences } from '../../core/Preferences';
import { CoefficientManager } from '../../utils/CoefficientsManager';


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
            icon={<ChevronLeft size={40} color={theme.colors.onSurfaceDisabled} />}
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
                ? <Check size={20} color='white' />
                : <X size={20} color='white' />}
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
              : <RefreshCcw size={25} color='white' />}
            </PressableScale>
          </View>
        </PressableScale>

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
            setUpdateScreen(!updateScreenRef.current)
          }} style={{
            marginTop: 5,
          }}>
            <Text style={[theme.fonts.labelLarge, { color: 'red' }]}>Effacer coefficients personnalisés</Text>
          </PressableScale>
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
          <CustomLink title="Site officiel ÉcoleDirecte" link='https://www.ecoledirecte.com' theme={theme}/>

          <Separator theme={theme} style={{ marginTop: 10, marginBottom: 10, backgroundColor: theme.colors.background }}/>

          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>Vos données sont uniquement stockées sur votre appareil, vos identifiants de connexion restent entre vous et ÉcoleDirecte.</Text>
          <CustomLink title="Confidentialité" link='https://moyennesed.my.to/privacy-policy.html' theme={theme}/>
        </View>

        {/* Bug report */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Un problème ?</Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          padding: 20,
        }}>
          <Text style={[theme.fonts.labelLarge, { textAlign: 'justify' }]}>[pas encore codé]</Text>
          <Separator theme={theme} style={{ marginTop: 10, marginBottom: 10, backgroundColor: theme.colors.background }}/>
          <PressableScale style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} onPress={() => {}}>
            <Text style={theme.fonts.bodyLarge}>[pas encore codé]</Text>
            <ArrowRightIcon size={30} color={theme.colors.onSurface} />
          </PressableScale>
        </View>
        
        {/* Disconnect buttons */}
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
      </SafeAreaView>
    </ScrollView>
  );
}

export { ProfilePage };