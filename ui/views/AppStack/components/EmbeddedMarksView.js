import { useState } from "react";
import { Dimensions, View } from "react-native";

import { PeriodSwitcher } from "./PeriodSwitcher";
import { MarksOverview } from "./MarksOverview";
import { BottomSheet } from "../../global_components/BottomSheet";
import { InformationsPopup } from "./InformationsPopup";
import { UserData } from "../../../../core/UserData";
import { calculateAllAverages } from "../../../../core/Period";
import { CoefficientManager } from "../../../../core/CoefficientsManager";


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

  // Which period is currently shown
  const [shownPeriod, setShownPeriod] = useState(0);

  // Informations popup
  const [infoPopupOpen, setInfoPopupOpen] = useState(false);
  function renderInfosPopup() {
    if (!infoPopupOpen) { return null; }
    return <BottomSheet
      isOpen={infoPopupOpen}
      onClose={() => setInfoPopupOpen(false)}
      snapPoints={[
        325 / Dimensions.get('screen').height * 100 + "%",
      ]}
      theme={theme}
      children={<InformationsPopup theme={theme}/>}
    />;
  }

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
        redCheck={!isConnected || !gotMarks || marksNeedUpdate}
        refreshAverages={refreshAverages}
        setInfoPopupOpen={setInfoPopupOpen}
        theme={theme}
      />

      {renderInfosPopup()}
    </View>
  );
}

export { EmbeddedMarksView };