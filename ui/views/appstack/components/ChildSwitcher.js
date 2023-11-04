import { View, Text, FlatList } from 'react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from "expo-haptics";

import { Separator } from '../../global_components/Separator';
import { UserData } from '../../../../core/UserData';


function ChildSwitcher({ selectedChildAccount, setSelectedChildAccount, theme }) {
  return (
    <View style={{
      marginHorizontal: 20,
    }}>
      <Separator theme={theme} style={{ marginBottom: 10 }}/>

      <FlatList
        horizontal={true}
        bounces={true}
        showsHorizontalScrollIndicator={false}
        data={[...UserData.childrenAccounts.keys()]}
        renderItem={({ item }) => {
          const account = UserData.childrenAccounts.get(item);
          return (
            <PressableScale
              key={item}
              onPress={() => {
                if (selectedChildAccount != item) {
                  setSelectedChildAccount(item);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
            >
              <View style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: selectedChildAccount == item ? theme.colors.primary : theme.colors.background,
                borderRadius: 10,
              }}>
                <Text style={[
                  theme.fonts.labelLarge,
                  { color: selectedChildAccount == item ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled }
                ]}>{account.firstName}</Text>
              </View>
            </PressableScale>
          );
        }}
        style={{
          marginBottom: 10,
        }}
      />
      <Separator theme={theme} style={{ marginBottom: 20 }}/>
    </View>
  );
}

export { ChildSwitcher };