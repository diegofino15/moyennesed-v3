import useState from "react-usestateref";
import { View, ScrollView, Text, ActivityIndicator, Dimensions } from "react-native";
import { AlertTriangleIcon, CheckCircle2Icon, HelpCircleIcon, InfoIcon } from "lucide-react-native";

import { RecentMarkCard } from "./RecentMarkCard";
import { SubjectCard } from "./SubjectCard";
import { formatAverage } from "../../../../utils/Utils";
import { PressableScale } from "react-native-pressable-scale";
import { useEffect } from "react";
import { AnimatedComponent } from "../../global_components/AnimatedComponents";


function MarksOverview({
  period,
  accountID,
  loading,
  redCheck,
  refreshAverages,
  setInfoPopupOpen,
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

  return (
    <View>
      <AnimatedComponent index={0} forceUpdate={forceUpdateRef.current} children={<View style={{
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        marginBottom: 20,
        padding: 20,
        paddingBottom: 0,
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
            <Text style={[theme.fonts.labelMedium, { alignSelf: 'flex-start', width: Dimensions.get('window').width - 115, height: 30 }]}>{period.title}</Text>
            {loading
              ? <ActivityIndicator size={30 * windowDimensions.fontScale} color={theme.colors.onSurface}/>
              : redCheck
                ? <AlertTriangleIcon size={30 * windowDimensions.fontScale} color='red'/>
                : <CheckCircle2Icon size={25 * windowDimensions.fontScale} color='green'/>}
          </View>
          
          <Text style={theme.fonts.headlineLarge}>{formatAverage(period.average)}</Text>
          <Text style={[theme.fonts.labelMedium, { marginBottom: 5, marginRight: 5 }]}>MOYENNE GÉNÉRALE</Text>
          
          {period.classAverage ? <View style={{ flexDirection: 'row' }}>
            <Text style={theme.fonts.labelSmall}>Classe : </Text>
            <Text style={[theme.fonts.headlineSmall, { color: theme.colors.onSurfaceDisabled, fontSize: 13 }]}>{formatAverage(period.classAverage)}</Text>
          </View> : null}
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 30,
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
            {period.marks?.length == 0 ? <Text style={[
              theme.fonts.labelLarge, { alignSelf: 'center' }
            ]}>Aucune note pour l'instant</Text> : <ScrollView
              key={accountID + "-" + period.code}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {period.marks?.map((mark, markKey) => {
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
      {[...(period.subjectGroups?.values() ?? [])].map((subjectGroup, index) => <View key={index} style={{
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
          zIndex: -10,
          height: "100%",
          left: -10,
        }}/>

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
              windowDimensions={windowDimensions}
              index={subjectIndexRef.current}
              forceUpdate={forceUpdateRef.current}
              theme={theme}
            />
          </View>;
        })}
      </View>)}
      
      {/* Show remaining subjects */}
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