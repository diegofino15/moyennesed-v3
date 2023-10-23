import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2Icon, CircleIcon } from 'lucide-react-native';
import { PressableScale } from 'react-native-pressable-scale';
import * as Haptics from 'expo-haptics';

import { CustomButton } from '../../global_components/CustomButton';
import { UserData } from '../../../../core/UserData';
import { firebase } from '../../../../utils/firebaseUtils';


function BugReportPopup({ theme }) {
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
      console.log("Sending bug report...");
      setSendingBugReport(true);
      const dataToSend = {
        'date': new Date().toISOString(),
        'bugType': possibleBugs[selectedPossibleBug].firebaseCode,
        'loginLogs': anonymiseLoginLogs(UserData.loginLogs),
        'marksLogs': UserData.marksLogs,
      };
      const collectionRef = firebase.firestore().collection(possibleBugs[selectedPossibleBug].firebaseCode);
      await collectionRef.add(dataToSend);
      UserData.lastBugReport = Date.now();
      setSendingBugReport(false);
      console.log("Sent bug report !");
    } else {
      setCanSendBugReport(false);
    }
  }
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
    }}>
      <Text style={[theme.fonts.titleSmall, { marginBottom: 10 }]}>Signaler un bug</Text>
      <Text style={[theme.fonts.labelLarge, { marginBottom: 20, textAlign: 'justify' }]}>Aidez le développement de l'application en signalant un bug, aucune info personnelle n'est envoyée.</Text>

      <Text style={theme.fonts.bodyLarge}>Quel type de bug est-ce ?</Text>
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
        maxHeight: 70,
      }}>
        <Text style={theme.fonts.bodyLarge}>{bug.title}</Text>
        <Text style={theme.fonts.labelMedium}>{bug.subtitle}</Text>
        <View style={{
          position: 'absolute',
          right: 5,
          top: 5,
        }}>
          {selectedPossibleBug == key ? <CheckCircle2Icon size={20} color={theme.colors.onSurfaceDisabled}/> : <CircleIcon size={20} color={theme.colors.onSurfaceDisabled}/>}
        </View>
      </PressableScale>)}

      <CustomButton
        title={sendingBugReport ? "Envoi..." : canSendBugReport ? "Envoyer" : "Bug déjà signalé"}
        confirmTitle={canSendBugReport ? `Êtes-vous sûr${UserData.mainAccount.getSuffix()} ?` : null}
        confirmLabel={`Envo${UserData.mainAccount.isParent ? "yes" : "ies"}-en qu'un seul !`}
        onPress={sendBugReport}
        style={{
          backgroundColor: canSendBugReport ? theme.colors.primary : '#DA3633',
          marginTop: 20,
        }}
        theme={theme}
      />
    </View>
  );
}

export { BugReportPopup };