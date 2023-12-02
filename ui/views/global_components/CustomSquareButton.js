import { View } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { HapticsHandler } from '../../../utils/HapticsHandler';

import * as Haptics from 'expo-haptics';


function CustomSquareButton({ icon, onPress, hasShadow, theme }) {
  function onPressActive() {
    if (onPress) {
      onPress();
      HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  return (
    <PressableScale
      onPress={onPressActive}
      style={{
        backgroundColor: hasShadow ? 'black' : theme.colors.background,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: hasShadow ? 0.6 : 0,
        shadowRadius: 2,
        shadowOffset: {
          width: 0,
        },
      }}
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

export { CustomSquareButton };