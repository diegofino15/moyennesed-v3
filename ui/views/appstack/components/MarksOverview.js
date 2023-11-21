import { useEffect } from "react";
import { View, ScrollView, Text, ActivityIndicator, Dimensions } from "react-native";
import { CheckCircle2Icon, DraftingCompassIcon, HelpCircleIcon, TrendingUpIcon, Users2Icon, WifiOffIcon, RefreshCcwIcon } from "lucide-react-native";
import { PressableScale } from "react-native-pressable-scale";
import { LineChart } from "react-native-chart-kit";
import * as Haptics from 'expo-haptics';
import useState from "react-usestateref";

import { RecentMarkCard } from "./RecentMarkCard";
import { SubjectCard } from "./SubjectCard";
import { AnimatedComponent } from "../../global_components/AnimatedComponents";
import { formatAverage } from "../../../../utils/Utils";
import { CoefficientManager } from "../../../../core/CoefficientsManager";


function MarksOverview({
  period,
  accountID,
  loading,
  redCheck,
  refreshAverages,
  setInfoPopupOpen,
  refresh,
  manualRefreshingRef,
  windowDimensions,
  theme
}) {
  // Work with subject groups
  const [_drawnSubjects, _setDrawnSubjects, drawnSubjectsRef] = useState(new Array());
  const [_subjectIndex, setSubjectIndex, subjectIndexRef] = useState(0);

  // Force update animation
  const [_forceUpdate, setForceUpdate, forceUpdateRef] = useState(false);
  useEffect(() => {
    setSubjectIndex(0);
    setForceUpdate(!forceUpdateRef.current);
  }, [accountID]);

  const [isGraphSelected, setIsGraphSelected] = useState(false);
  const numberOfMarks = 15;
  const [_shownGraphValues, setShownGraphValues, shownGraphValuesRef] = useState([]);
  useEffect(() => {
    const shownValues = [...(period.averageHistory?.values() ?? [])];
    setShownGraphValues(shownValues.splice(Math.max(0, shownValues.length - numberOfMarks), numberOfMarks));
  }, [isGraphSelected, manualRefreshingRef.current, loading, accountID]);

  return (
    <View>
      <AnimatedComponent index={0} forceUpdate={forceUpdateRef.current} children={<View style={{
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        marginBottom: 20,
        padding: 20,
        paddingBottom: 0,
        overflow: 'hidden',
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
            {period.average ? <View style={{ flexDirection: 'row' }}>
              <PressableScale onPress={() => {
                setIsGraphSelected(!isGraphSelected);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }} style={{
                backgroundColor: theme.colors.background,
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                {!isGraphSelected ? <View style={{ flexDirection: 'row' }}>
                  <TrendingUpIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 10 }}/>
                  <Text style={theme.fonts.labelMedium}>Évolution</Text>
                </View> : <View style={{ flexDirection: 'row' }}>
                  <DraftingCompassIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 10 }}/>
                  <Text style={theme.fonts.labelMedium}>Moyenne</Text>
                </View>}
              </PressableScale>
              {isGraphSelected && !CoefficientManager.isAverageHistoryUpdated && !manualRefreshingRef.current && <PressableScale onPress={refresh} style={{
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.surface,
                borderWidth: 1,
                borderRadius: 5,
                padding: 2,
                paddingHorizontal: 3,
                marginLeft: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <RefreshCcwIcon size={20} color={theme.colors.onPrimary}/>
              </PressableScale>}
            </View> : <View/>}
            {loading
              ? <ActivityIndicator size={25 * windowDimensions.fontScale} color={theme.colors.onSurface}/>
              : redCheck
                ? <WifiOffIcon size={25 * windowDimensions.fontScale} color={theme.colors.tertiary}/>
                : <CheckCircle2Icon size={25 * windowDimensions.fontScale} color={theme.colors.secondary}/>}
          </View>

          {!isGraphSelected ? <View style={{
            alignItems: 'center',
            minHeight: 100,
            justifyContent: 'center',
          }}>
            <Text style={theme.fonts.headlineLarge}>{formatAverage(period.average)}</Text>
            <Text style={[theme.fonts.labelMedium, { marginBottom: 5, marginRight: 5 }]}>MOYENNE GÉNÉRALE</Text>
            
            {period.classAverage ? <View style={{ flexDirection: 'row' }}>
              <Users2Icon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 5 }}/>
              <Text style={[theme.fonts.labelSmall, { bottom: 1 }]}>: </Text>
              <Text style={[theme.fonts.labelSmall, { fontFamily: 'Bitter-Regular' }]}>{formatAverage(period.classAverage)}</Text>
            </View> : null}
          </View> : <View style={{
            height: 100,
          }}>
            <LineChart
              data={{
                datasets: [
                  { data: shownGraphValuesRef.current },
                  { data: [Math.max(Math.min(...shownGraphValuesRef.current) - 1, 0)], withDots: false },
                  { data: [Math.min(Math.max(...shownGraphValuesRef.current) + 1, 20)], withDots: false },
                ]
              }}
              width={Dimensions.get("window").width - 50}
              height={100}
              renderDotContent={(params) => {
                if (params.index == (shownGraphValuesRef.current.length - 1)) {
                  return <View key={params.index} style={{
                    position: 'absolute',
                    top: params.y - 20,
                    left: params.x - 15,
                  }}>
                    <Text style={theme.fonts.headlineSmall}>{formatAverage(params.indexData)}</Text>
                  </View>;
                }
              }}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.onSurfaceDisabled,
                propsForDots: {
                  r: "2",
                  strokeWidth: "2",
                  stroke: "black",
                },
              }}
              bezier
              style={{
                left: -15,
              }}
            />
          </View>}

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
            marginBottom: 10,
          }}>
            <Text style={theme.fonts.bodyLarge}>Dernières notes</Text>
            <PressableScale onPress={() => setInfoPopupOpen(true)}><HelpCircleIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/></PressableScale>
          </View>
          <View style={{
            height: 92,
            marginBottom: 8,
            width: Dimensions.get('window').width - 80,
            justifyContent: 'center',
          }}>
            {period.marks?.size == 0 ? <Text style={[
              theme.fonts.labelLarge, { alignSelf: 'center' }
            ]}>Aucune note pour l'instant</Text> : <ScrollView
              key={accountID + "-" + period.code}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {[...(period.marks?.values() ?? [])].reverse().map((mark, markKey) => {
                if (!mark) { return null; }
                if (markKey < 10) {
                  const subject = period.subjects.get(mark.subjectCode);
                  return <View
                    key={markKey}
                    style={{
                      paddingRight: (markKey == 9 || markKey == period.marks.length - 1) ? 0 : 20,
                  }}>
                    <RecentMarkCard
                      mark={mark} 
                      subject={subject}
                      refreshAverages={refreshAverages}
                      getMark={(markID) => {
                        return period.marks.get(markID);
                      }}
                      windowDimensions={windowDimensions}
                      theme={theme}
                    />
                  </View>;
                }
              })}
            </ScrollView>}
          </View>
        </View>
      </View>}/>

      {/* Loop trough all subjects groups and show affiliated subjects */}
      {[...(period.subjectGroups?.values() ?? [])].map((subjectGroup, index) => {
        subjectIndexRef.current += 1;
        return <View key={index} style={{
          marginBottom: 20,
        }}>
          <AnimatedComponent index={subjectIndexRef.current} forceUpdate={forceUpdateRef.current} children={<View style={{
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
          </View>}/>
          <View style={{
            position: 'absolute',
            height: "100%",
            left: -10,
          }}>
            <AnimatedComponent index={subjectIndexRef.current} forceUpdate={forceUpdateRef.current} children={<View style={{ backgroundColor: theme.colors.surface, width: 4, borderRadius: 1, height: "100%" }}/>}/>
          </View>

          {subjectGroup.subjectCodes.map((subjectCode, subjectCodeKey) => {
            if (!drawnSubjectsRef.current.includes(subjectCode)) { drawnSubjectsRef.current.push(subjectCode); }
            const subject = period.subjects.get(subjectCode);
            subjectIndexRef.current += 1;
            return <View key={subjectCodeKey} style={{
              marginTop: 5,
              marginBottom: 5,
            }}>
              <SubjectCard
                mainSubject={subject}
                refreshAverages={refreshAverages}
                getMark={(markID) => {
                  return period.marks.get(markID);
                }}
                windowDimensions={windowDimensions}
                index={subjectIndexRef.current}
                forceUpdate={forceUpdateRef.current}
                theme={theme}
              />
            </View>;
          })}
        </View>
      })}
      
      {/* Show remaining subjects */}
      <View>
        {drawnSubjectsRef.current.length != 0 ? <AnimatedComponent index={subjectIndexRef.current + 1} forceUpdate={forceUpdateRef.current} children={<Text style={theme.fonts.labelLarge}>AUTRES MATIERES</Text>}/> : null}
        {drawnSubjectsRef.current.length != 0 ? <View style={{
          position: 'absolute',
          height: "100%",
          left: -10,
        }}>
          <AnimatedComponent index={subjectIndexRef.current + 1} forceUpdate={forceUpdateRef.current} children={<View style={{ backgroundColor: theme.colors.surface, width: 4, borderRadius: 1, height: "100%" }}/>}/>
        </View> : null}

        {[...(period.subjects?.values() ?? [])].map((subject, subjectKey) => {
          if (drawnSubjectsRef.current.includes(subject.code)) { return null; }
          subjectIndexRef.current += 1;
          return <View key={subjectKey} style={{
            marginTop: 5,
            marginBottom: 5,
          }}>
            <SubjectCard
              mainSubject={subject}
              refreshAverages={refreshAverages}
              getMark={(markID) => {
                return period.marks.get(markID);
              }}
              windowDimensions={windowDimensions}
              index={subjectIndexRef.current}
              forceUpdate={forceUpdateRef.current}
              theme={theme}
            />
          </View>;
        })}
      </View>
    </View>
  );
}

export { MarksOverview };