import { useState } from 'react';
import { View } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';


function MoyennesEDSquareButton({ icon, onPress, theme, loadIcon, willLoad }) {
  const [isLoading, setIsLoading] = useState(false);
  
  let pressScale = 0.95;
  if (!onPress) { pressScale = 1; }
  function onPressActive() {
    if (onPress) { // && !isLoading
      if (willLoad) {
        setIsLoading(true);
        onPress().then(() => {
          setIsLoading(false);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        });
      } else {
        onPress();
      }
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
        borderColor: theme.colors.background,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        overflow: 'hidden',
        padding: 10,
      }}>
        {isLoading && loadIcon ? loadIcon : icon}
      </View>
    </PressableScale>
  );
}

export default MoyennesEDSquareButton;

