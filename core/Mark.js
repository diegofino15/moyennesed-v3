import { Preferences } from "./Preferences";
import { getMarkCoefficient } from "../utils/CoefficientsManager";


function getFormattedMark(jsonData) {
  var coefficient = parseFloat(jsonData.coef.toString().replace(",", "."));
  if (coefficient === 0) { coefficient = 1; }
  
  return {
    "id": jsonData.id,
    "title": jsonData.devoir,
    "date": new Date(jsonData.date),
    "dateEntered": new Date(jsonData.dateSaisie),
    "isEffective": !(jsonData.nonSignificatif || jsonData.enLettre),
    "value": parseFloat(jsonData.valeur.toString().replace(",", ".")),
    "classValue": jsonData.moyenneClasse ? parseFloat(jsonData.moyenneClasse.toString().replace(",", ".")) : undefined,
    "valueOn": parseFloat(jsonData.noteSur.toString().replace(",", ".")),
    "coefficient": Preferences.guessMarksCoefficients ? getMarkCoefficient(jsonData.devoir) : coefficient,
    "periodCode": jsonData.codePeriode,
    "subjectCode": jsonData.codeMatiere,
    "subjectTitle": jsonData.libelleMatiere,
    "subSubjectCode": jsonData.codeSousMatiere,
  };
}


export { getFormattedMark };