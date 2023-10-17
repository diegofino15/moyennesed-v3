import { View, Text, Dimensions, ScrollView, Modal, Button, TouchableOpacity } from 'react-native';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage, formatDate, formatDate2, formatMark } from '../../utils/Utils';
import { ChevronDownIcon, ChevronRight, ChevronUpIcon, EraserIcon, GraduationCapIcon, MinusIcon, PlusIcon, Trash2Icon, TrashIcon, XIcon } from 'lucide-react-native';
import Separator from '../global/separator';
import { PressableScale } from 'react-native-pressable-scale';
import { useEffect } from 'react';
import { _sortMarks } from '../../core/Subject';
import useStateRef from 'react-usestateref';
import * as Haptics from "expo-haptics";
import { Preferences } from '../../core/Preferences';
import { getMarkCoefficient, getSubjectCoefficient } from '../../utils/CoefficientsManager';


function EmbeddedMarkCard({ mark, subject, selectedSubSubject, changeMarkCoefficient, clickedOnMark, theme }) {
  const [showChangeCoefficient, setShownChangeCoefficient] = useStateRef(false);
  
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
        borderColor: getSubjectColor(subject.code),
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
        <Text style={{
          width: Dimensions.get('window').width - 130,
          alignItems: 'center',
        }} numberOfLines={2}>
          {!selectedSubSubject && mark.subSubjectCode ? <Text style={theme.fonts.labelLarge}>{subject.subSubjects.get(mark.subSubjectCode).name}</Text> : null}
          {!selectedSubSubject && mark.subSubjectCode ? <View style={{ width: 25, alignItems: 'center' }}><ChevronRight size={15} color={theme.colors.onSurfaceDisabled}/></View> : null}
          <Text style={theme.fonts.bodyLarge} numberOfLines={2}>{mark.title}</Text>
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: Dimensions.get('window').width - 200,
        }}>
          {mark.classValue ? <View style={{ flexDirection: 'row' }}>
            <Text style={theme.fonts.labelMedium}>Classe : </Text>
            <Text style={[theme.fonts.labelMedium, { fontFamily: 'Bitter-Regular' }]}>{formatMark(mark, true)}</Text>
          </View> : null}
          <Text style={theme.fonts.labelMedium} numberOfLines={1}>{mark.classValue ? formatDate2(mark.dateEntered) : formatDate(mark.dateEntered)}</Text>
        </View>
      </View>

      {!mark.isEffective ? <View style={{
        position: 'absolute',
        bottom: -7.5,
        right: 10,
        backgroundColor: '#DA3633',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
      }}>
        <Text style={[theme.fonts.labelSmall, { color: 'white' }]}>Non significative</Text>
      </View> : <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: showChangeCoefficient ? -20 : -7.5,
        right: 10,
        width: 200,
      }}>
        {showChangeCoefficient ? <View style={{ flexDirection: 'row' }}>
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
              marginRight: 10,
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              changeMarkCoefficient(mark, Preferences.guessMarksCoefficients ? getMarkCoefficient(mark.title) : Preferences.defaultEDCoefficients.get(`MARK-${mark.id}`));
            }}
          >
            <Trash2Icon size={20} color={theme.colors.onSurfaceDisabled}/>
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
              marginRight: 5,
            }}
            onPress={() => {
              var newCoefficient = mark.coefficient + 1;
              if (mark.coefficient == 0) { newCoefficient = 0.25; }
              else if (mark.coefficient == 0.25) { newCoefficient = 0.5; }
              else if (mark.coefficient == 0.5) { newCoefficient = 0.75; }
              else if (mark.coefficient == 0.75) { newCoefficient = 1; }
              newCoefficient = Math.min(newCoefficient, 50);
              changeMarkCoefficient(mark, newCoefficient);
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
              borderColor: theme.colors.surface,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
            onPress={() => {
              var newCoefficient = mark.coefficient - 1;
              if (mark.coefficient == 1) { newCoefficient = 0.75; }
              else if (mark.coefficient == 0.75) { newCoefficient = 0.5; }
              else if (mark.coefficient == 0.5) { newCoefficient = 0.25; }
              else if (mark.coefficient == 0.25 || mark.coefficient == 0) { newCoefficient = 0; }
              changeMarkCoefficient(mark, newCoefficient);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <MinusIcon size={20} color={theme.colors.onSurfaceDisabled}/>
          </PressableScale>
        </View> : <View />}
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
          <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{mark.coefficient.toString().replace(".", ",")}</Text>
          {showChangeCoefficient ? <ChevronUpIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/> : <ChevronDownIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>}
        </PressableScale>
      </View>}
    </PressableScale>
  );
}

export default EmbeddedMarkCard;

