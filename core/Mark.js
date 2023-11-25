import { Preferences } from "./Preferences";
import { CoefficientManager } from "./CoefficientsManager";


function getFormattedMark(jsonData) {
  const markID = jsonData.id;
  
  var coefficient = CoefficientManager.setDefaultEDMarkCoefficient(markID, parseFloat(jsonData.coef.toString().replace(",", ".")));
  var coefficientType = 0;
  var newCoefficient;
  if (Preferences.allowGuessMarkCoefficients) {
    newCoefficient = CoefficientManager.getGuessedMarkCoefficient(markID, jsonData.devoir);
    if (newCoefficient) {
      coefficient = newCoefficient;
      coefficientType = 1;
    }
  }
  if (Preferences.allowCustomCoefficients) {
    newCoefficient = CoefficientManager.getCustomMarkCoefficient(markID);
    if (newCoefficient) {
      coefficient = newCoefficient;
      coefficientType = 2;
    }
  }

  var valueStr = jsonData.valeur.toString().trim();
  var value = parseFloat(jsonData.valeur.toString().replace(",", "."));
  var valueOn = parseFloat(jsonData.noteSur.toString().replace(",", "."));
  
  // If value is based on program elements
  if (!value && !valueOn && valueStr.length == 0) {
    var programElementsSum = 0;
    var programElementsCoef = 0;
    jsonData.elementsProgramme?.forEach((programElement) => {
      programElementsSum += parseFloat(programElement.valeur.toString().replace(",", ".")),
      programElementsCoef += 1;
    });
    value = programElementsSum / (programElementsCoef ?? 1);
    valueOn = 5; // Not sure
    valueStr = (Math.round(value * 100) / 100).toString().replace(".", ",");
  }

  return {
    "id": markID,
    "title": jsonData.devoir,
    "date": new Date(jsonData.date),
    "dateEntered": new Date(jsonData.dateSaisie),
    
    "isEffective": !(jsonData.nonSignificatif || jsonData.enLettre),
    "valueStr": valueStr,
    "value": value,
    "classValue": parseFloat(jsonData.moyenneClasse?.toString().replace(",", ".")),
    "valueOn": valueOn,
    
    "coefficient": coefficient,
    "coefficientType": coefficientType,

    "periodCode": jsonData.codePeriode.substring(0, 4),
    "subjectCode": jsonData.codeMatiere,
    "subSubjectCode": jsonData.codeSousMatiere,
  };
}

export { getFormattedMark };