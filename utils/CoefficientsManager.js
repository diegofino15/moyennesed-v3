const marksCoefficients = new Map(Object.entries({
  "dm": 0.5,
  "ie": 1.0,
  "ds": 2.0, "dst": 2.0,
  "oraux": 3.0,
  "brevet": 3.0,
  "bac": 5.0,
}));

function getMarkCoefficient(markTitle) {
  var coefficient = 1;
  marksCoefficients.forEach((value, key) => {
    if (markTitle.toLowerCase().includes(key)) {
      coefficient = value;
    }
  });
  return coefficient;
}

const subjectsCoefficients = new Map(Object.entries({
  "FRANCAIS": 3.0, "FRANÇAIS": 3.0, "FRANC": 3.0,
  "HISTOIRE": 3.0, "HIS": 3.0, "GEOGRAPHIE": 3.0, "GEO": 3.0, "GÉOGRAPHIE": 3.0, "GÉO": 3.0,
  "ANGLAIS": 3.0, "ANG": 3.0, "LV1": 3.0, "LVA": 3.0, "LV+": 3.0,
  "ESPAGNOL": 2.0, "ESP": 2.0, "LV2": 2.0, "LVB": 2.0,
  "ALLEMAND": 2.0, "ALL": 2.0,
  "SES": 2.0, "ECO": 2.0, "ÉCO": 2.0, "ÉCONOMIQUE": 2.0, "ECONOMIQUE": 2.0, "ÉCONOMIQUES": 2.0, "ECONOMIQUES": 2.0, "SOCIALE": 2.0, "SOCIALES": 2.0,
  "MATHEMATIQUES": 3.0, "MATHÉMATIQUES": 3.0, "MATHS": 3.0,
  "PHYSIQUE": 2.0, "CHIMIE": 2.0,
  "SVT": 2.0, "VIE": 2.0, "TERRE": 2.0, "SCIENCES": 2.0,
  "EPS": 2.0, "SPORT": 2.0, "SPORTIVE": 2.0,
}));

function getSubjectCoefficient(subjectName) {
  var coefficient = 1;
  subjectsCoefficients.forEach((value, key) => {
    if (subjectName.toUpperCase().includes(key)) {
      coefficient = value;
    }
  });
  return coefficient;
}

export { getMarkCoefficient, getSubjectCoefficient };


