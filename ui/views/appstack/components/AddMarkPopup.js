import { View, Text } from "react-native";
import { createCustomMark } from "../../../../core/Mark";
import { Preferences } from "../../../../core/Preferences";
import { addMarkToPeriod, removeMarkFromPeriod } from "../../../../core/Period";
import { CustomButton } from "../../global_components/CustomButton";
import { CoefficientManager } from "../../../../core/CoefficientsManager";
import { randomUUID } from "../../../../utils/Utils";
import { CustomInput } from "../../global_components/CustomInput";
import { BookMarkedIcon, BookOpenCheckIcon, HighlighterIcon, PercentIcon, SlashIcon, XIcon } from "lucide-react-native";
import { useState } from "react";


function AddMarkPopup({ period, refreshAverages, theme }) {
  function addMark() {
    const customMark = createCustomMark(
      randomUUID(),
      "My first custom mark",
      19,
      20,
      3,
      Date.now(),
      "A002",
      "MATHS",
      undefined,
    );
    Preferences.addCustomMark(customMark);
    Preferences.save();
    CoefficientManager.setDefaultEDMarkCoefficient(customMark.id, customMark.coefficient);
    addMarkToPeriod(period, customMark, true);
    refreshAverages();
  }

  function removeMark() {
    CoefficientManager.deleteDefaultEDMarkCoefficient("custom-mark-lol");
    CoefficientManager.deleteCustomMarkCoefficient("custom-mark-lol");
    CoefficientManager.deleteGuessedMarkCoefficient("custom-mark-lol");
    removeMarkFromPeriod(period, Preferences.customMarks.get("custom-mark-lol"));
    Preferences.removeCustomMark("custom-mark-lol");
    Preferences.save();
    refreshAverages();
  }

  const [markTitle, setMarkTitle] = useState("");
  const [markValue, setMarkValue] = useState("");
  const [markValueOn, setMarkValueOn] = useState("");
  const [markSubjectCode, setMarkSubjectCode] = useState("");
  const [markSubSubjectCode, setMarkSubSubjectCode] = useState("");

  const handleTextChange = (text, setFunction) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');

    
    const decimalParts = cleanedText.split('.');
    const integerPart = decimalParts[0];
    const decimalPart = decimalParts[1] || '';
    const truncatedDecimal = decimalPart.slice(0, 2);
    const formattedValue = `${integerPart}.${truncatedDecimal}`;
    const numericValue = parseFloat(formattedValue);
    const nonNegativeValue = Math.max(0, numericValue);
    setFunction((nonNegativeValue ? nonNegativeValue : 0).toString());
  };
  
  return (
    <View>
      <Text style={[theme.fonts.titleSmall, { marginBottom: 20 }]}>Ajouter une note</Text>

      <CustomInput
        label="Titre"
        icon={<BookMarkedIcon size={30} color={theme.colors.onSurfaceDisabled}/>}
        onChangeText={setMarkTitle}
        style={{ marginBottom: 10  }}
        theme={theme}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <CustomInput
          label="Valeur"
          icon={<HighlighterIcon size={30} color={theme.colors.onSurfaceDisabled}/>}
          value={markValue}
          onChangeText={(text) => handleTextChange(text, setMarkValue)}
          isNumerical
          style={{
            width: "48%",
          }}
          theme={theme}
        />
        <CustomInput
          label="Coeff."
          icon={<XIcon size={30} color={theme.colors.onSurfaceDisabled}/>}
          onChangeText={setMarkValueOn}
          isNumerical
          style={{
            width: "48%",
          }}
          theme={theme}
        />
      </View>

      <CustomButton
        title="Ajouter"
        onPress={addMark}
        theme={theme}
      />
      <CustomButton
        title="Supprimer une note"
        onPress={removeMark}
        theme={theme}
      />
    </View>
  );
}

export { AddMarkPopup };