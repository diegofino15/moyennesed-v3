import { View, Text, Dimensions, ScrollView } from 'react-native';
import { getSubjectColor } from '../../utils/Colors';
import { formatAverage, formatDate, formatDate2, formatMark } from '../../utils/Utils';
import { ChevronDownIcon, ChevronRight, GraduationCapIcon, XIcon } from 'lucide-react-native';
import Separator from '../global/separator';
import { PressableScale } from 'react-native-pressable-scale';


function SubjectPopup({ subject, mainSubject, changeMarkCoefficient, changeSubjectCoefficient, clickedOnMark, theme }) {
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

  function markCard(mark, key, special) {
    if (mark.id == clickedOnMark && !special) { return null; }

    return (
      <PressableScale
        key={key}
        style={{
          height: 80 + (clickedOnMark == mark.id ? 2 : 0),
          flexDirection: 'row',
          borderRadius: 10,
          padding: 5,
          marginTop: 10,
          marginBottom: 5,
          backgroundColor: theme.colors.surface,
          borderWidth: clickedOnMark == mark.id ? 2 : 0,
          borderColor: getSubjectColor(mark.subjectCode),
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
          <Text style={[theme.fonts.bodyLarge, {
            marginBottom: 5,
            maxWidth: Dimensions.get('window').width - 130,
          }]} numberOfLines={2}>{mark.title}</Text>
          
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
          <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{mark.coefficient.toString().replace(".", ",")}</Text>
          <ChevronDownIcon size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 5 }}/>
        </PressableScale>}
      </PressableScale>
    );
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
          <Text style={[theme.fonts.bodyLarge, {
            width: Dimensions.get('window').width - 150,
          }]}>{subject.isSubSubject ? (`${mainSubject.name}`) : null}{subject.isSubSubject ? <ChevronRight size={15} color={theme.colors.onSurfaceDisabled} style={{ marginLeft: 10, marginRight: 10 }} /> : null}{subject.name}</Text>
          
          {subject.classAverage ? <View style={{ flexDirection: 'row' }}>
            <Text style={theme.fonts.labelMedium}>Classe : </Text>
            <Text style={[theme.fonts.labelMedium, { fontFamily: 'Bitter-Regular' }]}>{formatAverage(subject.classAverage)}</Text>
          </View> : null}
          <PressableScale
            onPress={() => changeSubjectCoefficient(subject, subject.coefficient + 1)}
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
              <Text style={[theme.fonts.headlineSmall, { fontSize: 17 }]}>{subject.coefficient.toString().replace(".", ",")}</Text>
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
        height: subject.marks?.length == 0 ? 75 : Dimensions.get('window').height - 400 - ((subject.teachers.size ?? 0) * 100),
      }} showsVerticalScrollIndicator={false} >
        {clickedOnMark ? markCard(subject.marks.find((mark) => mark.id == clickedOnMark), clickedOnMark, true) : null}
        {subject.marks.map((mark) => markCard(mark, mark.id))}
        <View style={{ height: 50 }} />
      </ScrollView>
      {subject.marks?.length == 0 ? <Text style={[theme.fonts.labelLarge, { alignSelf: 'center' }]}>Aucune note pour l'instant</Text> : null}
    </View>
  );
}

export default SubjectPopup;

