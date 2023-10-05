import { View } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';


function CustomSquareButton({ icon, onPress, theme }) {
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

export default CustomSquareButton;

