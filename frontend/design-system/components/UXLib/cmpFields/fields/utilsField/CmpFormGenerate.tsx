"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
// import "./CmpFormGenerate.css";

import { CmpButton } from "../../../cmpButton/CmpButton";

const CmpFormGenerate = ({ fields, onSubmit, storedValues = {} }) => {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => {
      acc[field.name] = storedValues[field.name] || field.defaultValue || "";
      return acc;
    }, {})
  );

  const handleChange = (name, value, type) => {
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: value.target.checked });
    } else {
      setFormData({
        ...formData,
        [name]: value.target ? value.target.value : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            name={field.name}
            className="input-name"
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e, field.type)}
            placeholder={field.label}
          />
        );

      case "select":
        return (
          <select
            className="input-name"
            name={field.name}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e, 'select')}
          >
            <option value="">-- Seleccionar --</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
                checked={formData[field.name]}
                onChange={(e) => handleChange(field.name, e, field.type)}
              />
            </label>
          </div>
        );

      case "boolean":
        return (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={(e) => handleChange(field.name, e, 'boolean')}
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
      <form className="form-class">
        {fields.map((field) => (
          <div key={field.name} className="hola">
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
        <CmpButton
          variant="outlined"
          nameBtn="guardar"
          type="submit"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

CmpFormGenerate.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "number", "select", "checkbox", "boolean"])
        .isRequired,
      defaultValue: PropTypes.any,
      options: PropTypes.array, // para selects
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export { CmpFormGenerate };