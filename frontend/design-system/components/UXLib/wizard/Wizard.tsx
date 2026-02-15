import { useState } from "react";
import "../styles/cmpStyles.scss";
import { Button } from "../Button/Button";
import { Svg } from "../Svg/Svg";
import type { WizardProps, WizardStepSize } from "./Wizard.types";

interface StepSizeConfig {
    itemCounter: string;
    iconOkSize: string;
    iconOkMarginSize: string;
    iconNumSize: string;
    stepWidth: string;
}

const STEP_SIZE_CONFIG: Record<WizardStepSize, Omit<StepSizeConfig, 'stepWidth'>> = {
    normal: {
        itemCounter: "35pt",
        iconOkSize: "22pt",
        iconOkMarginSize: "8pt",
        iconNumSize: "22pt",
    },
    small: {
        itemCounter: "25pt",
        iconOkSize: "17pt",
        iconOkMarginSize: "0pt",
        iconNumSize: "15pt",
    },
};

const DEFAULT_STEPPER_WIDTH: Record<WizardStepSize, string> = {
    normal: "100%",
    small: "70%",
};

export const Wizard = ({
    id,
    children,
    steps,
    title = "Title",
    width = "60%",
    stepSize = "normal",
    stepperWidth,
    showStepIcons = false,
    backButtonText = "Anterior",
    nextButtonText = "Siguiente",
    doneButtonText = "Finalizar",
    onComplete,
    onClose,
    style = {},
    className = "",
    currentStep: controlledStep,
    onStepChange,
}: WizardProps) => {
    const [internalStep, setInternalStep] = useState(1);

    // Support both controlled and uncontrolled modes
    const currentStep = controlledStep ?? internalStep;
    const setCurrentStep = (step: number) => {
        if (onStepChange) {
            onStepChange(step);
        } else {
            setInternalStep(step);
        }
    };

    const totalSteps = steps.length;
    const isLastStep = currentStep === totalSteps;
    const isFirstStep = currentStep === 1;

    const stepConfig: StepSizeConfig = {
        ...STEP_SIZE_CONFIG[stepSize],
        stepWidth: stepperWidth || DEFAULT_STEPPER_WIDTH[stepSize],
    };

    const handleNext = () => {
        if (isLastStep) {
            onComplete?.();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getProgressWidth = (): string => {
        if (totalSteps <= 1) return "0%";
        return `${((currentStep - 1) * 100) / (totalSteps - 1)}%`;
    };

    const getStepStatus = (stepIndex: number): "success" | "current" | "pending" => {
        const stepNumber = stepIndex + 1;
        if (currentStep > stepNumber) return "success";
        if (currentStep === stepNumber) return "current";
        return "pending";
    };

    const renderStepIcon = (stepIndex: number, step: typeof steps[0]) => {
        const status = getStepStatus(stepIndex);
        const iconSize = stepConfig.iconOkSize;
        const marginStyle = { marginRight: stepConfig.iconOkMarginSize };

        if (status === "success") {
            return (
                <Svg
                    icon={showStepIcons && step.icon ? step.icon : "ok"}
                    fontSize={iconSize}
                    color={showStepIcons ? "var(--primary-color)" : "white"}
                    className={!showStepIcons ? "icon-success" : ""}
                    style={marginStyle}
                />
            );
        }

        if (showStepIcons && step.icon) {
            return (
                <Svg
                    icon={step.icon}
                    fontSize={iconSize}
                    color={status === "current" ? "var(--primary-color)" : "gray"}
                    style={marginStyle}
                />
            );
        }

        return <span className="number">{step.label}</span>;
    };

    const wizardStyle = {
        "--wizard-size": width,
        "--wizard-itemCounter": stepConfig.itemCounter,
        "--wizard-iconNumSize": stepConfig.iconNumSize,
        "--wizard-stepWidth": stepConfig.stepWidth,
        ...style,
    } as React.CSSProperties;

    return (
        <div
            className={`wrapper-stepper ${className}`}
            aria-label={id ? `wizard-${id}` : "wizard"}
            id={id}
            style={wizardStyle}
        >
            <div className="wrapper-head">
                {onClose && (
                    <div className="wrapper-close">
                        <Svg
                            icon="cancel-circle"
                            fontSize="15pt"
                            color="gray"
                            onClick={onClose}
                            title="Close wizard"
                        />
                    </div>
                )}
                <h1 className="wrapper-title">{title}</h1>
                <div className="stepper">
                    <div className="stepper-progress">
                        <div
                            className="stepper-progress-bar"
                            style={{ width: getProgressWidth(), height: "3pt" }}
                        />
                    </div>
                    {steps.map((step, index) => (
                        <div
                            key={`step-${index}-${step.label}`}
                            className={`stepper-item ${getStepStatus(index)}`}
                        >
                            <div
                                className="stepper-item-counter"
                                style={showStepIcons ? {
                                    border: 0,
                                    backgroundColor: "white",
                                    color: "var(--primary-color)",
                                } : {}}
                            >
                                {renderStepIcon(index, step)}
                            </div>
                            <span className="stepper-item-title">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="WizardHr" />

            <div className="stepper-content">
                <div className="stepper-pane">
                    {Array.isArray(children) ? children[currentStep - 1] : children}
                </div>
            </div>

            <div className="WizardHr" />

            <div className="controls">
                <Button
                    onClick={handleBack}
                    type="button"
                    variant="outlined"
                    disabled={isFirstStep}
                    nameBtn={backButtonText}
                />
                <Button
                    onClick={handleNext}
                    type="button"
                    variant="contained"
                    disabled={false}
                    nameBtn={isLastStep ? doneButtonText : nextButtonText}
                />
            </div>
        </div>
    );
};
