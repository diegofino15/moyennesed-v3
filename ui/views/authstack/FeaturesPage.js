import { View, Text, ScrollView } from "react-native";

import { InfoCard } from './components/InfoCard';


function FeaturesPage({ pageStyle, windowDimensions, theme }) {
  return (
    <View style={pageStyle}>
      {/* Title */}
      <Text style={[
        theme.fonts.titleMedium,
        { marginBottom: 10 }
      ]}>Une appli simple, épurée, sans pubs</Text>
      <Text style={[
        theme.fonts.labelLarge,
        { marginBottom: 30 }
      ]}>À la fois pour les élèves, mais aussi pour les parents !</Text>

      {/* Features */}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <InfoCard
          title="🚀 L'ajout parfait à ÉcoleDirecte"
          description="Retrouvez votre moyenne générale et vos moyennes par matière, parfois cachées sur ÉcoleDirecte !"
          theme={theme}
          style={{ marginBottom: 20 }}
          windowDimensions={windowDimensions}
        />
        <InfoCard
          title="🧠 Des fonctionnalités uniques"
          description="Profitez des fonctionnalités uniques comme le 'devine coefficient notes', pour approximer encore mieux vos moyennes."
          theme={theme}
          style={{ marginBottom: 20 }}
          windowDimensions={windowDimensions}
        />
        <InfoCard
          title="🔒 Plus sécurisée que jamais"
          description="Aucune de vos données ne nous est envoyée, tout reste sur votre appareil."
          theme={theme}
          style={{ marginBottom: 20 }}
          windowDimensions={windowDimensions}
        />
        <InfoCard
          title="👨‍💻 Un support actif"
          description="Vous rencontrez un problème ? Envoyez un mail ou signalez un bug directement depuis l'application."
          theme={theme}
          windowDimensions={windowDimensions}
        />
        <View style={{ height: 100 }}/>
      </ScrollView>
    </View>
  );
}

export { FeaturesPage };