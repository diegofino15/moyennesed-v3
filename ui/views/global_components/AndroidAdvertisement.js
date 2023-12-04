import { useRef, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

import { CustomLink } from "./CustomLink";


function AndroidAdverstisement({ windowDimensions, theme }) {
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.reset();
    setTimeout(() => {
      animationRef.current?.play(60);
    }, 100)
  }, []);
  
  return <View>
    <Text style={theme.fonts.titleMedium}>MoyennesED est enfin sur Android !</Text>
    <LottieView
      source={require("../../../assets/lottie/android-logo.json")}
      autoPlay
      style={{
        width: Dimensions.get('screen').width - 40,
      }}
    />
    <CustomLink
      title={"Lien GooglePlay"}
      link={"https://play.google.com/store/apps/details?id=me.diegof.moyennesed"}
      style={{
        backgroundColor: theme.colors.surface,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
      }}
      windowDimensions={windowDimensions}
      theme={theme}
    />
  </View>
}

export { AndroidAdverstisement };