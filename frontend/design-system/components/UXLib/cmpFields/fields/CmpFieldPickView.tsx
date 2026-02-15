"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { Button as CmpButton } from "../../Button/Button";
import { CmpFieldSelect } from "./CmpFieldSelect";
import { Modal } from "../../Modal/Modal";
import { CmpFormGenerate } from "./utilsField/CmpFormGenerate";

const ICONS = { PICKVIEW: "th-list" };

export const CmpFieldPickView = ({
    id,
    label,
    value,
    onChange,
    getValue,
    foreignDao,
    mandatory,
    disabled,
    template,
    formFieldsMap, // Valores guardados por ID, para mantener el estado del formulario **Obligatorio**
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string>(String(value) || "");
    const [selectedLabel, setSelectedLabel] = useState<string>(foreignDao?.[String(value || "")] || "");
    const [lastOpenedId, setLastOpenedId] = useState<any>(null);

    const [storedValues, setStoredValues] = useState<Record<string, any>>({}); //  Inicializa storedValues en el estado

    const [formValues, setFormValues] = useState<Record<string, any>>({}); // <- aquí se guardan los datos por ID

    useEffect(() => {
        if (selectedId && formValues[selectedId]) {
            setStoredValues(formValues[selectedId]); //  Actualiza storedValues con los datos guardados
        } else {
            setStoredValues({});
        }
    }, [selectedId, openModal, formValues]);

    const handleSelect = (id, text) => {
        setSelectedId(id);           // ID que se usará para mostrar el formulario
        setSelectedLabel(text);      // etiqueta visible
        getValue?.(id, text);          // notifica al padre
        onChange?.(id, text);          // notifica al padre
    };


    console.log("sewwwwlectedId", selectedId);

    return (
        <div className="container-field-pickView">
            <div className="divContainInput">
                <CmpFieldLabel labelFocus id={id} label={label} template={template} />
                <div
                    className="zinputBase-root zinput-root zinputBase-fullWidth zinput-formCrtl zinput-underline zinput-underline-focusOFF zinput-underline-focus-error"

                    onClick={() => {
                        setSelectedId("");
                        setSelectedLabel("");
                        setStoredValues({});
                        setOpenModal(true);
                    }}

                    style={{ width: "100%", display: "flex", alignItems: "center" }}
                >
                    <input
                        className="zinputBase-input zinput-input"
                        type="text"
                        value={selectedLabel || ""}
                        placeholder={label}
                        disabled={disabled}
                        readOnly
                    />
                    <CmpSvg icon={ICONS.PICKVIEW} fontSize="15pt" color="gray" />
                </div>
            </div>

            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title={label}
                style={{ width: "60%", height: "70%" }}
                showFooter={false}
                closeOnOverlayClick={false}
            >
                <div className="container-field-pickView"
                    style={{ width: "webkit-fill-available", position: "relative" }}
                >
                    <CmpFieldSelect
                        id={id}
                        value={selectedId}
                        label="Selecciona una opción"
                        onChange={(id, text) => handleSelect(id, text)}
                        foreignDao={foreignDao}
                        mandatory={mandatory}
                    />

                    {selectedId && formFieldsMap[selectedId] && (
                        <CmpFormGenerate
                            key={selectedId}
                            fields={formFieldsMap[selectedId]}
                            storedValues={storedValues} //  Se actualizan los valores dinámicamente al abrir
                            onSubmit={(formData) => {
                                setFormValues((prev) => ({
                                    ...prev,
                                    [selectedId]: formData, //  Guarda los datos con el ID seleccionado
                                }));
                                setOpenModal(false);
                            }}
                        />
                    )}
                </div>
            </Modal>

        </div>
    );
};

CmpFieldPickView.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    foreignDao: PropTypes.object.isRequired,
    mandatory: PropTypes.bool,
    disabled: PropTypes.bool,
    template: PropTypes.string,
    formFieldsMap: PropTypes.object.isRequired,
};
