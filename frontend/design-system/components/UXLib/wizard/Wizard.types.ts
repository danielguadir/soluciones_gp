import type { ReactNode, CSSProperties } from "react";

export type WizardStepSize = "normal" | "small";

export interface WizardStep {
    /** Step number/label displayed in the stepper */
    label: string | number;
    /** Step title displayed below the stepper circle */
    title: string;
    /** Optional icon name for the step (used when iconStep is true) */
    icon?: string;
}

export interface WizardProps {
    /** Unique identifier for the wizard */
    id?: string;
    /** Content for each wizard step - should be an array of ReactNode */
    children: ReactNode[];
    /** Array of step configuration objects */
    steps: WizardStep[];
    /** Title displayed at the top of the wizard */
    title?: string;
    /** Width of the wizard container */
    width?: string;
    /** Size of the step indicators */
    stepSize?: WizardStepSize;
    /** Custom width for the stepper section */
    stepperWidth?: string;
    /** Show icons instead of numbers in steps */
    showStepIcons?: boolean;
    /** Text for the back button */
    backButtonText?: string;
    /** Text for the next button */
    nextButtonText?: string;
    /** Text for the done/finish button */
    doneButtonText?: string;
    /** Callback when wizard is completed */
    onComplete?: () => void;
    /** Callback when wizard is closed */
    onClose?: () => void;
    /** Custom styles for the wizard container */
    style?: CSSProperties;
    /** Additional CSS class name */
    className?: string;
    /** Current step index (controlled mode) */
    currentStep?: number;
    /** Callback when step changes (controlled mode) */
    onStepChange?: (step: number) => void;
}
