import { View, Text, ScrollView } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage, formatMark } from '../../utils/Utils';

function SubjectCard({ subject, onPress, theme }) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        width: '100%',
        backgroundColor: getSubjectColor(subject.code, true),
        flexDirection: 'column',
        borderRadius: 10,
      }}
    >
      <View style={{
        flexDirection: 'column',
      }}>
        <View style={{
          width: '100%',
          backgroundColor: getSubjectColor(subject.code),
          paddingHorizontal: 10,
          borderRadius: 10,
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Text style={[theme.fonts.bodyLarge, { color: theme.colors.onSurface, width: '80%' }]} numberOfLines={1} >{subject.name}</Text>
          <Text style={[theme.fonts.headlineMedium, { fontSize: 20 }]}>{formatAverage(subject.average)}</Text>
        </View>
        <View style={{
          backgroundColor: getSubjectColor(subject.code, true),
          flexDirection: 'row',
          padding: subject.marks.length > 0 ? 8 : 0,
          borderRadius: 10,
        }}>
          {subject.marks.map((mark) => <Text key={mark.id} style={[
            theme.fonts.bodyLarge, { color: theme.colors.onSurface, marginRight: 15 }
          ]}>{formatMark(mark)}</Text>)}
        </View>
      </View>
    </PressableScale>
  );
}

export default SubjectCard;

