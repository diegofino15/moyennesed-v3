import { Text, Linking, Dimensions } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { LinkIcon, ArrowRightIcon } from 'lucide-react-native';


function CustomLink({ title, link, onPress, icon, style, windowDimensions, theme }) {
  return <PressableScale style={[{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }, style]} onPress={async () => {
    if (link) {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert("Une erreur est survenue lors du lancement de l'URL");
      }
    } else {
      onPress();
    }
  }}>
    {icon ? icon : <LinkIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>}
    <Text style={[theme.fonts.bodyLarge, { maxWidth: Dimensions.get('window').width - 80 - 50 * windowDimensions.fontScale }]} numberOfLines={2}>{title}</Text>
    <ArrowRightIcon size={30 * windowDimensions.fontScale} color={theme.colors.onSurface}/>
  </PressableScale>;
}

export { CustomLink };