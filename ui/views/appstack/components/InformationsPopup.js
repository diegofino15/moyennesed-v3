import { View, Text } from 'react-native';


function InformationsPopup({ theme }) {
  return (
    <View>
      <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Comment sont calculées les moyennes ?</Text>
      <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginBottom: 10 }]}>Les moyennes affichées dans l'appli sont approximatives, ne vous fiez pas à 100% de leur valeur exacte.</Text>
      <Text style={[theme.fonts.labelLarge, { textAlign: 'justify' }]}>MoyennesED récupère vos notes en temps réel, et calcule vos moyennes grâce aux coefficients récupérés, ou bien ceux estimés (modifiez vos préférences sur votre profil).</Text>
    </View>
  );
}

export { InformationsPopup };