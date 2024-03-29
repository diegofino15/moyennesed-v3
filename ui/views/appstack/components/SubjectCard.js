import { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ArrowRightIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';

import { BottomSheet } from '../../global_components/BottomSheet';
import { AnimatedComponent } from '../../global_components/AnimatedComponents';
import { SubjectPopup } from './SubjectPopup';
import { getSubjectColor } from '../../../../utils/Colors';
import { formatAverage, formatMark } from '../../../../utils/Utils';


function SubjectCard({ mainSubject, refreshAverages, setSubjectCoefficient, getMark, windowDimensions, index, forceUpdate, theme }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [subSubjectOpened, setSubSubjectOpened] = useState("");

  function renderPopup(subject) {
    if (!(isBottomSheetOpen && ((subject.code + subject.subCode) == subSubjectOpened))) { return null; }
    return <BottomSheet
      key={subject.id}
      isOpen={isBottomSheetOpen}
      onClose={() => setIsBottomSheetOpen(false)}
      snapPoints={[
        (255 / Dimensions.get('screen').height * 100) + "%",
        "80%",
      ]}
      children={<SubjectPopup subject={mainSubject} selectedSubSubject={subject.subCode} refreshAverages={refreshAverages} setSubjectCoefficient={setSubjectCoefficient} getMark={getMark} windowDimensions={windowDimensions} theme={theme}/>}
      padding={0}
      theme={theme}
    />;
  }

  function subjectCard(subject) {
    const _subjectColor = getSubjectColor(subject.code);
    const _lightSubjectColor = getSubjectColor(subject.code, true);
    
    return (
      <View>
        <PressableScale
          onPress={() => {
            setSubSubjectOpened(subject.code + subject.subCode);
            setIsBottomSheetOpen(true);
          }}
          style={{
            width: Dimensions.get('window').width - (subject.isSubSubject ? 80 : 40),
            backgroundColor: _lightSubjectColor,
            borderRadius: 10,
          }}
        >
          <View style={{
            backgroundColor: _subjectColor,
            height: 40,
            paddingHorizontal: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - (140 + (subject.isSubSubject ? 40 : 0)) * windowDimensions.fontScale, color: theme.colors.onSecondary }]} numberOfLines={1}>{subject.name}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
              <Text style={[theme.fonts.headlineMedium, { fontSize: 20, fontFamily: 'Bitter-Bold', color: theme.colors.onSecondary }]}>{formatAverage(subject.average)}</Text>
              {subject.average ? <Text style={[theme.fonts.labelSmall, { color: 'black', fontFamily: 'Bitter-Bold' }]}>/20</Text> : null}
            </View>
          </View>
          <View style={{
            width: Dimensions.get('window').width - (subject.isSubSubject ? 80 : 40),
            flexDirection: 'row',
            paddingVertical: (subject.marks.length == 0 || subject.subSubjects.size != 0) ? 0 : 8,
            paddingHorizontal: 10,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            {(subject.subSubjects.size == 0) && subject.marks.map((markID) => {
              const mark = getMark(markID);
              if (mark == undefined) { return null; }
              return <Text key={markID} style={[
                theme.fonts.headlineMedium,
                {
                  marginRight: 15,
                  color: mark.isEffective ? theme.colors.onSecondary : theme.colors.onSurfaceDisabled,
                  textDecorationLine: mark.isEffective ? 'none' : 'line-through',
                }
              ]}>{formatMark(mark)}</Text>
            })}
          </View>
        </PressableScale>
        {renderPopup(subject)}
      </View>
    );
  }

  return (
    <AnimatedComponent index={index} forceUpdate={forceUpdate} children={<View>
      {subjectCard(mainSubject)}
      {[...(mainSubject.subSubjects?.values() ?? [])].map((subSubject, key) => <View key={key} style={{
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
      }}>
        <ArrowRightIcon size={30} color={theme.colors.onSurface} style={{ marginRight: 10 }}/>
        {subjectCard(subSubject)}
      </View>)}
    </View>}/>
  );
}

export default SubjectCard;