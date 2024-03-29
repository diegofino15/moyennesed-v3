import { useEffect } from "react";
import { Dimensions, View, useWindowDimensions } from "react-native";
import useState from "react-usestateref";

import PeriodSwitcher from "./PeriodSwitcher";
import MarksOverview from "./MarksOverview";
import { BottomSheet } from "../../global_components/BottomSheet";
import { InformationsPopup } from "./InformationsPopup";
import { UserData } from "../../../../core/UserData";
import { calculateAllPeriodAverages } from "../../../../core/Period";
import { CoefficientManager } from "../../../../core/CoefficientsManager";
import { Preferences } from "../../../../core/Preferences";
import { Logger } from "../../../../utils/Logger";


function EmbeddedMarksView({
  shownAccountRef, isConnected, isConnecting,
  gotMarks, marksNeedUpdate,
  autoRefreshing, refresh, manualRefreshingRef,
  adStuff,
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
  function setSubjectCoefficient(subject, coefficient) {
    var newCoefficient = coefficient;
    var newCoefficientType = 2;
    if (coefficient == -1) {
      if (Preferences.allowGuessSubjectCoefficients) {
        newCoefficient = CoefficientManager.getGuessedSubjectCoefficient(subject.id, subject.code, subject.subCode, subject.name);
        newCoefficientType = 1;
      } else {
        newCoefficient = CoefficientManager.getDefaultEDSubjectCoefficient(subject.id);
        newCoefficientType = 0;
      }
    }

    for (let [_, period] of shownAccountRef.current.periods) {
      period.subjects.forEach(periodSubject => {
        if (periodSubject.code == subject.code) {
          if (!subject.subCode) {
            periodSubject.coefficient = newCoefficient;
            periodSubject.coefficientType = newCoefficientType;
          } else {
            periodSubject.subSubjects.forEach(periodSubSubject => {
              if (periodSubSubject.subCode == subject.subCode) {
                periodSubSubject.coefficient = newCoefficient;
                periodSubSubject.coefficientType = newCoefficientType;
              }
            });
          }
        }
      });
    }

    refreshAverages();
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
      children={<InformationsPopup windowDimensions={windowDimensions} theme={theme}/>}
      theme={theme}
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
          setSubjectCoefficient={setSubjectCoefficient}
          setInfoPopupOpen={setInfoPopupOpen}
          refresh={refresh}
          manualRefreshingRef={manualRefreshingRef}
          windowDimensions={windowDimensions}
          adStuff={adStuff}
          theme={theme}
        />;}
      })}
      {renderInfosPopup()}
    </View>
  );
}

export { EmbeddedMarksView };