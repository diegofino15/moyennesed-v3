import { View, Text } from "react-native";

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
        style={{ marginBottom: 30 }}
      />
      <InfoCard
        title="🌟 Élève ou parent ?"
        description="MoyennesED fonctionne pour les élèves et les parents ! Consultez vos moyennes ou celles de vos enfants."
        theme={theme}
        style={{ marginBottom: 30 }}
      />
      <InfoCard
        title="🔒 Plus sécurisée que jamais"
        description="Toutes vos données sont stockées sur votre appareil uniquement. Vos identifiants de connexion ne sont pas partagés."
        theme={theme}
      />
    </View>
  );
}

export { FeaturesPage };