import { View, Text, Dimensions, ScrollView } from 'react-native';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage } from '../../utils/Utils';
import { ChevronDownIcon, ChevronRight, ChevronUpIcon, GraduationCapIcon, MinusIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react-native';
import Separator from '../global/separator';
import { PressableScale } from 'react-native-pressable-scale';
import { useEffect } from 'react';
import { _sortMarks } from '../../core/Subject';
import useStateRef from 'react-usestateref';
import * as Haptics from "expo-haptics";
import { Preferences } from '../../core/Preferences';
import { getSubjectCoefficient } from '../../utils/CoefficientsManager';
import EmbeddedMarkCard from './embedded_mark_card';


function SubjectPopup({ subject, selectedSubSubject, changeMarkCoefficient, changeSubjectCoefficient, clickedOnMark, theme }) {
  const [_shownSubject, setShownSubject, shownSubjectRef] = useStateRef(subject);
  useEffect(() => {
    if (selectedSubSubject) {
      setShownSubject(subject.subSubjects.get(selectedSubSubject));
    }
  }, [subject]);
  
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

  const [_shownMarks, _setShownMarks, shownMarksRef] = useStateRef(new Array());
  const [loaded, setLoaded] = useStateRef(false);
  useEffect(() => {
    setLoaded(false);
    shownMarksRef.current.length = 0;
    if (selectedSubSubject) {
      shownMarksRef.current.push(...(subject.subSubjects.get(selectedSubSubject).marks.values() ?? []));
    } else {
      shownMarksRef.current.push(...(subject.marks.values() ?? []));
      for (const subSubject of subject.subSubjects.values()) {
        shownMarksRef.current.push(...(subSubject.marks.values() ?? []));
      }
    }
    _sortMarks(shownMarksRef.current);
    setLoaded(true);
  }, []);

  const [showChangeCoefficient, setShownChangeCoefficient] = useStateRef(false);

  return (
    <View>
      <View style={{
        width: '100%',
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
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          height: 100,
        }}>
          <Text style={{
            width: Dimensions.get('window').width - 150,
            alignItems: 'center',
          }} numberOfLines={2}>
            <Text style={selectedSubSubject ? theme.fonts.labelLarge : theme.fonts.bodyLarge}>{subject.name}</Text>
            {selectedSubSubject ? <View style={{ width: 25, alignItems: 'center' }}><ChevronRight size={15} color={theme.colors.onSurfaceDisabled}/></View> : null}
            {selectedSubSubject ? <Text style={theme.fonts.bodyLarge}>{shownSubjectRef.current.name}</Text> : null}
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
              <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{shownSubjectRef.current.coefficient.toString().replace(".", ",")}</Text>
              {showChangeCoefficient ? <ChevronUpIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/> : <ChevronDownIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>}
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
                onPress={() => {
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
                onPress={() => {
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
                onPress={() => {
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
        height: Dimensions.get('window').height - 400 - ((shownSubjectRef.current.teachers.size ?? 0) * 100),
      }} showsVerticalScrollIndicator={false} >
        {clickedOnMark && loaded ? markCard(shownMarksRef.current.find((mark) => mark.id == clickedOnMark), true) : null}
        {shownMarksRef.current.map((mark) => markCard(mark))}
        {shownMarksRef.current.length == 0 ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center', marginTop: 75 }]}>Aucune note pour l'instant</Text> : null}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

export default SubjectPopup;

