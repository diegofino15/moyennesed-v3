import { useRef, useEffect, useState } from "react";
import { View, Text, Dimensions, Platform } from "react-native";
import { CheckCircle2Icon, CircleIcon } from "lucide-react-native";
import { PressableScale } from "react-native-pressable-scale";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";

import { UserData } from "../../../core/UserData";
import { HapticsHandler } from "../../../utils/HapticsHandler";


function LoggedInPage({ selectedAccount, setSelectedAccount, pageStyle, windowDimensions, theme }) {
  // Animation
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.reset();
    setTimeout(() => {
      animationRef.current?.play();
    }, 100)
  }, []);

  return (
    <View style={pageStyle}>
      {/* Title */}
      <Text style={[
        theme.fonts.titleMedium,
        { marginBottom: 10 }
      ]}>{UserData.isWaitingForConfirmation ? "Sélectionnez un des comptes ci-dessous" : `Bonjour ${UserData.mainAccount.firstName} !`}</Text>
      <Text style={[
        theme.fonts.labelLarge,
        { marginBottom: 30 }
      ]}>Connexion bel et bien réussie !</Text>

      {/* Account type */}
      {UserData.isWaitingForConfirmation ? <Text style={theme.fonts.labelLarge}>
        Sélectionnez le compte que vous souhaitez utiliser pour vous connecter.
      </Text> : <Text style={theme.fonts.labelLarge}>Vous êtes connecté{UserData.mainAccount.getSuffix()} en tant que <Text style={[theme.fonts.labelLarge, { fontFamily: 'Montserrat-Bold' }]}>compte {UserData.mainAccount.isParent ? "parent" : "élève"}</Text>.</Text>}
    
      {/* Animation */}
      {UserData.isWaitingForConfirmation ? <View style={{ marginTop: 20 }}>
        {UserData.loginLogs.data.accounts.map((account, index) => <PressableScale onPress={() => {
          if (selectedAccount != index) {
            setSelectedAccount(index);
            HapticsHandler.vibrate(Haptics.ImpactFeedbackStyle.Light);
          }
          }} key={index} style={{
            paddingHorizontal: 10 - (selectedAccount == index ? 1 : 0),
            paddingVertical: 5 - (selectedAccount == index ? 1 : 0),
            backgroundColor: theme.colors.surface,
            marginTop: 10,
            borderRadius: 10,
            borderWidth:  selectedAccount == index ? 1 : 0,
            borderColor: theme.colors.onSurfaceDisabled,
          }}>
            <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - 80 }]} numberOfLines={2}>{account.prenom} {account.nom}</Text>
            <Text style={theme.fonts.labelMedium}>{account.typeCompte == "E" ? "Compte élève" : "Compte parent"}</Text>
            <View style={{
              position: 'absolute',
              right: 5,
              top: 5,
            }}>
              {selectedAccount == index ? <CheckCircle2Icon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/> : <CircleIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>}
            </View>
          </PressableScale>
        )}
        <Text style={[theme.fonts.labelLarge, { marginTop: 20 }]}>Pour changer de compte, il faudra vous déconnecter puis vous reconnecter.</Text>
      </View> : <View style={{
        position: 'absolute',
        top: 200,
        marginTop: 30,
      }}>
        {Platform.OS != "web" && <LottieView
          ref={animationRef}
          autoPlay
          loop={true}
          source={UserData.mainAccount.isParent
            ? UserData.mainAccount.gender == "M"
              ? require("../../../assets/lottie/login-parent-man.json")
              : require("../../../assets/lottie/login-parent-woman.json")
            : UserData.mainAccount.gender == "M"
              ? require("../../../assets/lottie/login-student-boy.json")
              : require("../../../assets/lottie/login-student-girl.json")
          }
          style={{
            width: Dimensions.get('window').width,
          }}
        />}
      </View>}
    </View>
  );
}

export { LoggedInPage };