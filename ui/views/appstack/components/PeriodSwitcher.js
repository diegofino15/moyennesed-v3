import { useEffect, useState, memo } from 'react';
import { View, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { HapticsHandler } from '../../../../utils/HapticsHandler';

import * as Haptics from "expo-haptics";


function PeriodSwitcher({ periods, shownPeriod, setShownPeriod, theme }) {
  const [selectedPeriod, setSelectedPeriod] = useState(shownPeriod);
  useEffect(() => {
    setSelectedPeriod(shownPeriod);
  }, [shownPeriod]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
      {[...periods.values()].map((period, periodKey) => <PressableScale
        onPress={() => {
          if (selectedPeriod != periodKey) {
            setSelectedPeriod(periodKey);
            setShownPeriod(periodKey);
            HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        key={periodKey}
        style={{
          width: 95 / periods.size + '%',
          borderRadius: 10,
          padding: 10,
          backgroundColor: selectedPeriod == periodKey ? theme.colors.primary : theme.colors.surface,
          marginBottom: 20,
      }}>
        <Text style={[theme.fonts.labelMedium, {
          color: selectedPeriod == periodKey ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled,
        }]}>{period.title}</Text>
      </PressableScale>)}
    </View>
  );
}

export default memo(PeriodSwitcher);