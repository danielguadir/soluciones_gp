"use client";
import React, { useState } from "react";
import { CmpButton } from "../../../cmpButton/CmpButton";

type FieldType = "text" | "number" | "select" | "checkbox" | "boolean";

interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  defaultValue?: string | number | boolean;
  options?: FormFieldOption[];
}

interface CmpFormGenerateProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string | number | boolean>) => void;
  storedValues?: Record<string, unknown>;
}

type FormValue = string | number | boolean;
type ChangeValue = React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | FormValue;

const CmpFormGenerate: React.FC<CmpFormGenerateProps> = ({ fields, onSubmit, storedValues = {} }) => {
  const [formData, setFormData] = useState<Record<string, FormValue>>(() =>
    fields.reduce<Record<string, FormValue>>((acc, field) => {
      acc[field.name] = (storedValues[field.name] ?? field.defaultValue ?? "") as FormValue;
      return acc;
    }, {})
  );

  const handleChange = (name: string, value: ChangeValue, type: FieldType) => {
    if (type === "checkbox") {
      const checked = typeof value === "boolean" ? value : value && typeof value === "object" && "target" in value ? (value.target as HTMLInputElement).checked : false;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      const nextValue = typeof value === "object" && value !== null && "target" in value ? value.target.value : value;
      setFormData((prev) => ({ ...prev, [name]: nextValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            name={field.name}
            className="input-name"
            value={String(formData[field.name] ?? "")}
            onChange={(e) => handleChange(field.name, e, field.type)}
            placeholder={field.label}
          />
        );

      case "select":
        return (
          <select
            className="input-name"
            name={field.name}
            value={String(formData[field.name] ?? "")}
            onChange={(e) => handleChange(field.name, e, "select")}
          >
            <option value="">-- Seleccionar --</option>
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="check-box">
            <label>
              <input
                type="checkbox"
                checked={Boolean(formData[field.name])}
                onChange={(e) => handleChange(field.name, e, field.type)}
              />
            </label>
          </div>
        );

      case "boolean":
        return (
          <select
            name={field.name}
            value={String(formData[field.name] ?? "")}
            onChange={(e) => handleChange(field.name, e, "boolean")}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="content-form">
      <form className="form-class" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="hola">
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
        <CmpButton variant="outlined" nameBtn="guardar" type="submit" onClick={() => {}} />
      </form>
    </div>
  );
};

export { CmpFormGenerate };