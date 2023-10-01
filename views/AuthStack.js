import { useRef, useEffect, useCallback, } from 'react';
import { View, SafeAreaView, ScrollView, Text, ActivityIndicator, Dimensions, Linking, StyleSheet, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { User, KeyRound, ChevronRight } from 'lucide-react-native';
import useState from 'react-usestateref'

import { UserData } from '../core/UserData';
import { useAppContext } from '../utils/AppContext';
import MoyennesEDSection from '../components/moyennesed_section';
import MoyennesEDButton from '../components/moyennesed_button';
import MoyennesEDInput from '../components/moyennesed_input';


function AuthStack({ theme }) {
  // Login values
  const [_username, setUsername, usernameRef] = useState('');
  const [_password, setPassword, passwordRef] = useState('');
  const [_connectionFailed, setConnectionFailed, connectionFailedRef] = useState(false);
  const [_loggedIn, setLoggedIn, loggedInRef] = useState(false);

  // To change to AppStack once logged-in
  const appCtx = useAppContext();

  // For scroll and button click
  const [_screenIndex, setScreenIndex, screenIndexRef] = useState(0);
  const scrollViewRef = useRef(null);
  async function buttonClick() {
    if (loggedInRef.current) {
      appCtx.setLoggedIn(true);
      return;
    }

    if (screenIndexRef.current < 2) {
      scrollViewRef.current?.scrollTo({x: Dimensions.get('window').width * (screenIndexRef.current + 1), animated: true});    
    } else {
      setConnectionFailed(false);
      const successful = await UserData.login(usernameRef.current, passwordRef.current);
      
      setConnectionFailed(!successful);
      setLoggedIn(successful);

      if (successful) {
        setScreenIndex(screenIndexRef.current + 1);
        setTimeout(() => scrollViewRef.current?.scrollTo({x: Dimensions.get('window').width * screenIndexRef.current, animated: true}), 300);
      }
    }
  };

  // Forgot password ?
  const forgotPasswordURL = "https://api.ecoledirecte.com/mot-de-passe-oublie.awp";
  const openForgotPasswordURL = useCallback(async () => {
    const supported = await Linking.canOpenURL(forgotPasswordURL);

    if (supported) {
      await Linking.openURL(forgotPasswordURL);
    } else {
      Alert.alert("Une erreur est survenue lors du lancement de l'URL");
    }
  }, [forgotPasswordURL]);

  // Welcome animation
  const welcomeAnimation = useRef(null);
  useEffect(() => {
    welcomeAnimation.current?.reset();
    setTimeout(() => {
      welcomeAnimation.current?.play();
    }, 100)
  }, []);

  return (
    <SafeAreaView style={[
      styles.mainView,
      { backgroundColor: theme.colors.background }
    ]}>
      {/* Main scrollable screen */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').width}
        bounces={false}
        scrollEnabled={loggedInRef.current ? false : true}
        decelerationRate={0}
        snapToAlignment='center'
        ref={scrollViewRef}
        scrollEventThrottle={240} // 5 x second
        onScroll={(event) => {
          setScreenIndex(Math.floor((event.nativeEvent.contentOffset.x + Dimensions.get('window').width / 2) / Dimensions.get('window').width));
        }}
      >
        {/* Welcome page */}
        <View style={styles.pageView}>
          {/* Welcome text */}
          <Text style={[
            theme.fonts.titleLarge,
            { marginBottom: 10 }
          ]}>Bienvenue sur <Text style={theme.fonts.titleLarge}>MoyennesED</Text></Text>
          <Text style={theme.fonts.labelLarge}>L'appli pour consulter vos moyennes facilement et rapidement</Text>
          {/* Animation */}
          <View style={{
            position: 'absolute',
            top: 180,
          }}>
            <LottieView
              ref={welcomeAnimation}
              source={require("../assets/lottie/welcome-animation.json")}
              style={{
                width: Dimensions.get('window').width,
              }}
            />
          </View>
        </View>
        {/* Features page  */}
        <View style={styles.pageView}>
          {/* Title */}
          <Text style={[
            theme.fonts.titleMedium,
            { marginBottom: 10 }
          ]}>Une appli simple, épurée, sans pubs</Text>
          <Text style={[
            theme.fonts.labelLarge,
            { marginBottom: 30 }
          ]}>À la fois pour les élèves, mais aussi pour les parents !</Text>

          {/* Features */}
          <MoyennesEDSection
            title="🚀 L'ajout parfait à ÉcoleDirecte"
            description="Retrouvez votre moyenne générale et vos moyennes par matière, parfois cachées sur ÉcoleDirecte !"
            theme={theme}
            style={{ marginBottom: 30 }}
          />
          <MoyennesEDSection
            title="🌟 Élève ou parent ?"
            description="MoyennesED fonctionne pour les élèves et les parents ! Consultez vos moyennes ou celles de vos enfants."
            theme={theme}
            style={{ marginBottom: 30 }}
          />
          <MoyennesEDSection
            title="🔒 Plus sécurisée que jamais"
            description="Toutes vos données sont stockées sur votre appareil uniquement. Vos identifiants de connexion ne sont pas partagés."
            theme={theme}
          />
        </View>
        {/* Login page  */}
        <View style={styles.pageView}>
          {/* Title */}
          <Text style={[
            theme.fonts.titleMedium,
            { marginBottom: 10 }
          ]}>Commençons par vous connecter</Text>
          <Text style={[
            theme.fonts.labelLarge,
            { marginBottom: 30 }
          ]}>MoyennesED fonctionne avec vos identifiants ÉcoleDirecte</Text>
          
          {/* Login input */}
          <MoyennesEDInput
            label="Identifiant"
            icon={<User size={30} color={theme.colors.onSurfaceDisabled} />}
            onChangeText={(text) => setUsername(text)}
            secureTextEntry={false}
            theme={theme}
            style={{ marginBottom: 10 }}
          />
          <MoyennesEDInput
            label="Mot de passe"
            icon={<KeyRound size={30} color={theme.colors.onSurfaceDisabled} />}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            theme={theme}
            style={{
              marginBottom: 20,
              borderColor: connectionFailedRef.current ? 'red' : theme.colors.surface,
            }}
          />
          <MoyennesEDSection
            title="🤔 Mot de passe oublié ?"
            description={`Pas de panique, ça arrive à tout le monde ! Cliquez ici pour réinitialiser votre mot de passe.`}
            onPress={openForgotPasswordURL}
            theme={theme}
          />
        </View>

        {/* Logged-in view */}
        {loggedInRef.current ?
        <View style={styles.pageView}>
          {/* Title */}
          <Text style={[
            theme.fonts.titleMedium,
            { marginBottom: 10 }
          ]}>Bonjour {UserData.mainAccount.firstName} !</Text>
          <Text style={[
            theme.fonts.labelLarge,
            { marginBottom: 30 }
          ]}>Connexion bel et bien réussie !</Text>

          {/* Account type */}
          <Text style={[
            theme.fonts.labelLarge,
            { marginBottom: 30 }
          ]}>Vous êtes connecté{UserData.mainAccount.getSuffix()} en tant que <Text style={[theme.fonts.labelLarge, { fontFamily: 'Montserrat-Bold' }]}>compte {UserData.mainAccount.isParent ? "parent" : "éléve"}</Text>.</Text>
        
          {/* Animation */}
          <View style={{
            position: 'absolute',
            top: 200,
          }}>
            <LottieView
              autoPlay
              loop={true}
              source={UserData.mainAccount.isParent
                ? UserData.mainAccount.gender == "M"
                  ? require("../assets/lottie/login-parent-man.json")
                  : require("../assets/lottie/login-parent-woman.json")
                : UserData.mainAccount.gender == "M"
                  ? require("../assets/lottie/login-student-boy.json")
                  : require("../assets/lottie/login-student-girl.json")
              }
              style={{
                width: Dimensions.get('window').width,
              }}
            />
          </View>
        </View>
        : null}
      </ScrollView>
      
      {/* Continue button */}
      <SafeAreaView>
        <View style={styles.buttonView}>
          <MoyennesEDButton
            title={screenIndexRef.current < 2 ? "Continuer" : loggedInRef.current ? "C'est parti !" : "Connexion"}
            onPress={buttonClick}
            rightIcon={screenIndexRef.current < 2 ? <ChevronRight size={20} color={theme.colors.onPrimary} /> : null}
            loadIcon={<ActivityIndicator size={20} color={theme.colors.onPrimary} />}
            theme={theme}
            willLoad={screenIndexRef.current === 2}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

// Styles used in the AuthStack
const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
  },
  pageView: {
    width: Dimensions.get('window').width,
    height: '100%',
    paddingHorizontal: 20,
  },
  buttonView: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: Dimensions.get('window').width - 40,
  },
});


export { AuthStack };