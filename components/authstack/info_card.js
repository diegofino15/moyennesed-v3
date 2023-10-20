import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';


function InfoCard({
  title,
  description,
  theme,
  onPress,
  style,
}) {
  return (
    <PressableScale onPress={onPress}>
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
            ...theme.fonts.bodyMedium,
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

export { InfoCard };