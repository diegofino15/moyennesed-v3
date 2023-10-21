import { View, Text } from "react-native";

import { Separator } from "./separator";
import { CustomLink } from "../appstack/custom_link";


function UnavailableServers({ style, theme }) {
  return (
    <View style={style}>
      <Text style={[theme.fonts.labelLarge, { color: '#DA3633', textAlign: 'justify', marginBottom: 10 }]}>Les serveurs sont temporairement indisponibles, veuillez réessayer plus tard ou télécharger la prochaine mise à jour.</Text>
      <CustomLink title="AppStore" link='https://apps.apple.com/fr/app/moyennesed/id6446418445' theme={theme}/>
    </View>
  );
}

export { UnavailableServers };