import { View } from "react-native";


function MoyennesEDSeparator({ style, theme }) {
  return (
    <View
      style={[{
        width: '100%',
        height: 3,
        backgroundColor: theme.colors.surface,
        borderRadius: 3,
      }, style]}
    />
  );
}

export default MoyennesEDSeparator;