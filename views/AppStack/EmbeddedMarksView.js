import { View, Text } from "react-native";
import { useEffect } from "react";
import useState from "react-usestateref";
import { getSubjectColor } from "../../utils/Colors";
import { formatAverage, formatMark } from "../../utils/Utils";
import MoyennesEDSeparator from "../../components/moyennesed_separator";


function EmbeddedMarksView({ shownAccountRef, gotMarks, gettingMarks, marksNeedUpdate, refreshing, theme }) {
  const [_shownPeriod, setShownPeriod, shownPeriodRef] = useState({});
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
    } else {
      setShownPeriod({});
    }
  }, [shownAccountRef.current, gettingMarks]);
  
  return (
    <View>
      <View style={{
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        marginBottom: 20,
        padding: 20,
      }}>
        {/* Currently shown period */}
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Text style={[theme.fonts.labelMedium, { alignSelf: 'flex-start', marginBottom: 30 }]}>{shownPeriodRef.current.title}</Text>
          
          <Text style={theme.fonts.headlineLarge}>{formatAverage(shownPeriodRef.current.average)}</Text>
          <Text style={[theme.fonts.labelSmall, { marginBottom: 30 }]}>MOYENNE GÉNÉRALE</Text>
          
          <Text style={[theme.fonts.bodyLarge, { alignSelf: 'flex-start', marginBottom: 20 }]}>Dernières notes</Text>
          {shownPeriodRef.current.marks?.map((mark, markKey) => <Text key={markKey} style={[theme.fonts.labelMedium, { color: theme.colors.onSurfaceDisabled, marginRight: 20 }]}>{formatMark(mark)}</Text>)}
        </View>
      </View>

      <View style={{
        width: '100%',
        height: 400,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
      }}>
        {/* Loop trough all subjects in selected period, and show their name */}
        {[...(shownPeriodRef.current.subjects?.values() ?? [])].map((subject, subjectKey) => <View
          key={subjectKey}
          style={{
            flexDirection: 'column',
          }}
        >
          <Text style={[theme.fonts.labelMedium, { color: getSubjectColor(subject.code) }]}>
            {`${subject.name} -> ${formatAverage(subject.average)}`}
          </Text>
          <View style={{
            flexDirection: 'row',
          }}>
            {/* {subject.marks.map((mark, markKey) => <Text key={markKey} style={[theme.fonts.labelMedium, { color: theme.colors.onSurfaceDisabled, marginRight: 20 }]}>{formatMark(mark)}</Text>)} */}
          </View>
        </View>)}
      </View>

      <View style={{
        width: '100%',
        height: 800,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        marginBottom: 20,
      }}>
      </View>
    </View>
  );
}

export { EmbeddedMarksView };