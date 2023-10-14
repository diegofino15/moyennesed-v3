import { View, Text, Dimensions } from 'react-native';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage } from '../../utils/Utils';


function SubjectPopup({ subject, theme }) {
  return (
    <View>
      <View style={{
        width: '100%',
        height: 100
      }}>
        <View style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getSubjectColor(subject.code),
          borderRadius: 20,
        }}>
          <Text style={[theme.fonts.headlineLarge, { fontFamily: 'Bitter-Bold', fontSize: 30 }]}>{formatAverage(subject.average)}</Text>
        </View>
      </View>
    </View>
  );
}

export default SubjectPopup;

