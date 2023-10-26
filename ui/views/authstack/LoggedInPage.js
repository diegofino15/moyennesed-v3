import { useRef, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

import { UserData } from "../../../core/UserData";


function LoggedInPage({ pageStyle, theme }) {
  // Animation
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.reset();
    setTimeout(() => {
      animationRef.current?.play();
    }, 100)
  }, []);
  
  return (
    <View style={pageStyle}>
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
      ]}>Vous êtes connecté{UserData.mainAccount.getSuffix()} en tant que <Text style={[theme.fonts.labelLarge, { fontFamily: 'Montserrat-Bold' }]}>compte {UserData.mainAccount.isParent ? "parent" : "élève"}</Text>.</Text>
    
      {/* Animation */}
      <View style={{
        position: 'absolute',
        top: 200,
      }}>
        <LottieView
          ref={animationRef}
          autoPlay
          loop={true}
          source={UserData.mainAccount.isParent
            ? UserData.mainAccount.gender == "M"
              ? require("../../../assets/lottie/login-parent-man.json")
              : require("../../../assets/lottie/login-parent-woman.json")
            : UserData.mainAccount.gender == "M"
              ? require("../../../assets/lottie/login-student-boy.json")
              : require("../../../assets/lottie/login-student-girl.json")
          }
          style={{
            width: Dimensions.get('window').width,
          }}
        />
      </View>
    </View>
  );
}

export { LoggedInPage };