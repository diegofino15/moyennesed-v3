import { View, TextInput, Dimensions } from 'react-native';


function CustomInput({
  label,
  icon,
  onChangeText,
  secureTextEntry,
  theme,
  style
}) {
  return (
    <View style={[{
      borderColor: theme.colors.surface,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      borderBottomWidth: 1,
      flexDirection: 'row',
    }, style]}>
      {icon}
      <TextInput
        style={{
          ...theme.fonts.bodyLarge,
          marginLeft: 10,
          width: Dimensions.get('window').width - 105,
          position: 'absolute',
          left: 40,
          height: 50,
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

export { CustomInput };