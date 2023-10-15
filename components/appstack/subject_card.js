import { View, Text, Dimensions } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage, formatMark } from '../../utils/Utils';
import { ArrowRightIcon } from 'lucide-react-native';
import BottomSheet from './bottom_sheet';
import { useState } from 'react';
import SubjectPopup from './subject_popup';

function SubjectCard({ mainSubject, changeMarkCoefficient, changeSubjectCoefficient, theme }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [subSubjectOpened, setSubSubjectOpened] = useState("");

  function subjectCard(subject) {
    return (
      <View>
        <PressableScale
          onPress={() => {
            setSubSubjectOpened(subject.code + subject.subCode);
            setIsBottomSheetOpen(true);
          }}
          style={{
            width: Dimensions.get('window').width - 40 - (subject.isSubSubject ? 40 : 0),
            backgroundColor: getSubjectColor(subject.code, true),
            flexDirection: 'column',
            borderRadius: 10,
          }}
        >
          <View style={{
            flexDirection: 'column',
          }}>
            <View style={{
              width: 'auto',
              backgroundColor: getSubjectColor(subject.code),
              paddingHorizontal: 10,
              borderRadius: 10,
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Text style={[theme.fonts.bodyLarge, { color: theme.colors.onSurface, width: 240 - (subject.isSubSubject ? 40 : 0) }]} numberOfLines={1} >{subject.name}</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
                <Text style={[theme.fonts.headlineMedium, { fontSize: 20, fontFamily: 'Bitter-Bold' }]}>{formatAverage(subject.average)}</Text>
                {subject.average && <Text style={[theme.fonts.labelSmall, { color: 'black', fontFamily: 'Bitter-Bold' }]}>/20</Text>}
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              paddingVertical: subject.marks.length > 0 ? 8 : 0,
              paddingHorizontal: 10,
              borderRadius: 10,
              width: Dimensions.get('window').width - 40 - (subject.isSubSubject ? 40 : 0),
              overflow: 'hidden',
            }}>
              {subject.marks.map((mark) => <Text key={mark.id} style={[
                theme.fonts.headlineMedium,
                {
                  marginRight: 15,

                  color: mark.isEffective ? theme.colors.onSurface : theme.colors.onSurfaceDisabled,
                  fontStyle: mark.isEffective ? 'normal' : 'italic',
                  textDecorationColor: theme.colors.onSurfaceDisabled,
                  textDecorationLine: mark.isEffective ? 'none' : 'line-through',
                }
              ]}>{formatMark(mark)}</Text>)}
            </View>
          </View>
        </PressableScale>
        <BottomSheet
          key={subject.code + subject.subCode}
          isOpen={isBottomSheetOpen && (subject.code + subject.subCode) == subSubjectOpened}
          onClose={() => setIsBottomSheetOpen(false)}
          backgroundStyle={{
            // backgroundColor: getSubjectColor(mainSubject.code),
          }}
          snapPoints={["30%", "75%"]}
          children={<SubjectPopup subject={subject} changeMarkCoefficient={changeMarkCoefficient} changeSubjectCoefficient={changeSubjectCoefficient} theme={theme} />}
        />
      </View>
    );
  }

  return (
    <View>
      <View style={{
        flexDirection: 'column'
      }}>
        {subjectCard(mainSubject)}
        {[...(mainSubject.subSubjects?.values() ?? [])].map((subSubject, key) => <View key={key} style={{
          flexDirection: 'row',
          marginTop: 10,
          alignItems: 'center'
        }}>
          <ArrowRightIcon size={30} color={theme.colors.onSurface} style={{ marginRight: 10 }} />
          {subjectCard(subSubject)}
        </View>)}
      </View>
    </View>
  );
}

export default SubjectCard;

