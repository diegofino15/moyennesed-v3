import { Preferences } from "./Preferences";
import { CoefficientManager } from "./CoefficientsManager";


function getFormattedMark(jsonData) {
  const markID = jsonData.id;
  
  var coefficient = CoefficientManager.setDefaultEDMarkCoefficient(markID, parseFloat(jsonData.coef.toString().replace(",", ".")));
  var coefficientType = 0;
  var newCoefficient;
  if (Preferences.allowGuessMarkCoefficients) {
    newCoefficient = CoefficientManager.getGuessedMarkCoefficient(jsonData.id, jsonData.devoir);
    if (newCoefficient) {
      coefficient = newCoefficient;
      coefficientType = 1;
    }
  }
  if (Preferences.allowCustomCoefficients) {
    newCoefficient = CoefficientManager.getCustomMarkCoefficient(markID);
    if (newCoefficient != undefined) {
      coefficient = newCoefficient;
      coefficientType = 2;
    }
  }

  return {
    "id": markID,
    "title": jsonData.devoir,
    "date": new Date(jsonData.date),
    "dateEntered": new Date(jsonData.dateSaisie),
    
    "isEffective": !(jsonData.nonSignificatif || jsonData.enLettre),
    "valueStr": jsonData.valeur.toString().trim(),
    "value": parseFloat(jsonData.valeur.toString().replace(",", ".")),
    "classValue": jsonData.moyenneClasse ? parseFloat(jsonData.moyenneClasse.toString().replace(",", ".")) : undefined,
    "valueOn": parseFloat(jsonData.noteSur.toString().replace(",", ".")),
    
    "coefficient": coefficient,
    "coefficientType": coefficientType,

    "periodCode": jsonData.codePeriode.substring(0, 4),
    "subjectCode": jsonData.codeMatiere,
    "subSubjectCode": jsonData.codeSousMatiere,
  };
}

export { getFormattedMark };