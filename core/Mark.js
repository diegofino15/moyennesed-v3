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
  var isEffective = !(jsonData.nonSignificatif || jsonData.enLettre);
  if (!value || isNaN(value) || valueStr.length == 0) {
    let programElementsSum = 0;
    let programElementsCoef = 0;
    jsonData.elementsProgramme?.forEach((programElement) => {
      let programElementValue = parseFloat(programElement.valeur.toString().trim().replace(",", "."));
      programElementsSum += isNaN(programElementValue) ? 0 : programElementValue;
      programElementsCoef += isNaN(programElementValue) ? 0 : 1;
    });

    value = programElementsSum / (programElementsCoef ? programElementsCoef : 1);
    if (value < 0) {
      isEffective = false;
      value = 0;
    }
    valueOn = 4; // Not sure
    valueStr = (Math.round(value * 100) / 100).toString().replace(".", ",");
  }

  return {
    "id": markID,
    "title": jsonData.devoir,
    "date": new Date(jsonData.date),
    "dateEntered": new Date(jsonData.dateSaisie),
    
    "isEffective": isEffective,
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