import { View } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';


function MoyennesEDSquareButton({ icon, onPress, theme, hasBorders }) {
  let pressScale = 0.95;
  if (!onPress) { pressScale = 1; }
  function onPressActive() {
    if (onPress) {
      onPress();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  return (
    <PressableScale
      onPress={() => onPressActive()}
      weight="light"
      activeScale={pressScale}
    >
      <View style={{
        backgroundColor: theme.colors.surface,
        borderWidth: hasBorders ? 1 : 0,
        borderColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        overflow: 'hidden',
        padding: 10,
      }}>
        {icon}
      </View>
    </PressableScale>
  );
}

export default MoyennesEDSquareButton;

