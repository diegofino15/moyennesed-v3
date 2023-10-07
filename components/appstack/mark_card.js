import { View, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { getSubjectColor } from '../../utils/Colors';
import { formatDate } from '../../utils/Utils';

function MarkCard({ mark, onPress, theme }) {
  return (
    <PressableScale
      onPress={onPress}
      style={{
        width: 250,
        height: 80,
        backgroundColor: theme.colors.background,
        shadowOpacity: 0.6,
        shadowRadius: 2,
        shadowOffset: { width: 0 },
        flexDirection: 'row',
        borderRadius: 10,
        padding: 5,
        margin: 2,
      }}
    >
      <View style={{
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 55,
          height: 55,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getSubjectColor(mark.subjectCode, true),
          borderRadius: 10,
        }}>
          <Text style={[theme.fonts.headlineMedium, { fontFamily: 'Bitter-Bold' }]}>{mark.value.toString().replace(".", ",")}</Text>
        </View>

        {mark.valueOn != 20 && <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: getSubjectColor(mark.subjectCode),
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 5,
          }}
        >
          <Text style={theme.fonts.headlineSmall}>/{mark.valueOn}</Text>
        </View>}
      </View>
      <View style={{
        marginLeft: 5,
        marginVertical: 10,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}>
        <Text
          style={[
            theme.fonts.bodyMedium,
            { maxWidth: 160, marginBottom: 5 }
        ]} numberOfLines={2}>{mark.title}</Text>
        <Text style={theme.fonts.labelSmall}>{formatDate(mark.date)}</Text>
      </View>
      {!mark.isEffective && <View
        style={{
          position: 'absolute',
          bottom: -7.5,
          right: 10,
          backgroundColor: '#DA3633',
          paddingHorizontal: 5,
          paddingVertical: 3,
          borderRadius: 5,
          shadowOpacity: 0.6,
          shadowRadius: 2,
          shadowOffset: { width: 0 },
        }}
      >
        <Text style={[theme.fonts.labelSmall, { color: 'white' }]}>Non effective</Text>
      </View>}
    </PressableScale>
  );
}

export default MarkCard;

