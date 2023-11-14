import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { CoefficientManager } from '../../../../core/CoefficientsManager';
import { PressableScale } from 'react-native-pressable-scale';
import { RefreshCcwIcon } from 'lucide-react-native';


function GeneralAverageGraphPopup({ period, manualRefreshingRef, refresh, theme }) {
  const numberOfMarks = 15;
  var shownValues = [...period.averageHistory?.values()];
  shownValues = shownValues.splice(Math.max(0, shownValues.length - numberOfMarks), numberOfMarks);

  return (
    <View>
      <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]} numberOfLines={2}>Évolution de la moyenne générale</Text>
      <View style={{
        borderRadius: 20,
        paddingTop: 20,
        backgroundColor: theme.colors.primary,
        marginTop: 10,
      }}>
        <LineChart
          data={{
            datasets: [
              { data: shownValues },
              { data: [0], withDots: false },
              { data: [20], withDots: false },
            ]
          }}
          width={Dimensions.get("window").width - 40}
          height={250}
          chartConfig={{
            backgroundGradientFrom: theme.colors.primary,
            backgroundGradientTo: theme.colors.primary,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => theme.colors.onPrimary,
            propsForDots: {
              r: "2",
              strokeWidth: "2",
              stroke: "white",
            },
          }}
          bezier
          style={{
            borderRadius: 20,
          }}
        />
        {!CoefficientManager.isAverageHistoryUpdated && <View style={{
          position: 'absolute',
          right: 10,
          top: -10,
          flexDirection: 'row',
        }}>
          {!manualRefreshingRef.current && <PressableScale onPress={refresh} style={{
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.surface,
            borderWidth: 1,
            borderRadius: 5,
            padding: 2,
            marginRight: 5,
          }}>
            <RefreshCcwIcon size={20} color={theme.colors.onPrimary}/>
          </PressableScale>}
          <PressableScale style={{
            backgroundColor: theme.colors.tertiary,
            borderColor: theme.colors.surface,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 5,
            paddingVertical: 2,
          }}>
            <Text style={[theme.fonts.labelMedium, { color: theme.colors.onPrimary }]}>Pas à jour</Text>
          </PressableScale>
        </View>}
      </View>
      <Text style={[theme.fonts.labelLarge, { textAlign: 'justify', marginTop: 10 }]}>Ce graphique représente l'évolution de votre moyenne générale suite à l'apparition des {numberOfMarks} dernières notes. Il est mis à jour à chaque rafraîchissement des notes.</Text>
    </View>
  );
}

export { GeneralAverageGraphPopup };