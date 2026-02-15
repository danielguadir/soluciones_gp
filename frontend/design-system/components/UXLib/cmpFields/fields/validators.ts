import { FieldTypeEnum } from "./types";

export const REGEX = {
  NUMERIC: /^[0-9]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TEXT: /^[a-zA-ZÁ-ÿ\s]*$/,
};

const findMisMatch = (value: string, expReg: RegExp): string => {
  let res = "";
  for (let i = 0; i < value.length; i++) {
    const partialString = value[i];
    if (!expReg.test(partialString)) {
      res = res.length > 0 ? `${res}, ${value[i]}` : value[i];
    }
  }
  return res;
};

export const validateValue = (
  props: any
): { error: string | null; valueVali: any } => {
  let { valueVali, textField, type, mandatory, maxIntStr, expReg, ...rest } =
    props;
  if (
    mandatory &&
    (valueVali === "" || valueVali === null || valueVali === undefined)
  ) {
    return { error: "Campo requerido", valueVali: "" };
  }

  if (!valueVali) return { error: null, valueVali };

  switch (type.toLowerCase()) {
    case FieldTypeEnum.NUMBER:
      if (valueVali.length > maxIntStr) {
        return {
          error: `Solo ${maxIntStr} caracteres permitidos.`,
          valueVali: valueVali.substring(0, maxIntStr),
        };
      }
      if (valueVali.length > 0 && !REGEX.NUMERIC.test(valueVali)) {
        return { error: "Solo se permiten números", valueVali };
      }

      if (expReg !== "") {
        const testValue = new RegExp(expReg).test(valueVali);
        if (!testValue) {
          return {
            error: `No se permite caracteres especiales y solo ${maxIntStr} caracteres permitidos.`,
            valueVali,
          };
        }
      }
      break;
    case FieldTypeEnum.TEXT:
    case FieldTypeEnum.PASSWORD:
    case FieldTypeEnum.LOCATION:
    case FieldTypeEnum.ICON:
      if (valueVali.length > maxIntStr) {
        return {
          error: `Solo ${maxIntStr} caracteres permitidos.`,
          valueVali: valueVali.substring(0, maxIntStr),
        };
      }
      if (type.toLowerCase() === FieldTypeEnum.TEXT && expReg !== "") {
        const valExpReg = findMisMatch(valueVali, new RegExp(expReg));
        const testValue = new RegExp(expReg.toString()).test(valueVali);
        if (!testValue) {
          return {
            error: `No se permiten estos caracteres "${valExpReg}" y solo ${maxIntStr} caracteres permitidos.`,
            valueVali,
          };
        }
      }
      break;

    case FieldTypeEnum.BOOLEAN:
      return { error: null, valueVali: valueVali ? valueVali : false };
      break;
    case FieldTypeEnum.FOREIGN:
      if (textField !== "" && textField !== null && textField !== undefined) {
        return { error: null, valueVali: textField };
      }
      break;
    case FieldTypeEnum.TYPEDOCUMENT:
      rest.maxFiles = rest?.maxFiles ? rest?.maxFiles : 5;
      rest.maxSize = rest?.maxSize ? rest?.maxSize : 5;
      rest.multiple = rest?.multiple ? rest.multiple : false;

      if (valueVali) {
        const accept = rest?.accept ? rest.accept : "";
        const arrAccept =
          typeof accept === "string" ? accept.split(",") : accept;
        const typeExt = `.${valueVali[0].name.split(".")[1]}`;
        let error;
        if (!arrAccept.includes(typeExt)) {
          error = "EL archivo que trata de subir no cumple con los requisitos.";
          return { error, valueVali: valueVali[0] };
        } else {
          if (!rest?.multiple && valueVali.length > 1) {
            error = "Solo se permite un archivo.";
            return { error, valueVali: valueVali[0] };
          }

          if (rest?.multiple && valueVali.length > rest?.maxFiles) {
            error = `No puedes subir más de ${rest?.maxFiles} archivos.`;
            return { error, valueVali: valueVali[0] };
          }

          const oversizedFiles = Array.from(valueVali).filter(
            (file: any) => file.size > rest?.maxSize * 1024 * 1024
          );

          if (oversizedFiles.length > 0) {
            error = `Algunos archivos superan el tamaño máximo de ${rest?.maxSize}MB`;
            return { error, valueVali: valueVali[0] };
          }

          return { error: null, valueVali: valueVali[0] };
        }
      }
      break;

    default:
      break;
  }
  valueVali =
    typeof valueVali === "object" && type !== "typeDocument"
      ? JSON.stringify(valueVali)
      : valueVali;

  return { error: null, valueVali };
};
