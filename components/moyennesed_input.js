import { View, TextInput } from 'react-native';


function MoyennesEDInput({
  label,
  icon,
  onChangeText,
  secureTextEntry,
  theme,
  style
}) {
  return (
    <View
      style={[{
        borderColor: theme.colors.surface,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        borderBottomWidth: 1,
        flexDirection: 'row',
      }, style]}
    >
      {icon}
      <TextInput
        style={{
          ...theme.fonts.bodyLarge,
          marginLeft: 10,
          width: '100%',
        }}
        placeholder={label}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={theme.colors.onSurfaceDisabled}
        autoCapitalize='none'
        autoCorrect={false}
      />
    </View>
  );
}

export default MoyennesEDInput;

