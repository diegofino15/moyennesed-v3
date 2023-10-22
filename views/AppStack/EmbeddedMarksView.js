import { useState } from "react";
import { View } from "react-native";

import { UserData } from "../../core/UserData";
import { calculateAllAverages } from "../../core/Period";
import { CoefficientManager } from "../../utils/CoefficientsManager";
import { MarksOverview } from "../../components/appstack/marks_overview";
import { PeriodSwitcher } from "../../components/appstack/period_switcher";


function EmbeddedMarksView({
  shownAccountRef, isConnected, isConnecting,
  gotMarks, marksNeedUpdate,
  autoRefreshing,
  theme,
}) {
  // Update screen
  const [screenUpdated, setScreenUpdated] = useState(false);
  function updateScreen() { setScreenUpdated(!screenUpdated); }

  // Recalculate averages on coefficient changes
  function refreshAverages() {
    CoefficientManager.save();
    for (let [_, period] of shownAccountRef.current.periods) {
      calculateAllAverages(period);
    }
    UserData.saveCache();
    updateScreen();
  }

  const [shownPeriod, setShownPeriod] = useState(0);

  return (
    <View style={{
      marginHorizontal: 20,
    }}>
      {/* Period chooser */}
      <PeriodSwitcher
        periods={shownAccountRef.current.periods}
        shownPeriod={shownPeriod}
        setShownPeriod={setShownPeriod}
        theme={theme}
      />

      <MarksOverview
        period={[...shownAccountRef.current.periods.values()].at(shownPeriod) ?? {}}
        accoundID={shownAccountRef.current.id}
        loading={autoRefreshing || isConnecting}
        redCheck={!isConnected || marksNeedUpdate || !gotMarks}
        refreshAverages={refreshAverages}
        theme={theme}
      />
    </View>
  );
}

export { EmbeddedMarksView };