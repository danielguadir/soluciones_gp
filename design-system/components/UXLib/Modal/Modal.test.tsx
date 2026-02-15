import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

// Mock styles
vi.mock('../styles/cmpStyles.scss', () => ({}));

// Mock Svg
vi.mock('../Svg/Svg', () => ({
    Svg: () => <span data-testid="close-icon">X</span>
}));

describe('Modal Component', () => {
    const onCloseMock = vi.fn();

    beforeEach(() => {
        onCloseMock.mockClear();
    });

    it('should not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={onCloseMock}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render correctly when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(
            <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.click(screen.getByTestId('modal-close-btn'));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked (if closeOnOverlayClick is true)', () => {
        render(
            <Modal isOpen={true} onClose={onCloseMock} closeOnOverlayClick={true}>
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.click(screen.getByTestId('modal-overlay'));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClose when overlay is clicked if closeOnOverlayClick is false', () => {
        render(
            <Modal isOpen={true} onClose={onCloseMock} closeOnOverlayClick={false}>
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.click(screen.getByTestId('modal-overlay'));
        expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', () => {
        render(
            <Modal isOpen={true} onClose={onCloseMock}>
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should render footer when provided', () => {
        render(
            <Modal isOpen={true} onClose={onCloseMock} footer={<button>Action</button>}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Action')).toBeInTheDocument();
    });
});
