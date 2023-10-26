import { useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import LottieView from 'lottie-react-native';


function WelcomePage({ pageStyle, theme }) {
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
          ref={animationRef}
          source={require("../../../assets/lottie/welcome-animation.json")}
          style={{
            width: Dimensions.get('window').width,
          }}
        />
      </View>
    </View>
  );
}

export { WelcomePage };