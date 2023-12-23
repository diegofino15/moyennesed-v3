import { View, Text, Dimensions } from 'react-native';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, MinusIcon, PlusIcon, Trash2Icon, XIcon, WrenchIcon, BrainCircuitIcon, Users2Icon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import useState from 'react-usestateref';
import * as Haptics from "expo-haptics";

import { Preferences } from '../../../../core/Preferences';
import { CoefficientManager } from '../../../../core/CoefficientsManager';
import { formatCoefficient, formatDate, formatDate2, formatMark } from '../../../../utils/Utils';
import { getSubjectColor } from '../../../../utils/Colors';
import { HapticsHandler } from '../../../../utils/HapticsHandler';


function EmbeddedMarkCard({ mark, subject, selectedSubSubject, refreshAverages, clickedOnMark, windowDimensions, theme }) {
  const [showChangeCoefficient, setShowChangeCoefficient] = useState(false);

  const [_subjectColor, _setSubjectColor] = useState(getSubjectColor(subject.code));
  const [_lightSubjectColor, _setLightSubjectColor] = useState(getSubjectColor(subject.code, true));
  const [_subSubjectName, _setSubSubjectName] = useState(!selectedSubSubject && mark.subSubjectCode ? subject.subSubjects.get(mark.subSubjectCode).name : null);

  return (
    <PressableScale
      style={{
        height: 80 + (clickedOnMark == mark.id ? 2 : 0),
        flexDirection: 'row',
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        marginBottom: showChangeCoefficient ? 17.5 : 5,
        backgroundColor: theme.colors.surface,
        borderWidth: clickedOnMark == mark.id ? 2 : 0,
        borderColor: _subjectColor,
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
          backgroundColor: _lightSubjectColor,
          borderRadius: 10,
        }}>
          <Text style={[theme.fonts.headlineMedium, { fontFamily: 'Bitter-Bold', color: theme.colors.onSecondary }]}>{mark.valueStr}</Text>
        </View>

        {mark.valueOn != 20 ? <View style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: _subjectColor,
          paddingHorizontal: 5,
          paddingVertical: 3,
          borderRadius: 5,
        }}>
          <Text style={[theme.fonts.headlineSmall, { color: theme.colors.onSecondary }]}>/{mark.valueOn}</Text>
        </View> : null}
      </View>
      <View style={{
        marginLeft: 5,
        marginVertical: 10,
        justifyContent: 'space-evenly',
      }}>
        <Text style={{
          width: Dimensions.get('window').width - 130,
          alignItems: 'center',
        }} numberOfLines={2}>
          {_subSubjectName ? <Text style={theme.fonts.labelLarge}>{_subSubjectName}</Text> : null}
          {_subSubjectName ? <View style={{ width: 25, alignItems: 'center' }}><ChevronRightIcon size={15} color={theme.colors.onSurfaceDisabled}/></View> : null}
          <Text style={theme.fonts.bodyLarge} numberOfLines={2}>{mark.title}</Text>
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: Dimensions.get('window').width - 200,
        }}>
          {mark.classValue ? <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Users2Icon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginRight: 5 }}/>
            <Text style={[theme.fonts.labelMedium, { bottom: 1 }]}>: </Text>
            <Text style={[theme.fonts.labelMedium, { fontFamily: 'Bitter-Regular' }]}>{formatMark(mark, true)}</Text>
          </View> : null}
          <Text style={[theme.fonts.labelMedium, { marginTop: 5 }]} numberOfLines={1}>{mark.classValue ? formatDate2(mark.dateEntered) : formatDate(mark.dateEntered)}</Text>
        </View>
      </View>

      {!mark.isEffective ? <View style={{
        position: 'absolute',
        bottom: -7.5,
        right: 10,
        backgroundColor: theme.colors.tertiary,
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
      }}>
        <Text style={[theme.fonts.labelSmall, { color: theme.colors.onPrimary }]}>Non significative</Text>
      </View> : <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: showChangeCoefficient ? -20 : -7.5,
        right: 10,
        width: 200,
      }}>
        {showChangeCoefficient ? <View style={{ flexDirection: 'row' }}>
          {mark.coefficientType == 2 ? <PressableScale
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
              CoefficientManager.deleteCustomMarkCoefficient(mark.id);
              if (Preferences.allowGuessMarkCoefficients) {
                mark.coefficient = CoefficientManager.getGuessedMarkCoefficient(mark.id, mark.title);
                mark.coefficientType = 1;
              } else {
                mark.coefficient = CoefficientManager.getDefaultEDMarkCoefficient(mark.id);
                mark.coefficientType = 0;
              }
              refreshAverages();
              HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Trash2Icon size={20} color={theme.colors.onSurfaceDisabled}/>
          </PressableScale> : <View style={{ width: 30, marginRight: 10 }}/>}
          
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
              var newCoefficient = mark.coefficient - 0.5;
              if (mark.coefficient == 1) { newCoefficient = 0.75; }
              else if (mark.coefficient == 0.75) { newCoefficient = 0.5; }
              else if (mark.coefficient == 0.5) { newCoefficient = 0.25; }
              else if (mark.coefficient == 0.25 || newCoefficient <= 0) { newCoefficient = 0; }
              CoefficientManager.setCustomMarkCoefficient(mark.id, newCoefficient)
              mark.coefficient = newCoefficient;
              mark.coefficientType = 2;
              refreshAverages();
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
              marginRight: 10,
            }}
            onPress={async () => {
              var newCoefficient = mark.coefficient + 0.5;
              if (mark.coefficient == 0) { newCoefficient = 0.25; }
              else if (mark.coefficient == 0.25) { newCoefficient = 0.5; }
              else if (mark.coefficient == 0.5) { newCoefficient = 0.75; }
              else if (mark.coefficient == 0.75) { newCoefficient = 1; }
              newCoefficient = Math.min(newCoefficient, 50);
              CoefficientManager.setCustomMarkCoefficient(mark.id, newCoefficient)
              mark.coefficient = newCoefficient;
              mark.coefficientType = 2;
              refreshAverages();
              HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <PlusIcon size={20} color={theme.colors.onSurfaceDisabled}/>
          </PressableScale>
        </View> : <View/>}
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
          <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{formatCoefficient(mark.coefficient)}</Text>
          {showChangeCoefficient ? <ChevronUpIcon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/> : <ChevronDownIcon size={15 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>}

          <View style={{
            position: 'absolute',
            bottom: -7.5 * windowDimensions.fontScale,
            right: -7.5 * windowDimensions.fontScale,
          }}>
            {mark.coefficientType == 2
              ? <WrenchIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>
              : mark.coefficientType == 1 && mark.coefficient != 1
                ? <BrainCircuitIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled} style={{ transform: [{ rotate: '90deg' }] }}/>
                : null}
          </View>
        </PressableScale>
      </View>}
    </PressableScale>
  );
}

export { EmbeddedMarkCard };