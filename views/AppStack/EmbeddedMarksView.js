import { View, Text } from "react-native";
import { useEffect } from "react";
import useState from "react-usestateref";


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
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={[
              theme.fonts.labelMedium,
              {
                color: gettingMarks ? 'orange' : marksNeedUpdate ? 'red' : theme.colors.onSurfaceDisabled,
              }
            ]}>{shownPeriodRef.current.title}</Text>
            <Text style={[
              theme.fonts.labelMedium,
              {
                color: gettingMarks ? 'orange' : marksNeedUpdate ? 'red' : theme.colors.onSurfaceDisabled,
              }
            ]}>{shownPeriodRef.current.average}</Text>

          </View>
        </View>

        <View style={{
          width: '100%',
          height: 400,
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          marginBottom: 20,
        }}>
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