import { View, Text } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { getSubjectColor } from '../../utils/Colors';
import { useState } from 'react';
import BottomSheet from './bottom_sheet';
import SubjectPopup from './subject_popup';
import { ChevronRight } from 'lucide-react-native';

function MarkCard({ mark, subject, changeMarkCoefficient, changeSubjectCoefficient, theme }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  function renderPopup() {
    if (!isBottomSheetOpen) { return; }
    return <BottomSheet
      key={mark.id}
      isOpen={isBottomSheetOpen}
      onClose={() => setIsBottomSheetOpen(false)}
      snapPoints={["40%", "75%"]}
      selectedSnapPoint={0}
      children={<SubjectPopup subject={subject} selectedSubSubject={mark.subSubjectCode ? mark.subSubjectCode : null} changeMarkCoefficient={changeMarkCoefficient} changeSubjectCoefficient={changeSubjectCoefficient} clickedOnMark={mark.id} theme={theme} />}
    />;
  }

  return (
    <View>
      <PressableScale
        onPress={() => setIsBottomSheetOpen(true)}
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
            backgroundColor: getSubjectColor(subject.code, true),
            borderRadius: 10,
          }}>
            <Text style={[theme.fonts.headlineMedium, { fontFamily: 'Bitter-Bold' }]}>{mark.valueStr}</Text>
          </View>

          {mark.valueOn != 20 ? <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: getSubjectColor(subject.code),
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
            }}
          >
            <Text style={theme.fonts.headlineSmall}>/{mark.valueOn}</Text>
          </View> : null}
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
          <View style={{
            width: 160,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={theme.fonts.labelSmall}>{subject.name}</Text>
            {mark.subSubjectCode ? <View style={{ width: 25, alignItems: 'center' }}><ChevronRight size={15} color={theme.colors.onSurfaceDisabled}/></View> : null}
            {mark.subSubjectCode ? <Text style={theme.fonts.labelSmall} numberOfLines={1}>{subject.subSubjects.get(mark.subSubjectCode).name}</Text> : null}
          </View>
        </View>
        {!mark.isEffective ? <View
          style={{
            position: 'absolute',
            bottom: -7.5,
            right: 10,
            backgroundColor: '#DA3633',
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 5,
          }}
        >
          <Text style={[theme.fonts.labelSmall, { color: 'white' }]}>Non significative</Text>
        </View> : null}
      </PressableScale>

      {renderPopup()}
    </View>
  );
}

export default MarkCard;

