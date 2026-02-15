import type { Meta, StoryObj } from '@storybook/react';
import { Wizard } from '../components/UXLib/wizard/Wizard';
import type { WizardStep } from '../components/UXLib/wizard/Wizard.types';

const meta = {
    title: 'UXLib/Wizard',
    component: Wizard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        stepSize: { control: 'select', options: ['normal', 'small'] },
        showStepIcons: { control: 'boolean' },
        width: { control: 'text' },
        title: { control: 'text' },
        onComplete: { action: 'completed' },
        onClose: { action: 'closed' },
    },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample steps configuration
const basicSteps: WizardStep[] = [
    { label: 1, title: 'Datos Personales' },
    { label: 2, title: 'Dirección' },
    { label: 3, title: 'Confirmación' },
];

const iconSteps: WizardStep[] = [
    { label: 1, title: 'Usuario', icon: 'user' },
    { label: 2, title: 'Configuración', icon: 'cog' },
    { label: 3, title: 'Seguridad', icon: 'lock' },
    { label: 4, title: 'Finalizar', icon: 'ok-circled' },
];

// Sample step content components
const StepContent = ({ step, title }: { step: number; title: string }) => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0 }}>Paso {step}: {title}</h3>
        <p>Contenido del paso {step}. Aquí puedes agregar formularios, información o cualquier componente.</p>
    </div>
);

export const Default: Story = {
    args: {
        title: 'Asistente de Registro',
        steps: basicSteps,
        width: '600px',
        children: [
            <StepContent key="1" step={1} title="Datos Personales" />,
            <StepContent key="2" step={2} title="Dirección" />,
            <StepContent key="3" step={3} title="Confirmación" />,
        ],
        onComplete: () => alert('¡Wizard completado!'),
        onClose: () => alert('Wizard cerrado'),
    },
};

export const WithIcons: Story = {
    args: {
        title: 'Configuración de Cuenta',
        steps: iconSteps,
        width: '700px',
        showStepIcons: true,
        children: [
            <StepContent key="1" step={1} title="Usuario" />,
            <StepContent key="2" step={2} title="Configuración" />,
            <StepContent key="3" step={3} title="Seguridad" />,
            <StepContent key="4" step={4} title="Finalizar" />,
        ],
        onComplete: () => alert('¡Configuración completada!'),
        onClose: () => alert('Wizard cerrado'),
    },
};

export const SmallSize: Story = {
    args: {
        title: 'Wizard Pequeño',
        steps: basicSteps,
        width: '500px',
        stepSize: 'small',
        children: [
            <StepContent key="1" step={1} title="Datos Personales" />,
            <StepContent key="2" step={2} title="Dirección" />,
            <StepContent key="3" step={3} title="Confirmación" />,
        ],
        onComplete: () => alert('¡Completado!'),
    },
};

export const CustomButtonLabels: Story = {
    args: {
        title: 'Wizard con Botones Personalizados',
        steps: basicSteps,
        width: '600px',
        backButtonText: 'Volver',
        nextButtonText: 'Continuar',
        doneButtonText: 'Terminar',
        children: [
            <StepContent key="1" step={1} title="Datos Personales" />,
            <StepContent key="2" step={2} title="Dirección" />,
            <StepContent key="3" step={3} title="Confirmación" />,
        ],
        onComplete: () => alert('¡Proceso terminado!'),
        onClose: () => alert('Cancelado'),
    },
};

export const TwoSteps: Story = {
    args: {
        title: 'Wizard Simple',
        steps: [
            { label: 1, title: 'Inicio' },
            { label: 2, title: 'Fin' },
        ],
        width: '500px',
        children: [
            <div key="1" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Bienvenido</h3>
                <p>Este es un wizard de solo dos pasos.</p>
            </div>,
            <div key="2" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>¡Listo!</h3>
                <p>Has completado el proceso.</p>
            </div>,
        ],
        onComplete: () => alert('¡Completado!'),
    },
};
