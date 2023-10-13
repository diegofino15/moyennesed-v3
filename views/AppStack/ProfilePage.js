import { ActivityIndicator, SafeAreaView, Text, View, ScrollView, Dimensions, Image } from 'react-native';
import CustomButton from '../../components/global/custom_button';
import CustomSquareButton from '../../components/appstack/custom_square_button';
import { BadgeInfoIcon, Check, ChevronLeft, HelpCircleIcon, RefreshCcw, Settings2Icon, UserIcon, X } from 'lucide-react-native';
import { UserData } from '../../core/UserData';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from "expo-haptics";
import Separator from '../../components/global/separator';


function ProfilePage({
  connectedRef, connectingRef,
  refreshLogin,
  scrollViewRef,
  profilePhotoRef,
  logout,
  theme
}) {
  async function closeProfilePage() { scrollViewRef.current?.scrollTo({x: 0, animated: true}); }
  
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
          {!UserData.mainAccount.isParent && <View style={{
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
          </View>}
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
            <Text style={theme.fonts.labelMedium}>Compte {UserData.mainAccount.isParent ? "parent" : "élève"}</Text>
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

        {/* Settings  */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Paramètres</Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          height: 100,
        }}>
        </View>

        {/* Informations */}
        <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Informations</Text>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
          height: 100,
        }}>
        </View>
        
        {/* Debug buttons */}
        <CustomButton
          theme={theme}
          title="Déconnexion"
          confirmTitle={`Êtes vous sûr${UserData.mainAccount.getSuffix()} ?`}
          onPress={logout}
          willLoad={true}
          loadIcon={<ActivityIndicator size={20} color='#DA3633' />}
          style={{
            backgroundColor: theme.colors.background,
            borderWidth: 2,
            borderColor: '#DA3633'
          }}
          textStyle={{
            color: '#DA3633',
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

export { ProfilePage };