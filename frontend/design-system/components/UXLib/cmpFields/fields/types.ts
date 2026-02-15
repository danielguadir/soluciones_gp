export enum FieldTypeEnum {
  STRING = "string",
  BOOLEAN = "boolean",
  LOCATION = "location",
  TEXT = "text",
  PASSWORD = "password",
  NUMBER = "number",
  FOREIGN = "foreign",
  SELECT = "select",
  SELECT_TAB = "selecttab",
  HIDDEN = "hidden",
  DATE = "date",
  PICK_VIEW = "pickview",
  UPLOAD = "upload",
  TYPEDOCUMENT = "typedocument",
  ICON = "icon",
}

export type FieldType =
  | "string"
  | "String"
  | "STRING"
  | "boolean"
  | "Boolean"
  | "BOOLEAN"
  | "location"
  | "Location"
  | "LOCATION"
  | "text"
  | "Text"
  | "TEXT"
  | "password"
  | "Password"
  | "PASSWORD"
  | "number"
  | "Number"
  | "NUMBER"
  | "foreign"
  | "Foreign"
  | "FOREIGN"
  | "select"
  | "Select"
  | "SELECT"
  | "selectTab"
  | "SelectTab"
  | "SELECTTAB"
  | "hidden"
  | "Hidden"
  | "HIDDEN"
  | "date"
  | "Date"
  | "DATE"
  | "prb"
  | "Prueba"
  | "PRUEBA"
  | "search"
  | "Search"
  | "SEARCH"
  | "pickView"
  | "PickView"
  | "PICKVIEW"
  | "pickview"
  | "TypeDocument"
  | "Typedocument"
  | "typedocument"
  | "typeDocument"
  | "icon"
  | "Icon"
  | "ICON";

export type IconPosition = "left" | "right";

export interface CmpFieldProps {
  className?: string;
  minStr?: number;
  maxNum?: number;

  //INIT
  id: string;
  label?: string;
  value?: any;
  fieldRef?: React.RefObject<HTMLInputElement>; // fieldRef
  template?: "default" | "outlined";

  // FIELD COMMON
  maxStr?: number; // maxIntStr
  mandatory?: boolean;
  disabled?: boolean;
  autoComplete?: boolean;
  iconSelect?: string;
  iconClr?: string;

  // FIELD TEXT | PASSWORD
  type: FieldType;
  iconPosition?: IconPosition;
  iconString?: string;

  //FIELD DATE
  bckCalendar?: string;
  modeSelectDate?: "single" | "range";
  minDate?: object;
  maxDate?: object;
  numOfMonth?: number;
  formatDate?: string;

  // FIELD SELECT | TAB
  foreignDao?: Record<string, string>;
  permissionsCreateFrg?: boolean;
  onCreateFrg?: (value: string) => void;
  readOnly?: boolean;
  nameBtnClose?: string;
  nameBtnCreate?: string;
  crud?: boolean;
  onClicCrud?: () => void;

  // FIELD SELECT TAB  | BOOLEAN
  variant?: "switch" | "squared";

  // FIELD MAP
  zoom?: number;
  typeGeo?: number;

  // FUNCIONES DEL FIELD Y PROPS
  iconMndtory?: boolean;
  getValue?: (
    id: string | "",
    value?: any,
    isValid?: boolean,
    textField?: string | undefined
  ) => void;
  error?: string | null;

  // FIELD UPLOAD
  accept?: string;
  maxSizeUpload?: number;
  multiple?: boolean;
  nameFile?: string;
  ///////////////////////
  expReg?: string | RegExp;
  description?: string;
  ghost?: any;
  ////////////////////////////////////

  formFieldsMap?: Record<string, any>;
  onChange?: (value: any, textField?: string | null | undefined) => void;
}

export interface FieldState {
  value: any;
  text: string;
  validation: {
    show: boolean;
    msn: string;
  };
  i18n: string;
}

export type FieldAction = {
  type: string;
  payload: {
    dataValidate: {
      value: any;
      text: string;
      validation: {
        show: boolean;
        msn: string;
      };
    };
  };
};
