import { useEffect, useState, useCallback } from 'react';
import { View, Text, Linking, Alert } from "react-native";
import { UserIcon, KeyRoundIcon } from 'lucide-react-native';

import { CustomInput } from '../../../components/authstack/CustomInput';
import { InfoCard } from "../../../components/authstack/InfoCard";
import { Separator } from '../../../components/global/Separator';
import { UnavailableServers } from '../../../components/global/UnavailableServers';
import { UserData } from '../../../core/UserData';


function LoginPage({ isConnecting, setIsConnecting, setLoggedIn, pageStyle, theme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [unavailableServers, setUnavailableServers] = useState(false);

  useEffect(() => {
    async function handleLogin() {
      setConnectionFailed(false);
      setUnavailableServers(false);
      const successful = await UserData.login(username, password);
      setConnectionFailed(successful != 1);
      setUnavailableServers(successful == -1);
      setIsConnecting(false);
      setLoggedIn(successful == 1);
    }
    if (isConnecting) { handleLogin(); }
  }, [isConnecting]);

  // Forgot password ?
  const forgotPasswordURL = "https://api.ecoledirecte.com/mot-de-passe-oublie.awp";
  const openForgotPasswordURL = useCallback(async () => {
    const supported = await Linking.canOpenURL(forgotPasswordURL);

    if (supported) {
      await Linking.openURL(forgotPasswordURL);
    } else {
      Alert.alert("Une erreur est survenue lors du lancement de l'URL");
    }
  }, [forgotPasswordURL]);
  
  return (
    <View style={pageStyle}>
      {/* Title */}
      <Text style={[
        theme.fonts.titleMedium,
        { marginBottom: 10 }
      ]}>Commençons par vous connecter</Text>
      <Text style={[
        theme.fonts.labelLarge,
        { marginBottom: 30 }
      ]}>MoyennesED fonctionne avec vos identifiants ÉcoleDirecte</Text>
      
      {/* Login input */}
      <CustomInput
        label="Identifiant"
        icon={<UserIcon size={30} color={theme.colors.onSurfaceDisabled} />}
        onChangeText={(text) => setUsername(text)}
        secureTextEntry={false}
        theme={theme}
        style={{ marginBottom: 10 }}
      />
      <CustomInput
        label="Mot de passe"
        icon={<KeyRoundIcon size={30} color={theme.colors.onSurfaceDisabled} />}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        theme={theme}
        style={{
          borderColor: connectionFailed ? '#DA3633' : theme.colors.surface,
        }}
      />
      {unavailableServers && <View style={{ marginTop: 20 }}>
        <Separator theme={theme} style={{ marginBottom: 10 }}/>
        <UnavailableServers theme={theme}/>
        <Separator theme={theme} style={{ marginTop: 10 }}/>
      </View>}
      <InfoCard
        title="🤔 Mot de passe oublié ?"
        description={`Pas de panique, ça arrive à tout le monde ! Cliquez ici pour réinitialiser votre mot de passe.`}
        onPress={openForgotPasswordURL}
        theme={theme}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

export { LoginPage };