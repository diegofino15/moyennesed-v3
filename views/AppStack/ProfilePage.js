import { ActivityIndicator, SafeAreaView, Text, View, ScrollView, Dimensions, Image } from 'react-native';
import MoyennesEDButton from '../../components/moyennesed_button';
import MoyennesEDSquareButton from '../../components/moyennesed_square_button';
import { ChevronLeft, UserIcon } from 'lucide-react-native';
import { UserData } from '../../core/UserData';
import TextTicker from 'react-native-text-ticker'


function ProfilePage({
  connectedRef, connectingRef,
  scrollViewRef,
  profilePhotoRef, refreshProfilePhoto,
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
        height: Dimensions.get('window').height,
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
          <MoyennesEDSquareButton
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
            ]}>Gérez vos paramètres et préférences de l'appli</Text>
          </View>
        </View>

        {/* Profile info */}
        <View style={{
          backgroundColor: theme.colors.surface,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 10,
          marginBottom: 20,
          marginTop: UserData.mainAccount.isParent ? 0 : 20,
          height: 60,
        }}>
          {!UserData.mainAccount.isParent && <View style={{
            position: 'absolute',
            top: -20,
            left: 10,
          }}>
            <MoyennesEDSquareButton
              key={profilePhotoRef.current}
              icon={profilePhotoRef.current ? <Image source={{ uri: profilePhotoRef.current }} style={{ width: 80, height: 80 }} /> : <UserIcon size={40} color={theme.colors.onSurfaceDisabled} />}
              theme={theme}
              onPress={() => {}}
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
                <Text style={[theme.fonts.headlineLarge, { overflow: 'visible' }]} numberOfLines={1}>
                  {UserData.mainAccount.fullName()}
                </Text>
              </ScrollView>
            </View>
            <Text style={theme.fonts.labelMedium}>Compte {UserData.mainAccount.isParent ? "parent" : "élève"}</Text>
          </View>
        </View>

        
        {/* Debug buttons */}
        <MoyennesEDButton
          theme={theme}
          title="Déconnexion"
          confirmTitle={`Êtes vous sûr${UserData.mainAccount.getSuffix()} ?`}
          onPress={logout}
          willLoad={true}
          loadIcon={<ActivityIndicator size={20} color={theme.colors.onPrimary} />}
          style={{
            backgroundColor: '#DA3633'
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

export { ProfilePage };