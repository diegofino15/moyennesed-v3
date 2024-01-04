import { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BrainCircuitIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, GraduationCapIcon, MinusIcon, PlusIcon, Trash2Icon, WrenchIcon, XIcon, Users2Icon, TrendingUpIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import { LineChart } from 'react-native-chart-kit';
import useState from 'react-usestateref';
import * as Haptics from "expo-haptics";

import EmbeddedMarkCard from './EmbeddedMarkCard';
import { Separator } from '../../global_components/Separator';
import { AnimatedComponent } from '../../global_components/AnimatedComponents';
import { UserData } from '../../../../core/UserData';
import { Preferences } from '../../../../core/Preferences';
import { CoefficientManager } from '../../../../core/CoefficientsManager';
import { getSubjectColor } from '../../../../utils/Colors';
import { formatAverage, formatCoefficient } from '../../../../utils/Utils';
import { HapticsHandler } from '../../../../utils/HapticsHandler';


function SubjectPopup({ subject, selectedSubSubject, refreshAverages, setSubjectCoefficient, clickedOnMark, getMark, windowDimensions, theme }) {
  const [_shownSubject, setShownSubject, shownSubjectRef] = useState(subject);
  useEffect(() => {
    if (selectedSubSubject) {
      setShownSubject(subject.subSubjects.get(selectedSubSubject));
    }
  }, []);

  function chooserItem(title, index, icon) {
    return <PressableScale
      key={index}
      onPress={() => {
        if (choosenSection != index) {
          setChoosenSection(index);
          HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      style={{
        width: (Dimensions.get('window').width - 50) / 2,
        borderRadius: 10,
        padding: 10,
        backgroundColor: choosenSection == index ? theme.colors.primary : theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
      {icon}
      <Text style={[theme.fonts.labelMedium, {
        color: choosenSection == index ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled,
      }]}>{title}</Text>
    </PressableScale>;
  }
  
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
    if (!markID) { return null; }
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
      <View style={{ width: '44%', alignItems: 'center' }}><Text style={[theme.fonts.labelLarge, { color: theme.colors.onBackground }]}>{text}</Text></View>
      <Separator theme={theme} style={{ width: "28%" }}/>
    </View>;
  }

  const [choosenSection, setChoosenSection] = useState(0);
  const [showChangeCoefficient, setShowChangeCoefficient] = useState(false);

  // Calculate one time for graph
  var marksIndexes = [];
  var marksValues = [];
  function calculateGraphValues() {
    shownSubjectRef.current.marks?.forEach((markID, index) => {
      const mark = getMark(markID);
      if (mark?.isEffective ?? false) {
        marksIndexes.push(index);
        marksValues.push(mark.value / mark.valueOn * 20);
      }
    });
    marksValues.reverse();
    marksIndexes.reverse();
  }
  calculateGraphValues();
  const [selectedGraphMark, setSelectedGraphMark] = useState(null);

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={{
        height: 100,
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 20,
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
          <Text style={[theme.fonts.headlineLarge, { fontFamily: 'Bitter-Bold', fontSize: 29, color: theme.colors.onSecondary }]}>{formatAverage(shownSubjectRef.current.average, false)}</Text>
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
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users2Icon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 5 }}/>
            <Text style={[theme.fonts.labelMedium, { bottom: 1 }]}>: </Text>
            <Text style={[theme.fonts.labelMedium, { fontFamily: 'Bitter-Regular' }]}>{formatAverage(shownSubjectRef.current.classAverage)}</Text>
          </View>
          
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
                  borderColor: theme.colors.tertiary,
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={async () => {
                  CoefficientManager.deleteCustomSubjectCoefficient(shownSubjectRef.current.id);
                  setSubjectCoefficient(shownSubjectRef.current, -1);
                  HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
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
                  var newCoefficient = shownSubjectRef.current.coefficient - 0.5;
                  if (shownSubjectRef.current.coefficient == 1) { newCoefficient = 0.75; }
                  else if (shownSubjectRef.current.coefficient == 0.75) { newCoefficient = 0.5; }
                  else if (shownSubjectRef.current.coefficient == 0.5) { newCoefficient = 0.25; }
                  else if (shownSubjectRef.current.coefficient == 0.25 || newCoefficient <= 0) { newCoefficient = 0; }
                  CoefficientManager.setCustomSubjectCoefficient(shownSubjectRef.current.id, newCoefficient)
                  setSubjectCoefficient(shownSubjectRef.current, newCoefficient);
                  HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
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
                  var newCoefficient = shownSubjectRef.current.coefficient + 0.5;
                  if (shownSubjectRef.current.coefficient == 0) { newCoefficient = 0.25; }
                  else if (shownSubjectRef.current.coefficient == 0.25) { newCoefficient = 0.5; }
                  else if (shownSubjectRef.current.coefficient == 0.5) { newCoefficient = 0.75; }
                  else if (shownSubjectRef.current.coefficient == 0.75) { newCoefficient = 1; }
                  newCoefficient = Math.min(newCoefficient, 50);
                  CoefficientManager.setCustomSubjectCoefficient(shownSubjectRef.current.id, newCoefficient)
                  setSubjectCoefficient(shownSubjectRef.current, newCoefficient);
                  HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <PlusIcon size={20} color={theme.colors.onSurfaceDisabled}/>
              </PressableScale>
            </View>}
          </View>
        </View>
      </View>
      
      <View style={{
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
      }}>
        {chooserItem("Détails", 0)}
        {chooserItem("Évolution", 1, <TrendingUpIcon size={20} color={choosenSection == 1 ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled} style={{ marginRight: 10 }}/>)}
      </View>
      
      <View style={{
        height: 1,
        marginTop: 10,
        width: Dimensions.get('screen').width,
        backgroundColor: theme.colors.surface,
      }}/>

      {choosenSection == 0 ? <ScrollView style={{
        height: Dimensions.get('screen').height * 0.8 - 180,
        paddingTop: 10,
        paddingHorizontal: 20,
      }} showsVerticalScrollIndicator={false}>
        {shownSubjectRef.current.teachers.length != 0 && section("Professeurs", { marginBottom: 10 })}
        {[...(shownSubjectRef.current.teachers.values() ?? [])].map((teacher, key) => teacherCard(teacher, key))}
        
        {section("Dernières notes", { marginTop: shownSubjectRef.current.teachers.length != 0 ? 5 : 0 })}
        {clickedOnMark ? markCard(shownSubjectRef.current.marks.find((markID) => markID == clickedOnMark), true) : null}
        {shownSubjectRef.current.marks.map((markID) => markCard(markID))}
        {shownSubjectRef.current.marks.length == 0 ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center', marginTop: 75 }]}>Aucune note pour l'instant</Text> : null}
        
        <View style={{ height: 70 }}/>
      </ScrollView> : <View>
        {marksValues.length == 0
          ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center', marginTop: 95 }]}>Aucune donnée à afficher</Text>
          : <ScrollView showsVerticalScrollIndicator={false} style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            height: Dimensions.get('screen').height * 0.8 - 180,
          }}>
              <View style={{
                borderRadius: 20,
                paddingTop: 20,
                backgroundColor: getSubjectColor(shownSubjectRef.current.code, true),
                marginBottom: 10,
                overflow: 'hidden',
              }}>
                <LineChart
                  data={{
                    datasets: [
                      { data: marksValues },
                      { data: [0], withDots: false },
                      { data: [20], withDots: false },
                    ]
                  }}
                  width={Dimensions.get("window").width - 30}
                  height={250}
                  chartConfig={{
                    backgroundGradientFrom: getSubjectColor(shownSubjectRef.current.code, true),
                    backgroundGradientTo: getSubjectColor(shownSubjectRef.current.code, true),
                    decimalPlaces: 0,
                    color: (opacity = 1) => Preferences.isDarkMode ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => theme.colors.onPrimary,
                  }}
                  bezier
                  onDataPointClick={(data) => setSelectedGraphMark(shownSubjectRef.current.marks.at(marksIndexes.at(data.index) ?? 0))}
                  getDotColor={(datapoint, index) => { return shownSubjectRef.current.marks.at(marksIndexes.at(index) ?? 0) == selectedGraphMark ? getSubjectColor(shownSubjectRef.current.code, true) : "white"}}
                  getDotProps={(datapoint, index) => {
                    const mark = getMark(shownSubjectRef.current.marks.at(marksIndexes.at(index)));
                    return {
                      r: Math.min(10, 3 + (mark?.coefficient ?? 1) * 2).toString(),
                      strokeWidth: "2",
                      stroke: getSubjectColor(shownSubjectRef.current.code),
                    };
                  }}
                  style={{
                    borderRadius: 20,
                    left: -20,
                    marginTop: 10,
                  }}
                />
              </View>

              {selectedGraphMark == null
              ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center', marginTop: 10 }]}>Séléctionne{UserData.mainAccount.isParent ? "z" : ""} une note</Text>
              : <AnimatedComponent index={0} forceUpdate={selectedGraphMark} children={[markCard(selectedGraphMark, true)]}/>}
              <View style={{ height: 70 }}/>
          </ScrollView>}
      </View>}
    </View>
  );
}

export { SubjectPopup };