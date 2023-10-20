import { useEffect } from "react";
import { View, ScrollView, Text, ActivityIndicator, Dimensions } from "react-native";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react-native";
import { PressableScale } from "react-native-pressable-scale";
import useState from "react-usestateref";
import * as Haptics from "expo-haptics";

import { MarkCard } from "../../components/appstack/mark_card";
import { SubjectCard } from "../../components/appstack/subject_card";
import { UserData } from "../../core/UserData";
import { calculateAllAverages } from "../../core/Period";
import { formatAverage } from "../../utils/Utils";
import { CoefficientManager } from "../../utils/CoefficientsManager";


function EmbeddedMarksView({
  shownAccountRef, isConnected, isConnecting,
  gotMarks, gettingMarks,
  marksNeedUpdate,
  autoRefreshing,
  theme,
}) {
  const [_screenUpdated, setScreenUpdated, screenUpdatedRef] = useState(false);
  const [_shownPeriod, setShownPeriod, shownPeriodRef] = useState({});
  const [_periodSelectorItems, _setPeriodSelectorItems, periodSelectorItemsRef] = useState([]);
  useEffect(() => {
    if (gotMarks) {
      var preferredSelectedPeriod = "";
      if (shownPeriodRef.current.code) { preferredSelectedPeriod = shownPeriodRef.current.code; }

      shownPeriodRef.current = {};
      shownAccountRef.current.periods.forEach((period, _key) => {
        if (!period.isFinished && !shownPeriodRef.current.code) { setShownPeriod(period); }
        if (period.code == preferredSelectedPeriod) {
          setShownPeriod(period);
        }
      });
      if (!shownPeriodRef.current.code) { setShownPeriod(shownAccountRef.periods.get(shownAccountRef.current.periods.keys().next().value)); }
    
      periodSelectorItemsRef.current.length = 0;
      shownAccountRef.current.periods?.forEach((period, key) => {
        periodSelectorItemsRef.current.push({ label: period.title, value: key });
      });
    }
  }, [shownAccountRef.current, gettingMarks, screenUpdatedRef.current]);

  // Update screen
  function updateScreen() { setScreenUpdated(!screenUpdatedRef.current); }

  // Recalculate averages on coefficient changes
  function refreshAverages() {
    CoefficientManager.save();
    for (let [_, period] of shownAccountRef.current.periods) {
      calculateAllAverages(period);
    }
    UserData.saveCache();
    updateScreen();
  }

  // Work with subject groups
  const [_drawnSubjects, _setDrawnSubjects, drawnSubjectsRef] = useState(new Array());

  return (
    <View>
      {/* Period chooser */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
      }}>
        {periodSelectorItemsRef.current.map((period, periodKey) => <PressableScale
          onPress={() => {
            setShownPeriod(shownAccountRef.current.periods.get(period.value));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          key={periodKey}
          style={{
            width: 95 / periodSelectorItemsRef.current.length + '%',
            borderRadius: 10,
            padding: 10,
            backgroundColor: shownPeriodRef.current.code == period.value ? theme.colors.primary : theme.colors.surface,
            marginBottom: 20,
        }}>
          <Text style={[theme.fonts.labelMedium, {
            color: shownPeriodRef.current.code == period.value ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled,
          }]}>{period.label}</Text>
        </PressableScale>)}
      </View>

      <View style={{
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        marginBottom: 20,
        padding: 20,
        paddingBottom: 0,
        shadowOpacity: 0.6,
        shadowRadius: 2,
        shadowOffset: { width: 0 },
      }}>
        {/* Currently shown period */}
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 20,
          }}>
            <Text style={[theme.fonts.labelMedium, { alignSelf: 'flex-start', height: 30 }]}>{shownPeriodRef.current.title}</Text>
            {(autoRefreshing || isConnecting)
              ? <ActivityIndicator size={30} color={theme.colors.onSurface} />
              : (!isConnected || marksNeedUpdate || !gotMarks)
                ? <AlertTriangleIcon size={30} color='red' />
                : <CheckCircle2Icon size={25} color='green' />}
          </View>
          
          <Text style={theme.fonts.headlineLarge}>{formatAverage(shownPeriodRef.current.average)}</Text>
          <Text style={[theme.fonts.labelMedium, { marginBottom: 5 }]}>MOYENNE GÉNÉRALE</Text>
          {shownPeriodRef.current.classAverage ? <View style={{ flexDirection: 'row' }}>
            <Text style={theme.fonts.labelSmall}>Classe : </Text>
            <Text style={[theme.fonts.headlineSmall, { color: theme.colors.onSurfaceDisabled, fontSize: 13 }]}>{formatAverage(shownPeriodRef.current.classAverage)}</Text>
          </View> : null}
          
          <Text style={[theme.fonts.bodyLarge, { alignSelf: 'flex-start', marginTop: 30, marginBottom: 10 }]}>Dernières notes</Text>
          <View style={{
            height: 92,
            marginBottom: 8,
            width: Dimensions.get('window').width - 80,
            justifyContent: 'center',
          }}>
            {shownPeriodRef.current.marks?.length == 0 ? <Text style={[
              theme.fonts.labelLarge, { alignSelf: 'center' }
            ]}>Aucune note pour l'instant</Text> : <ScrollView
              key={shownAccountRef.current.id + "-" + shownPeriodRef.current.code}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {shownPeriodRef.current.marks?.map((mark, markKey) => {
                if (markKey < 10) {
                  const subject = shownPeriodRef.current.subjects.get(mark.subjectCode);
                  return <View
                    key={markKey}
                    style={{
                      paddingRight: (markKey == 9 || markKey == shownPeriodRef.current.marks.length - 1) ? 0 : 20,
                  }}>
                    <MarkCard
                      mark={mark} 
                      subject={subject}
                      refreshAverages={refreshAverages}
                      theme={theme}
                    />
                  </View>;
                }
              })}
            </ScrollView>}
          </View>
        </View>
      </View>

      {/* Loop trough all subjects groups and show affiliated subjects */}
      {[...(shownPeriodRef.current.subjectGroups?.values() ?? [])].map((subjectGroup, subjectGroupKey) => <View key={subjectGroupKey} style={{
        marginBottom: 20,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight: 9.5, // Accurate ?
        }}>
          <Text style={[theme.fonts.labelLarge, {
            width: '75%',
          }]}>{subjectGroup.name}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: '25%',
          }}>
            <Text style={[theme.fonts.headlineMedium, { fontSize: 20, fontFamily: 'Bitter-Bold', color: theme.colors.onSurfaceDisabled }]}>{formatAverage(subjectGroup.average)}</Text>
            {subjectGroup.average ? <Text style={[theme.fonts.labelSmall, { fontFamily: 'Bitter-Bold' }]}>/20</Text> : null}
          </View>
        </View>
        <View style={{
          padding: 2,
          borderRadius: 1,
          backgroundColor: theme.colors.surface,
          position: 'absolute',
          zIndex: -1,
          height: '100%',
          left: -10,
        }}/>

        {subjectGroup.subjectCodes.map((subjectCode, subjectCodeKey) => {
          if (!drawnSubjectsRef.current.includes(subjectCode)) { drawnSubjectsRef.current.push(subjectCode); }
          const subject = shownPeriodRef.current.subjects.get(subjectCode);
          return <View key={subjectCodeKey} style={{
            marginTop: 5,
            marginBottom: 5,
          }}>
            <SubjectCard
              mainSubject={subject}
              refreshAverages={refreshAverages}
              theme={theme}
            />
          </View>;
        })}
      </View>)}
      
      <View>
        {drawnSubjectsRef.current.length != 0 ? <Text style={theme.fonts.labelLarge}>AUTRES MATIERES</Text> : null}
        {drawnSubjectsRef.current.length != 0 ? <View style={{
          padding: 2,
          backgroundColor: theme.colors.surface,
          position: 'absolute',
          zIndex: -1,
          height: '100%',
          left: -10,
        }}/> : null}
        
        {[...(shownPeriodRef.current.subjects?.values() ?? [])].map((subject, subjectKey) => {
          if (drawnSubjectsRef.current.includes(subject.code)) { return null; }
          return <View key={subjectKey} style={{
            marginTop: 5,
            marginBottom: 5,
          }}>
            <SubjectCard
              mainSubject={subject}
              refreshAverages={refreshAverages}
              theme={theme}
            />
          </View>;
        })}
      </View>
    </View>
  );
}

export { EmbeddedMarksView };