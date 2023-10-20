import { Linking, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { LinkIcon, ArrowRightIcon } from 'lucide-react-native';


function CustomLink({ title, link, theme }) {
  return <PressableScale style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }} onPress={async () => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    } else {
      Alert.alert("Une erreur est survenue lors du lancement de l'URL");
    }
  }}>
    <LinkIcon size={20} color={theme.colors.onSurfaceDisabled}/>
    <Text style={theme.fonts.bodyLarge}>{title}</Text>
    <ArrowRightIcon size={30} color={theme.colors.onSurface}/>
  </PressableScale>;
}

export default CustomLink;

