import React, { Suspense } from "react";
import { FieldTypeEnum } from "./types";
import { CmpFieldText } from "./CmpFieldText";
import { CmpFieldBoolean } from "./CmpFieldBoolean";
import { CmpFieldDate } from "./CmpFieldDate";
import { CmpFieldSelect } from "./CmpFieldSelect";
import { CmpFieldTab } from "./CmpFieldTab";
import { FieldPassword } from "./FieldPassword";
import { CmpFieldLocation } from "./CmpFieldLocation";
import FileUploaderWithPreview from "./CmpFieldUpload";
import { CmpFieldAvatar } from "./CmpFieldAvatar";

/**
 * Fábrica de componentes para los diferentes tipos de campos.
 * Recibe las props base y devuelve el componente adecuado
 * según el tipo de campo (`FieldType`).
 */
export const FieldFactory: React.FC<any> = (props) => {
  const { type, ...rest } = props;
  const fieldType = type.toString().toLowerCase();

  const components: Record<string, React.ReactNode> = {
    [FieldTypeEnum.TEXT]: <CmpFieldText {...rest} />,
    [FieldTypeEnum.NUMBER]: <CmpFieldText {...rest} />,
    [FieldTypeEnum.PASSWORD]: <FieldPassword {...rest} />,
    [FieldTypeEnum.FOREIGN]: <CmpFieldSelect {...rest} />,
    [FieldTypeEnum.SELECT]: <CmpFieldTab {...rest} />,
    [FieldTypeEnum.BOOLEAN]: <CmpFieldBoolean {...rest} />,
    [FieldTypeEnum.DATE]: <CmpFieldDate {...rest} />,
    [FieldTypeEnum.LOCATION]: <CmpFieldLocation {...rest} />,
    [FieldTypeEnum.UPLOAD]: <FileUploaderWithPreview {...rest} />,
    [FieldTypeEnum.TYPEDOCUMENT]: <FileUploaderWithPreview {...rest} />,
    [FieldTypeEnum.ICON]: <CmpFieldAvatar {...rest} />,
  };

  return <>{components[fieldType] ?? null}</>;
};


