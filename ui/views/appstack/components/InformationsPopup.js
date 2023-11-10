import { View, Text } from 'react-native';
import { CalculatorIcon } from 'lucide-react-native';


function InformationsPopup({ windowDimensions, theme }) {
  return (
    <View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <CalculatorIcon size={40 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>
        <Text style={[theme.fonts.titleSmall, { marginLeft: 10 }]} numberOfLines={2}>Comment sont calculées les moyennes ?</Text>
      </View>
      <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginTop: 10, marginBottom: 10 }]}>Les moyennes affichées dans l'appli sont approximatives, ne vous fiez pas à 100% de leur valeur exacte.</Text>
      <Text style={[theme.fonts.labelLarge, { textAlign: 'justify' }]}>MoyennesED récupère vos notes en temps réel, et calcule vos moyennes grâce aux coefficients récupérés, ou bien ceux estimés (modifiez vos préférences sur votre profil).</Text>
    </View>
  );
}

export { InformationsPopup };