import useStateRef from "react-usestateref";
import { View, ScrollView, Text, ActivityIndicator, Dimensions } from "react-native";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react-native";

import { RecentMarkCard } from "./RecentMarkCard";
import { SubjectCard } from "./SubjectCard";
import { formatAverage } from "../../utils/Utils";


function MarksOverview({
  period,
  accoundID,
  loading,
  redCheck,
  refreshAverages,
  theme
}) {
  // Work with subject groups
  const [_drawnSubjects, _setDrawnSubjects, drawnSubjectsRef] = useStateRef(new Array());

  return (
    <View>
      <View style={{
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
            <Text style={[theme.fonts.labelMedium, { alignSelf: 'flex-start', height: 30 }]}>{period.title}</Text>
            {loading
              ? <ActivityIndicator size={30} color={theme.colors.onSurface} />
              : redCheck
                ? <AlertTriangleIcon size={30} color='red' />
                : <CheckCircle2Icon size={25} color='green' />}
          </View>
          
          <Text style={theme.fonts.headlineLarge}>{formatAverage(period.average)}</Text>
          <Text style={[theme.fonts.labelMedium, { marginBottom: 5 }]}>MOYENNE GÉNÉRALE</Text>
          {period.classAverage ? <View style={{ flexDirection: 'row' }}>
            <Text style={theme.fonts.labelSmall}>Classe : </Text>
            <Text style={[theme.fonts.headlineSmall, { color: theme.colors.onSurfaceDisabled, fontSize: 13 }]}>{formatAverage(period.classAverage)}</Text>
          </View> : null}
          
          <Text style={[theme.fonts.bodyLarge, { alignSelf: 'flex-start', marginTop: 30, marginBottom: 10 }]}>Dernières notes</Text>
          <View style={{
            height: 92,
            marginBottom: 8,
            width: Dimensions.get('window').width - 80,
            justifyContent: 'center',
          }}>
            {period.marks?.length == 0 ? <Text style={[
              theme.fonts.labelLarge, { alignSelf: 'center' }
            ]}>Aucune note pour l'instant</Text> : <ScrollView
              key={accoundID + "-" + period.code}
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
      {[...(period.subjectGroups?.values() ?? [])].map((subjectGroup, subjectGroupKey) => <View key={subjectGroupKey} style={{
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
        
        {[...(period.subjects?.values() ?? [])].map((subject, subjectKey) => {
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

export { MarksOverview };