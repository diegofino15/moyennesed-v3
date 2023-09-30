import { View, Text, Dimensions } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { ChevronRight } from 'lucide-react-native';


function MoyennesEDSection({
  title,
  description,
  theme,
  onPress,
  style,
}) {
  let pressScale = 0.975;
  function onPressActive() {
    if (onPress) { onPress(); }
  }
  
  return (
    <PressableScale
      onPress={() => onPressActive()}
      weight="light"
      activeScale={pressScale}
    >
      <View style={[{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 15,
        paddingTop: 10,
        marginBottom: 15,
      }, style]}>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            ...theme.fonts.headlineSmall,
            marginBottom: 5,
          }}>
            {title}
          </Text>
          {onPress ? <ChevronRight size={20} color={theme.colors.onSurface} /> : null}
        </View>
        <Text style={{
          ...theme.fonts.labelMedium,
          textAlign: 'justify',
          letterSpacing: 0.3,
        }}>{description}</Text>
      </View>
    </PressableScale>
  );
}

export default MoyennesEDSection;

