import { Platform, Text } from "react-native";
import { VideoIcon } from "lucide-react-native";
import { PressableScale } from "react-native-pressable-scale";
import { BlurView } from "expo-blur";


// Ad hidden component
function AdHiddenComponent({
  width,
  height,
  adStuff,
  theme,
  style,
}) {
  const { currentAd, canShowContent, setTriedToShowAd } = adStuff;
  
  return canShowContent ? null : (
    <PressableScale style={{
      width: width,
      height: height,
      borderWidth: 2,
      borderColor: theme.colors.background,
      borderRadius: 10,
      overflow: 'hidden',
      ...style,
    }} onPress={() => {
      if (currentAd.loaded) { currentAd.show(); }
      else { setTriedToShowAd(true); }
    }}>
      <BlurView tint="light" intensity={25} style={{
        padding: 10,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: Platform.select({ ios: null, android: theme.colors.background }),
      }}>
        <VideoIcon size={30} color={theme.colors.onSurface}/>
        <Text style={[theme.fonts.labelMedium, { textAlign: 'center' }]}>DÉVOILER LA MOYENNE</Text>
      </BlurView>
    </PressableScale>
  );
}

export default AdHiddenComponent;