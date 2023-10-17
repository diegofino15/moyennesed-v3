import { Preferences } from "./Preferences";
import { getMarkCoefficient } from "../utils/CoefficientsManager";
import { capitalizeWords } from "../utils/Utils";


function getFormattedMark(jsonData) {
  var coefficient = parseFloat(jsonData.coef.toString().replace(",", "."));
  if (coefficient === 0) { coefficient = 1; }
  Preferences.defaultEDCoefficients.set(`MARK-${jsonData.id}`, coefficient);
  if (Preferences.customCoefficients.has(`MARK-${jsonData.id}`)) {
    coefficient = Preferences.customCoefficients.get(`MARK-${jsonData.id}`);
  } else if (Preferences.guessMarksCoefficients) {
    coefficient = getMarkCoefficient(jsonData.devoir);
  }

  return {
    "id": jsonData.id,
    "title": jsonData.devoir,
    "date": new Date(jsonData.date),
    "dateEntered": new Date(jsonData.dateSaisie),
    "isEffective": !(jsonData.nonSignificatif || jsonData.enLettre),
    "valueStr": jsonData.valeur.toString().trim(),
    "value": parseFloat(jsonData.valeur.toString().replace(",", ".")),
    "classValue": jsonData.moyenneClasse ? parseFloat(jsonData.moyenneClasse.toString().replace(",", ".")) : undefined,
    "valueOn": parseFloat(jsonData.noteSur.toString().replace(",", ".")),
    "coefficient": coefficient,
    "periodCode": jsonData.codePeriode,
    "subjectCode": jsonData.codeMatiere,
    "subjectTitle": capitalizeWords(jsonData.libelleMatiere),
    "subSubjectCode": jsonData.codeSousMatiere,
  };
}


export { getFormattedMark };