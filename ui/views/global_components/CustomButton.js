import { useState } from 'react';
import { View, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { HapticsHandler } from '../../../utils/HapticsHandler';

import * as Haptics from 'expo-haptics';


function CustomButton({ title, confirmTitle, confirmLabel, onPress, theme, leftIcon, rightIcon, loadIcon, willLoad, overrideIsLoading, style, textStyle }) {
  const [isLoading, setIsLoading] = useState(overrideIsLoading);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  
  function onPressActive() {
    if (onPress && !isLoading) {
      if (confirmTitle && !waitingForConfirmation) {
        setWaitingForConfirmation(true);
        setTimeout(() => {
          setWaitingForConfirmation(false);
        }, 3000);
      } else {
        if (willLoad) {
          setIsLoading(true);
          onPress().then(() => {
            setIsLoading(false);
            HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Medium);
          });
        } else { onPress(); }
        setWaitingForConfirmation(false);
      }
      HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  return (
    <PressableScale onPress={onPressActive}>
      <View style={[{
        backgroundColor: theme.colors.primary,
        borderWidth: 1,
        borderColor: theme.colors.background,
        paddingHorizontal: 20,
        paddingVertical: waitingForConfirmation && confirmLabel ? 12 : 20,
        borderRadius: 20,
        alignItems: isLoading && loadIcon ? 'center' : 'stretch'
      }, style]}>
        {(isLoading || overrideIsLoading) && loadIcon ? loadIcon : 
          <View style={{
            flexDirection: 'row',
            justifyContent: leftIcon || rightIcon ? 'space-between' : 'center',
            alignItems: 'center',
          }}>
            {leftIcon ? leftIcon : null}
            <View style={{
              alignItems: 'center'
            }}>
              <Text style={[
                theme.fonts.bodyLarge,
                { color: theme.colors.onPrimary },
                textStyle,
              ]}>
                {waitingForConfirmation ? confirmTitle : title}
              </Text>
              {waitingForConfirmation && confirmLabel ? <Text style={[theme.fonts.labelSmall, { color: theme.colors.onPrimary }, textStyle]}>{confirmLabel}</Text> : null}
            </View>
            {rightIcon ? rightIcon : null}
          </View>
        }
      </View>
    </PressableScale>
  );
}

export { CustomButton };