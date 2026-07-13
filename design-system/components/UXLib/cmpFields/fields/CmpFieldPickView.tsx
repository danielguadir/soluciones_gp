"use client";
import React, { useState, useEffect } from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { CmpFieldSelect } from "./CmpFieldSelect";
import { Modal } from "../../Modal/Modal";
import { CmpFormGenerate, type FormField } from "./utilsField/CmpFormGenerate";

const ICONS = { PICKVIEW: "th-list" };

interface CmpFieldPickViewProps {
    id?: string;
    label?: string;
    value?: string | number;
    onChange?: (id: string | number | boolean | null | undefined, text: string | undefined) => void;
    getValue?: (id: string | number | boolean | null | undefined, text: string | undefined) => void;
    foreignDao?: Record<string, string>;
    mandatory?: boolean;
    disabled?: boolean;
    template?: string;
    formFieldsMap?: Record<string, FormField[]>;
}

export const CmpFieldPickView: React.FC<CmpFieldPickViewProps> = ({
    id,
    label,
    value,
    onChange,
    getValue,
    foreignDao = {},
    mandatory,
    disabled,
    template,
    formFieldsMap = {},
}) => {
    const [openModal, setOpenModal] = useState(false);
    const selectedValue = value != null ? String(value) : "";
    const [selectedId, setSelectedId] = useState<string>(selectedValue);
    const [selectedLabel, setSelectedLabel] = useState<string>(foreignDao?.[selectedValue] || "");

    const [storedValues, setStoredValues] = useState<Record<string, unknown>>({});
    const [formValues, setFormValues] = useState<Record<string, unknown>>({});

    useEffect(() => {
        if (selectedId && formValues[selectedId]) {
            setStoredValues(formValues[selectedId] as Record<string, unknown>);
        } else {
            setStoredValues({});
        }
    }, [selectedId, openModal, formValues]);

    const handleSelect = (id: string | number | boolean | null | undefined, text: string | undefined) => {
        const normalizedId = id != null ? String(id) : "";
        setSelectedId(normalizedId);
        setSelectedLabel(text || "");
        getValue?.(id, text);
        onChange?.(id, text);
    };

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
                <div className="container-field-pickView" style={{ width: "webkit-fill-available", position: "relative" }}>
                    <CmpFieldSelect
                        id={id}
                        value={selectedId}
                        label="Selecciona una opción"
                        onChange={(itemId, text) => handleSelect(itemId, text)}
                        foreignDao={foreignDao}
                        mandatory={mandatory}
                    />

                    {selectedId && formFieldsMap[selectedId] && (
                        <CmpFormGenerate
                            key={selectedId}
                            fields={formFieldsMap[selectedId]}
                            storedValues={storedValues}
                            onSubmit={(formData) => {
                                setFormValues((prev) => ({
                                    ...prev,
                                    [selectedId]: formData,
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

