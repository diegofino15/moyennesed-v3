import { View, Text, Platform } from "react-native";


function UnavailableServers({ style, theme }) {
  return (
    <View style={style}>
      <Text style={[theme.fonts.labelLarge, { color: theme.colors.tertiary, textAlign: 'justify', marginBottom: 10 }]}>Vérifiez votre connexion internet.</Text>
      <Text style={[theme.fonts.labelLarge, { color: theme.colors.tertiary, textAlign: 'justify', marginBottom: 10 }]}>Les serveurs sont temporairement indisponibles, veuillez rééssayer plus tard ou télécharger la dernière mise à jour sur {Platform.OS == "ios" ? "l'AppStore" : "le PlayStore"}.</Text>
    </View>
  );
}

export { UnavailableServers };