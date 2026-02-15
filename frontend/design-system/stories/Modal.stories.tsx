import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../components/UXLib/Modal/Modal';
import { Button } from '../components/UXLib/Button/Button';
import { useState } from 'react';

const meta = {
    title: 'UXLib/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: { control: 'boolean' },
        title: { control: 'text' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        closeOnOverlayClick: { control: 'boolean' },
        showHeader: { control: 'boolean' },
        showFooter: { control: 'boolean' },
        confirmText: { control: 'text' },
        cancelText: { control: 'text' },
        onClose: { action: 'closed' },
        onConfirm: { action: 'confirmed' },
        onCancel: { action: 'cancelled' },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state in Storybook
const ModalWrapper = (args: Story['args']) => {
    const [isOpen, setIsOpen] = useState(args?.isOpen || false);

    return (
        <div>
            <Button
                nameBtn="Open Modal"
                onClick={() => setIsOpen(true)}
                variant="contained"
            />
            <Modal
                {...args}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                {args?.children}
            </Modal>
        </div>
    );
};

export const Default: Story = {
    args: {
        title: 'Basic Modal',
        children: <p>This is a basic modal content. You can put anything here.</p>,
        isOpen: false,
        onClose: () => { },
    },
    render: (args) => <ModalWrapper {...args} />
};

export const WithDefaultFooter: Story = {
    args: {
        title: 'Modal con Footer',
        children: <p>Este modal tiene botones de Cancelar y Aceptar automáticos.</p>,
        isOpen: false,
        onClose: () => { },
        showFooter: true,
        onConfirm: () => alert('Confirmado!'),
    },
    render: (args) => <ModalWrapper {...args} />
};

export const WithCustomFooter: Story = {
    args: {
        title: 'Modal with Custom Footer',
        children: <p>This modal has a custom footer with actions.</p>,
        isOpen: false,
        onClose: () => { },
        footer: (
            <>
                <Button nameBtn="Cancelar" variant="text" onClick={() => { }} />
                <Button nameBtn="Guardar" variant="contained" onClick={() => { }} />
            </>
        )
    },
    render: (args) => <ModalWrapper {...args} />
};

export const WithoutHeader: Story = {
    args: {
        children: (
            <div>
                <h4 style={{ marginTop: 0 }}>Contenido sin cabecera</h4>
                <p>Este modal no tiene la cabecera con título y botón de cerrar.</p>
            </div>
        ),
        isOpen: false,
        onClose: () => { },
        showHeader: false,
        showFooter: true,
        onConfirm: () => { },
    },
    render: (args) => <ModalWrapper {...args} />
};

export const HeaderOnly: Story = {
    args: {
        title: 'Solo Cabecera',
        children: <p>Este modal solo tiene cabecera, sin footer.</p>,
        isOpen: false,
        onClose: () => { },
        showHeader: true,
        showFooter: false,
    },
    render: (args) => <ModalWrapper {...args} />
};

export const ContentOnly: Story = {
    args: {
        children: (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Solo Contenido</h4>
                <p>Este modal no tiene cabecera ni footer.</p>
                <p>Puedes cerrar haciendo clic fuera del modal.</p>
            </div>
        ),
        isOpen: false,
        onClose: () => { },
        showHeader: false,
        showFooter: false,
    },
    render: (args) => <ModalWrapper {...args} />
};

export const SizeSmall: Story = {
    args: {
        title: 'Small Modal',
        size: 'small',
        children: <p>Small modal variant.</p>,
        isOpen: false,
        onClose: () => { },
    },
    render: (args) => <ModalWrapper {...args} />
};

export const SizeLarge: Story = {
    args: {
        title: 'Large Modal',
        size: 'large',
        children: (
            <div>
                <p>Large modal variant.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        ),
        isOpen: false,
        onClose: () => { },
        showFooter: true,
        onConfirm: () => { },
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
    },
    render: (args) => <ModalWrapper {...args} />
};
