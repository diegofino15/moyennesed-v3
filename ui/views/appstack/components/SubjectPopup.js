import { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BrainCircuitIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, GraduationCapIcon, MinusIcon, PlusIcon, Trash2Icon, WrenchIcon, XIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import useState from 'react-usestateref';
import * as Haptics from "expo-haptics";

import { EmbeddedMarkCard } from './EmbeddedMarkCard';
import { Separator } from '../../global_components/Separator';
import { Preferences } from '../../../../core/Preferences';
import { CoefficientManager } from '../../../../core/CoefficientsManager';
import { formatAverage, formatCoefficient } from '../../../../utils/Utils';
import { getSubjectColor } from '../../../../utils/Colors';


function SubjectPopup({ subject, selectedSubSubject, refreshAverages, clickedOnMark, getMark, windowDimensions, theme }) {
  const [_shownSubject, setShownSubject, shownSubjectRef] = useState(subject);
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
      alignItems: 'center',
    }}>
      <GraduationCapIcon size={30 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 10 }}/>
      <Text style={[theme.fonts.labelLarge, { width: Dimensions.get('window').width - 100 }]} numberOfLines={2}>{teacher}</Text>
    </PressableScale>;
  }

  function markCard(markID, special) {
    const mark = getMark(markID);
    if (mark.id == clickedOnMark && !special) { return null; }
    return <EmbeddedMarkCard key={markID} mark={mark} subject={subject} selectedSubSubject={selectedSubSubject} refreshAverages={refreshAverages} clickedOnMark={clickedOnMark} windowDimensions={windowDimensions} theme={theme}/>
  }

  function section(text, style) {
    return <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      ...style
    }}>
      <Separator theme={theme} style={{ width: "28%" }}/>
      <View style={{ width: '44%', alignItems: 'center' }}><Text style={[theme.fonts.labelLarge, { color: 'black' }]}>{text}</Text></View>
      <Separator theme={theme} style={{ width: "28%" }}/>
    </View>;
  }

  const [showChangeCoefficient, setShowChangeCoefficient] = useState(false);

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
          <Text style={[theme.fonts.headlineLarge, { fontFamily: 'Bitter-Bold', fontSize: 29 }]}>{formatAverage(shownSubjectRef.current.average, false)}</Text>
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
            {selectedSubSubject ? <View style={{ width: 25, alignItems: 'center' }}><ChevronRightIcon size={15} color={theme.colors.onSurfaceDisabled}/></View> : null}
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
            <PressableScale onPress={() => setShowChangeCoefficient(!showChangeCoefficient)} style={{
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
              <XIcon size={15 * windowDimensions.fontScale} color={theme.colors.onSurface}/>
              <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{formatCoefficient(shownSubjectRef.current.coefficient)}</Text>
              {showChangeCoefficient ? <ChevronUpIcon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/> : <ChevronDownIcon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>}

              <View style={{
                position: 'absolute',
                bottom: -7.5 * windowDimensions.fontScale,
                right: -7.5 * windowDimensions.fontScale,
              }}>
                {shownSubjectRef.current.coefficientType == 2
                  ? <WrenchIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>
                  : shownSubjectRef.current.coefficientType == 1 && shownSubjectRef.current.coefficient != 1
                    ? <BrainCircuitIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ transform: [{ rotate: '90deg' }] }}/>
                    : null}
              </View>
            </PressableScale>

            {showChangeCoefficient && <View style={{ flexDirection: 'row' }}>
              {shownSubjectRef.current.coefficientType == 2 && <PressableScale
                style={{
                  backgroundColor: theme.colors.background,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#DA3633',
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={async () => {
                  CoefficientManager.deleteCustomSubjectCoefficient(shownSubjectRef.current.id);
                  if (Preferences.allowGuessSubjectCoefficients) {
                    shownSubjectRef.current.coefficient = CoefficientManager.getGuessedSubjectCoefficient(shownSubjectRef.current.id, shownSubjectRef.current.code, shownSubjectRef.current.subCode, shownSubjectRef.current.name);
                    shownSubjectRef.current.coefficientType = 1;
                  } else {
                    shownSubjectRef.current.coefficient = CoefficientManager.getDefaultEDSubjectCoefficient(shownSubjectRef.current.id);
                    shownSubjectRef.current.coefficientType = 0;
                  }
                  refreshAverages();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Trash2Icon size={20} color={theme.colors.onSurfaceDisabled}/>
              </PressableScale>}

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
                  else if (shownSubjectRef.current.coefficient == 0.25 || newCoefficient <= 0) { newCoefficient = 0; }
                  CoefficientManager.setCustomSubjectCoefficient(shownSubjectRef.current.id, newCoefficient)
                  shownSubjectRef.current.coefficient = newCoefficient;
                  shownSubjectRef.current.coefficientType = 2;
                  refreshAverages();
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
                }}
                onPress={async () => {
                  var newCoefficient = shownSubjectRef.current.coefficient + 1;
                  if (shownSubjectRef.current.coefficient == 0) { newCoefficient = 0.25; }
                  else if (shownSubjectRef.current.coefficient == 0.25) { newCoefficient = 0.5; }
                  else if (shownSubjectRef.current.coefficient == 0.5) { newCoefficient = 0.75; }
                  else if (shownSubjectRef.current.coefficient == 0.75) { newCoefficient = 1; }
                  newCoefficient = Math.min(newCoefficient, 50);
                  CoefficientManager.setCustomSubjectCoefficient(shownSubjectRef.current.id, newCoefficient)
                  shownSubjectRef.current.coefficient = newCoefficient;
                  shownSubjectRef.current.coefficientType = 2;
                  refreshAverages();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <PlusIcon size={20} color={theme.colors.onSurfaceDisabled}/>
              </PressableScale>
            </View>}
          </View>
        </View>
      </View>
      <View style={{
        position: 'absolute',
        top: 120,
        left: -20,
        width: Dimensions.get('screen').width,
        height: 1,
        backgroundColor: theme.colors.surface,
      }}/>
      <ScrollView style={{
        height: Dimensions.get('screen').height * 0.8 - 140,
        paddingTop: 10,
        marginTop: 10,
      }} showsVerticalScrollIndicator={false}>
        {shownSubjectRef.current.teachers.length != 0 && section("Professeurs", { marginBottom: 10 })}
        {[...(shownSubjectRef.current.teachers.values() ?? [])].map((teacher, key) => teacherCard(teacher, key))}
        
        {section("Dernières notes", { marginTop: shownSubjectRef.current.teachers.length != 0 ? 5 : 0 })}
        {clickedOnMark ? markCard(shownSubjectRef.current.marks.find((markID) => markID == clickedOnMark), true) : null}
        {shownSubjectRef.current.marks.map((markID) => markCard(markID))}
        {shownSubjectRef.current.marks.length == 0 ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center', marginTop: 75 }]}>Aucune note pour l'instant</Text> : null}
        
        <View style={{ height: 70 }}/>
      </ScrollView>
    </View>
  );
}

export { SubjectPopup };