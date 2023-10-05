import { useState } from 'react';
import { View, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';


function CustomButton({ title, confirmTitle, onPress, theme, leftIcon, rightIcon, loadIcon, willLoad, style, textStyle }) {
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  
  let pressScale = 0.95;
  if (!onPress) { pressScale = 1; }
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          });
        } else { onPress(); }
        setWaitingForConfirmation(false);
      }
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
          backgroundColor: theme.colors.primary,
          borderWidth: 1,
          borderColor: theme.colors.onPrimary,
          padding: 20,
          borderRadius: 20,
          alignItems: isLoading && loadIcon ? 'center' : 'stretch'
        },
        style,
      ]}>
        {isLoading && loadIcon ? loadIcon : 
          <View style={{
            flexDirection: 'row',
            justifyContent: leftIcon || rightIcon ? 'space-between' : 'center',
            alignItems: 'center',
          }}>
            {leftIcon ? leftIcon : null}
            <Text style={{
              ...theme.fonts.bodyLarge,
              color: theme.colors.onPrimary,
              ...textStyle,
            }}>
              {waitingForConfirmation ? confirmTitle : title}
            </Text>
            {rightIcon ? rightIcon : null}
          </View>
        }
      </View>
    </PressableScale>
  );
}

export default CustomButton;

