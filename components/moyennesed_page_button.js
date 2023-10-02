import { useState } from 'react';
import { View, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';


function MoyennesEDPageButton({ title, leftIcon, onPress, theme, style }) {
  let pressScale = 0.95;
  if (!onPress) { pressScale = 1; }
  function onPressActive() {
    if (onPress) {
      onPress();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  return (
    <PressableScale
      onPress={() => onPressActive()}
      weight="light"
      activeScale={pressScale}
    >
      <View style={[
        {
          backgroundColor: theme.colors.surface,
          padding: 10,
          paddingLeft: 20,
          borderRadius: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        style,
      ]}>
        {leftIcon}
        <Text style={theme.fonts.headlineLarge}>
          {title}
        </Text>
        <ChevronRight size={40} color={theme.colors.onSurfaceDisabled}/>
      </View>
    </PressableScale>
  );
}

export default MoyennesEDPageButton;

