import { View, Text, ScrollView } from "react-native";

import { InfoCard } from "../../../components/authstack/InfoCard";


function FeaturesPage({ pageStyle, theme }) {
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
      <InfoCard
        title="🚀 L'ajout parfait à ÉcoleDirecte"
        description="Retrouvez votre moyenne générale et vos moyennes par matière, parfois cachées sur ÉcoleDirecte !"
        theme={theme}
        style={{ marginBottom: 20 }}
      />
      <InfoCard
        title="🧠 Avec des fonctionnalités uniques"
        description="Profitez des fonctionnalités uniques comme le 'devine coefficient notes', pour approximer encore mieux vos moyennes."
        theme={theme}
        style={{ marginBottom: 20 }}
      />
      {/* <InfoCard
        title="🌟 Élève ou parent ?"
        description="MoyennesED fonctionne pour les élèves et les parents ! Consultez vos moyennes ou celles de vos enfants."
        theme={theme}
        style={{ marginBottom: 20 }}
      />
      <InfoCard
        title="📈 Statistiques"
        description="MoyennesED charge vos notes et vos moyennes automatiquement, suivez votre progression en temps réel."
        theme={theme}
        style={{ marginBottom: 20 }}
      /> */}
      <InfoCard
        title="🔒 Plus sécurisée que jamais"
        description="Aucune de vos données ne nous est envoyée, tout reste sur votre appareil."
        theme={theme}
      />
    </View>
  );
}

export { FeaturesPage };