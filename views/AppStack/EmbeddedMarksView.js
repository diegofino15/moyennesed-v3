import { View, Text, ScrollView } from "react-native";
import { useEffect } from "react";
import useState from "react-usestateref";
import { getSubjectColor } from "../../utils/Colors";
import { formatAverage, formatMark } from "../../utils/Utils";
import { PressableScale } from "react-native-pressable-scale";
import MarkCard from "../../components/appstack/mark_card";
import { ActivityIndicator } from 'react-native';
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import SubjectCard from "../../components/appstack/subject_card";


function EmbeddedMarksView({
  shownAccountRef, isConnected, isConnecting,
  gotMarks, gettingMarks,
  marksNeedUpdate,
  autoRefreshing,
  theme,
}) {
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
  }, [shownAccountRef.current, gettingMarks]);

  // Open bottom sheet to display mark data
  const openMarkSheet = (mark) => {
    console.log(`Open mark infos for ${mark.title}`);
  }

  const openSubjectSheet = (subject) => {}

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
            {((autoRefreshing && gotMarks) || isConnecting)
              ? <ActivityIndicator size={30} color={theme.colors.onSurface} />
              : (!isConnected || marksNeedUpdate)
                ? <AlertTriangleIcon size={30} color='red' />
                : <CheckCircle2Icon size={25} color='green' />}
          </View>
          
          <Text style={theme.fonts.headlineLarge}>{formatAverage(shownPeriodRef.current.average)}</Text>
          <Text style={[theme.fonts.labelMedium, { marginBottom: 5 }]}>MOYENNE GÉNÉRALE</Text>
          <Text style={[theme.fonts.labelSmall, { marginBottom: 30 }]}>Classe : {formatAverage(shownPeriodRef.current.classAverage)}</Text>
          
          <Text style={[theme.fonts.bodyLarge, { alignSelf: 'flex-start', marginBottom: 10 }]}>Dernières notes</Text>
          <View style={{
            height: 92,
            marginBottom: 8,
          }}>
            <ScrollView
              key={shownAccountRef.current.id + "-" + shownPeriodRef.current.code}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {shownPeriodRef.current.marks?.map((mark, markKey) => {
                if (markKey < 10) {
                  return <View
                    key={markKey}
                    style={{
                      paddingRight: (markKey == 9 || markKey == shownPeriodRef.current.marks.length - 1) ? 0 : 20,
                  }}>
                    <MarkCard mark={mark} onPress={() => openMarkSheet(mark)} theme={theme} />
                  </View>;
                }
              })}
              {shownPeriodRef.current.marks?.length == 0 && <Text style={[theme.fonts.labelLarge, { alignSelf: 'center' }]}>Aucune note pour l'instant</Text>}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Loop trough all subjects in selected period, and show their name */}
      {[...(shownPeriodRef.current.subjects?.values() ?? [])].map((subject, subjectKey) => <View key={subjectKey} style={{
        paddingBottom: 10,
      }}>
        <SubjectCard
          mainSubject={subject}
          onPress={openSubjectSheet}
          theme={theme}
        />
      </View>)}
    </View>
  );
}

export { EmbeddedMarksView };