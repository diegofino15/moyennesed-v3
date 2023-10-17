import { useEffect } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { BrainCircuitIcon, ChevronDownIcon, ChevronRight, ChevronUpIcon, GraduationCapIcon, MinusIcon, PlusIcon, Trash2Icon, WrenchIcon, XIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import useStateRef from 'react-usestateref';
import * as Haptics from "expo-haptics";

import Separator from '../global/separator';
import EmbeddedMarkCard from './embedded_mark_card';
import { getSubjectColor } from '../../utils/Colors';
import { Preferences } from '../../core/Preferences';
import { formatAverage, formatCoefficient } from '../../utils/Utils';
import { _sortMarks } from '../../core/Subject';
import { getSubjectCoefficient } from '../../utils/CoefficientsManager';


function SubjectPopup({ subject, selectedSubSubject, changeMarkCoefficient, changeSubjectCoefficient, clickedOnMark, theme }) {
  const [_shownSubject, setShownSubject, shownSubjectRef] = useStateRef(subject);
  useEffect(() => {
    if (selectedSubSubject) {
      setShownSubject(subject.subSubjects.get(selectedSubSubject));
    }
  }, []);
  
  function teacherCard(teacher, key) {
    return <PressableScale key={key} style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom: 5,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <GraduationCapIcon size={30} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 10 }} />
      <Text style={theme.fonts.labelLarge}>{teacher}</Text>
    </PressableScale>;
  }

  function markCard(mark, special) {
    if (mark.id == clickedOnMark && !special) { return null; }
    return <EmbeddedMarkCard key={mark.id} mark={mark} subject={subject} selectedSubSubject={selectedSubSubject} changeMarkCoefficient={changeMarkCoefficient} clickedOnMark={clickedOnMark} theme={theme} />
  }

  const [showChangeCoefficient, setShownChangeCoefficient] = useStateRef(false);
  // 0 = default | 1 = guess | 2 = custom
  const [subjectCoefficientStatus, setSubjectCoefficientStatus] = useStateRef(0);
  useEffect(() => {
    if (Preferences.customCoefficients.has(`SUBJECT-${shownSubjectRef.current.code}-${shownSubjectRef.current.subCode}`)) { setSubjectCoefficientStatus(2); }
    else if (Preferences.guessSubjectCoefficients && shownSubjectRef.current.coefficient == getSubjectCoefficient(shownSubjectRef.current.name)) { setSubjectCoefficientStatus(1); }
    else { setSubjectCoefficientStatus(0); }
  }, [shownSubjectRef.current.coefficient]);

  return (
    <View>
      <View style={{
        height: 100,
        flexDirection: 'row',
        marginBottom: 10,
      }}>
        <View style={{
          width: 100,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getSubjectColor(shownSubjectRef.current.code),
          borderRadius: 20,
          marginRight: 10,
        }}>
          <Text style={[theme.fonts.headlineLarge, { fontFamily: 'Bitter-Bold', fontSize: 30 }]}>{formatAverage(shownSubjectRef.current.average)}</Text>
        </View>
        <View style={{
          justifyContent: 'space-evenly',
          height: 100,
        }}>
          <Text style={{
            width: Dimensions.get('window').width - 150,
            alignItems: 'center',
          }} numberOfLines={2}>
            {selectedSubSubject ? <Text style={theme.fonts.labelLarge}>{subject.name}</Text> : null}
            {selectedSubSubject ? <View style={{ width: 25, alignItems: 'center' }}><ChevronRight size={15} color={theme.colors.onSurfaceDisabled}/></View> : null}
            <Text style={theme.fonts.bodyLarge}>{shownSubjectRef.current.name}</Text>
          </Text>
          
          {subject.classAverage ? <View style={{ flexDirection: 'row' }}>
            <Text style={theme.fonts.labelMedium}>Classe : </Text>
            <Text style={[theme.fonts.labelMedium, { fontFamily: 'Bitter-Regular' }]}>{formatAverage(shownSubjectRef.current.classAverage)}</Text>
          </View> : null}
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <PressableScale onPress={() => setShownChangeCoefficient(!showChangeCoefficient)} style={{
              paddingHorizontal: 7.5,
              paddingVertical: 3,
              backgroundColor: theme.colors.background,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: theme.colors.surface,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 50,
              height: 30,
            }}>
              <XIcon size={15} color={theme.colors.onSurface}/>
              <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{formatCoefficient(shownSubjectRef.current.coefficient)}</Text>
              {showChangeCoefficient ? <ChevronUpIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/> : <ChevronDownIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>}

              <View style={{
                position: 'absolute',
                bottom: -7.5,
                right: -7.5,
              }}>
                {subjectCoefficientStatus == 2
                  ? <WrenchIcon size={20} color={theme.colors.onSurfaceDisabled}/>
                  : subjectCoefficientStatus == 1
                    ? <BrainCircuitIcon size={20} color={theme.colors.onSurfaceDisabled} style={{ transform: [{ rotate: '90deg' }] }} />
                    : null}
              </View>
            </PressableScale>

            {showChangeCoefficient && <View style={{ flexDirection: 'row' }}>
              <PressableScale
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: theme.colors.surface,
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 5,
                }}
                onPress={async () => {
                  var newCoefficient = shownSubjectRef.current.coefficient - 1;
                  if (shownSubjectRef.current.coefficient == 1) { newCoefficient = 0.75; }
                  else if (shownSubjectRef.current.coefficient == 0.75) { newCoefficient = 0.5; }
                  else if (shownSubjectRef.current.coefficient == 0.5) { newCoefficient = 0.25; }
                  else if (shownSubjectRef.current.coefficient == 0.25 || shownSubjectRef.current.coefficient == 0) { newCoefficient = 0; }
                  changeSubjectCoefficient(shownSubjectRef.current, newCoefficient);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <MinusIcon size={20} color={theme.colors.onSurfaceDisabled}/>
              </PressableScale>
              <PressableScale
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: theme.colors.surface,
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={async () => {
                  var newCoefficient = shownSubjectRef.current.coefficient + 1;
                  if (shownSubjectRef.current.coefficient == 0) { newCoefficient = 0.25; }
                  else if (shownSubjectRef.current.coefficient == 0.25) { newCoefficient = 0.5; }
                  else if (shownSubjectRef.current.coefficient == 0.5) { newCoefficient = 0.75; }
                  else if (shownSubjectRef.current.coefficient == 0.75) { newCoefficient = 1; }
                  newCoefficient = Math.min(newCoefficient, 50);
                  changeSubjectCoefficient(shownSubjectRef.current, newCoefficient);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <PlusIcon size={20} color={theme.colors.onSurfaceDisabled}/>
              </PressableScale>
              <PressableScale
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#DA3633',
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  changeSubjectCoefficient(shownSubjectRef.current, Preferences.guessSubjectCoefficients ? getSubjectCoefficient(shownSubjectRef.current.name) : Preferences.defaultEDCoefficients.get(`SUBJECT-${shownSubjectRef.current.code}-${shownSubjectRef.current.subCode}`));
                }}
              >
                <Trash2Icon size={20} color={theme.colors.onSurfaceDisabled}/>
              </PressableScale>
            </View>}
          </View>
        </View>
      </View>
      {[...(shownSubjectRef.current.teachers.values() ?? [])].map((teacher, key) => teacherCard(teacher, key))}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Separator theme={theme} style={{ width: "28%" }}/>
        <View style={{ width: '44%', alignItems: 'center'}}><Text style={theme.fonts.labelLarge}>Dernières notes</Text></View>
        <Separator theme={theme} style={{ width: "28%" }}/>
      </View>
      <ScrollView style={{
        height: Dimensions.get('screen').height * 0.75 - 150 - ((shownSubjectRef.current.teachers.length ?? 0) * 50),
      }} showsVerticalScrollIndicator={false} >
        {clickedOnMark ? markCard(shownSubjectRef.current.marks.find((mark) => mark.id == clickedOnMark), true) : null}
        {shownSubjectRef.current.marks.map((mark) => markCard(mark))}
        {shownSubjectRef.current.marks.length == 0 ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center', marginTop: 75 }]}>Aucune note pour l'instant</Text> : null}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

export default SubjectPopup;

