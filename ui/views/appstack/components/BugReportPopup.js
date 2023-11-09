import { useEffect, useState } from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import { CheckCircle2Icon, CircleIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CustomButton } from '../../global_components/CustomButton';
import { UserData } from '../../../../core/UserData';
import { firebase } from '../../../../utils/firebaseUtils';
import { Logger } from '../../../../utils/Logger';


function BugReportPopup({ windowDimensions, theme }) {
  const [selectedPossibleBug, setSelectedPossibleBug] = useState(0);
  const possibleBugs = [
    {
      'title': 'Problème de connexion',
      'subtitle': "L'application ne se connecte plus à mon compte",
      'firebaseCode': 'Connection',
    },
    {
      'title': 'Notes non récupérées',
      'subtitle': "Mon compte se connecte mais mes notes n'apparaissent pas",
      'firebaseCode': 'Marks',
    },
    {
      'title': 'Fausses moyennes / faux coefs',
      'subtitle': "Les 'devine coefficients' ne sont pas au top",
      'firebaseCode': 'Coefficients & Averages',
    },
    {
      'title': 'Problème graphique',
      'subtitle': "J'ai des problèmes d'affichages sur mon écran",
      'firebaseCode': 'Graphics',
    },
    {
      'title': 'Autre',
      'subtitle': `Problème plus dûr à expliquer`,
      'firebaseCode': 'Other',
    }
  ];

  const [canSendBugReport, setCanSendBugReport] = useState(true);
  const [sendingBugReport, setSendingBugReport] = useState(false);
  const [sentBugReport, setSentBugReport] = useState(false);
  useEffect(() => {
    if (Date.now() - (UserData.lastBugReport ?? 0) > UserData.bugReportCooldown) {
      setCanSendBugReport(true);
    } else {
      setCanSendBugReport(false);
    }
  }, []);

  function anonymiseLoginLogs(loginLogs) {
    loginLogs.data.accounts[0].identifiant = "jacksparrow";
    loginLogs.data.accounts[0].prenom = "Jack";
    loginLogs.data.accounts[0].particule = "";
    loginLogs.data.accounts[0].nom = "Sparrow";
    loginLogs.data.accounts[0].email = "jack.sparrow@gmail.com";
    loginLogs.data.accounts[0].modules = [];
    loginLogs.data.accounts[0].parametresIndividuels = {};
    if (!UserData.mainAccount.isParent) {
      loginLogs.data.accounts[0].profile.sexe = "M";
      loginLogs.data.accounts[0].profile.telPortable = "---";
      loginLogs.data.accounts[0].profile.photo = ""
    } else {
      loginLogs.data.accounts[0].profile.email = "jack.sparrow@gmail.com";
      loginLogs.data.accounts[0].profile.telPortable = "";
      loginLogs.data.accounts[0].profile.telPortableConjoint = "";
      loginLogs.data.accounts[0].profile.eleves.forEach(eleve => {
        eleve.prenom = "Jack";
        eleve.nom = "Sparrow";
        eleve.sexe = "M";
        eleve.photo = "";
        eleve.modules = [];
      });
    }
    
    return loginLogs;
  }

  async function sendBugReport() {
    if (Date.now() - (UserData.lastBugReport ?? 0) > UserData.bugReportCooldown) {
      Logger.info("Sending bug report...");
      setSendingBugReport(true);
      const dataToSend = {
        'date': new Date().toISOString(),
        "platform": Platform.OS,
        'bugType': possibleBugs[selectedPossibleBug].firebaseCode,
        'loginLogs': anonymiseLoginLogs(UserData.loginLogs),
        'marksLogs': UserData.marksLogs,
      };
      // Get username for firestore document ID
      const username = JSON.parse(await AsyncStorage.getItem('credentials')).username;
      await firebase.firestore().collection(possibleBugs[selectedPossibleBug].firebaseCode).doc(username).set(dataToSend);
      UserData.lastBugReport = Date.now();
      setSentBugReport(true);
      setSendingBugReport(false);
      setCanSendBugReport(false);
      Logger.info("Sent bug report !");
    } else {
      setCanSendBugReport(false);
    }
  }
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
    }}>
      <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Quel type de bug est-ce ?</Text>
      {possibleBugs.map((bug, key) => <PressableScale onPress={() => {
        if (selectedPossibleBug != key) {
          setSelectedPossibleBug(key);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }} key={key} style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.colors.surface,
        marginTop: 10,
        borderRadius: 10,
      }}>
        <Text style={[theme.fonts.bodyLarge, { width: Dimensions.get('window').width - 80 }]} numberOfLines={2}>{bug.title}</Text>
        <Text style={theme.fonts.labelMedium}>{bug.subtitle}</Text>
        <View style={{
          position: 'absolute',
          right: 5,
          top: 5,
        }}>
          {selectedPossibleBug == key ? <CheckCircle2Icon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/> : <CircleIcon size={20 * windowDimensions.fontScale} color={theme.colors.onSurfaceDisabled}/>}
        </View>
      </PressableScale>)}

      <CustomButton
        title={sendingBugReport ? "Envoi..." : canSendBugReport ? "Envoyer" : sentBugReport ? "Envoyé !" : "Bug déjà signalé"}
        confirmTitle={canSendBugReport ? `Êtes-vous sûr${UserData.mainAccount.getSuffix()} ?` : null}
        confirmLabel={`Envo${UserData.mainAccount.isParent ? "yez" : "ies"}-en qu'un seul !`}
        onPress={sendBugReport}
        style={{
          backgroundColor: (canSendBugReport || sentBugReport) ? theme.colors.primary : '#DA3633',
          marginTop: 20,
        }}
        theme={theme}
      />
    </View>
  );
}

export { BugReportPopup };