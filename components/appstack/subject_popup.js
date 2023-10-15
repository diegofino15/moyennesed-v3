import { View, Text, Dimensions, ScrollView } from 'react-native';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage, formatDate, formatMark } from '../../utils/Utils';
import { ChevronDownIcon, GraduationCapIcon, XIcon } from 'lucide-react-native';
import Separator from '../global/separator';
import { PressableScale } from 'react-native-pressable-scale';
import { Preferences } from '../../core/Preferences';


function SubjectPopup({ subject, refreshAverages, updateScreen, theme }) {
  function teacherCard(teacher, key) {
    return <View key={key} style={{
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
    </View>;
  }

  function markCard(mark, key) {
    return (
      <PressableScale
        key={key}
        style={{
          height: 80,
          flexDirection: 'row',
          borderRadius: 10,
          padding: 5,
          marginTop: 10,
          marginBottom: 5,
          backgroundColor: theme.colors.surface,
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
            <Text style={[theme.fonts.headlineMedium, { fontFamily: 'Bitter-Bold' }]}>{(mark.value ?? "--").toString().replace(".", ",")}</Text>
          </View>

          {mark.valueOn != 20 && <View
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
          </View>}
        </View>
        <View style={{
          marginLeft: 5,
          marginVertical: 10,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
          <Text style={[theme.fonts.bodyLarge, {
            marginBottom: 5,
            maxWidth: Dimensions.get('window').width - 130,
          }]} numberOfLines={2}>{mark.title}</Text>
          <Text style={theme.fonts.labelMedium} numberOfLines={1}>{formatDate(mark.dateEntered)}</Text>
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
            shadowOpacity: 0.6,
            shadowRadius: 2,
            shadowOffset: { width: 0 },
          }}
        >
          <Text style={[theme.fonts.labelSmall, { color: 'white' }]}>Non effective</Text>
        </View> : <PressableScale
          onPress={() => changeMarkCoefficient(mark, mark.coefficient + 1)}
          style={{
            position: 'absolute',
            right: 10,
            bottom: -7.5,
            paddingHorizontal: 7.5,
            paddingVertical: 3,
            backgroundColor: theme.colors.background,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.colors.surface,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <XIcon size={15} color={theme.colors.onSurface}/>
          <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{mark.coefficient}</Text>
          <ChevronDownIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>
        </PressableScale>}
      </PressableScale>
    );
  }

  function changeMarkCoefficient(mark, newCoefficient) {
    mark.coefficient = newCoefficient;
    Preferences.customCoefficients.set(mark.id, newCoefficient);
    Preferences.saveCustomCoefficients();
    refreshAverages();
    updateScreen();
  }

  function changeSubjectCoefficient(newCoefficient) {
    subject.coefficient = newCoefficient;
    Preferences.customCoefficients.set(`SUBJECT-${subject.id}`, newCoefficient);
    Preferences.saveCustomCoefficients();
    refreshAverages();
    updateScreen();
  }
  
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
          backgroundColor: getSubjectColor(subject.code),
          borderRadius: 20,
          marginRight: 10,
        }}>
          <Text style={[theme.fonts.headlineLarge, { fontFamily: 'Bitter-Bold', fontSize: 30 }]}>{formatAverage(subject.average)}</Text>
        </View>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          height: 100,
        }}>
          <Text style={theme.fonts.bodyLarge}>{subject.name}</Text>
          <Text style={theme.fonts.labelMedium}>Classe : {formatAverage(subject.classAverage)}</Text>
          <PressableScale
            onPress={() => changeSubjectCoefficient(subject.coefficient + 1)}
            style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: Dimensions.get('window').width - 150,
          }}>
            <Text style={theme.fonts.labelLarge}>Coeff.</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <XIcon size={15} color={theme.colors.onSurface}/>
              <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{subject.coefficient}</Text>
              <ChevronDownIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>
            </View>
          </PressableScale>
        </View>
      </View>
      {[...(subject.teachers.values() ?? [])].map((teacher, key) => teacherCard(teacher, key))}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Separator theme={theme} style={{ width: "28%" }}/>
        <View style={{ width: '44%', alignItems: 'center'}}><Text style={theme.fonts.labelLarge}>Dernières notes</Text></View>
        <Separator theme={theme} style={{ width: "28%" }}/>
      </View>
      <ScrollView style={{
        height: Dimensions.get('window').height - 400 - ((subject.teachers.size ?? 0) * 100),
      }} showsVerticalScrollIndicator={false} >
        {subject.marks.map((mark) => markCard(mark, mark.id))}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

export default SubjectPopup;

