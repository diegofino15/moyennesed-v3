import { useEffect } from "react";
import { Dimensions, View, useWindowDimensions } from "react-native";
import useState from "react-usestateref";

import { PeriodSwitcher } from "./PeriodSwitcher";
import { MarksOverview } from "./MarksOverview";
import { BottomSheet } from "../../global_components/BottomSheet";
import { InformationsPopup } from "./InformationsPopup";
import { UserData } from "../../../../core/UserData";
import { calculateAllPeriodAverages } from "../../../../core/Period";
import { CoefficientManager } from "../../../../core/CoefficientsManager";
import { Logger } from "../../../../utils/Logger";


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
      calculateAllPeriodAverages(period);
    }
    UserData.saveCache();
    updateScreen();
  }

  // Which period is currently shown
  const [shownPeriod, setShownPeriod, shownPeriodRef] = useState(0);
  useEffect(() => {
    shownPeriodRef.current = 0;
    for (let [_, period] of shownAccountRef.current.periods) {
      if (period.isFinished) { shownPeriodRef.current += 1; }
    }
    if (shownPeriodRef.current == shownAccountRef.current.periods.size) { shownPeriodRef.current -= 1; }
    setShownPeriod(shownPeriodRef.current);
    Logger.core(`Set shown period to ${shownPeriodRef.current}`);
  }, [gotMarks]);

  // Window dimensions
  const windowDimensions = useWindowDimensions();

  // Informations popup
  const [infoPopupOpen, setInfoPopupOpen] = useState(false);
  function renderInfosPopup() {
    if (!infoPopupOpen) { return null; }
    return <BottomSheet
      isOpen={infoPopupOpen}
      onClose={() => setInfoPopupOpen(false)}
      snapPoints={[
        Math.min(325 / Dimensions.get('screen').height * windowDimensions.fontScale, 1) * 100 + "%",
      ]}
      theme={theme}
      children={<InformationsPopup theme={theme}/>}
    />;
  }

  // Period keys
  const [_periodKeys, setPeriodKeys, periodKeysRef] = useState(["A000"]);
  useEffect(() => {
    setPeriodKeys(["A000"]);
    setPeriodKeys([...shownAccountRef.current.periods.keys(), "A000"]);
  }, [gotMarks, shownAccountRef.current.id]);
  
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

      {periodKeysRef.current.map((periodKey, index) => {
        if (index == shownPeriod || shownPeriod == -1) { return <MarksOverview
          key={periodKey}
          period={shownAccountRef.current.periods.get(periodKey) ?? {}}
          accountID={shownAccountRef.current.id}
          loading={autoRefreshing || isConnecting}
          redCheck={!isConnected || !gotMarks || marksNeedUpdate}
          refreshAverages={refreshAverages}
          setInfoPopupOpen={setInfoPopupOpen}
          windowDimensions={windowDimensions}
          theme={theme}
        />;}
      })}
      {renderInfosPopup()}
    </View>
  );
}

export { EmbeddedMarksView };