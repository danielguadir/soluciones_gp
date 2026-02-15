import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Divider } from './Divider'

vi.mock('../styles/cmpStyles.scss', () => ({}))

const renderDivider = (props = {}) => {
    return render(<Divider id="test-divider" {...props} />)
}

describe('Divider - General Tests', () => {
    describe('Basic rendering', () => {
        it('should render the divider correctly', () => {
            renderDivider()
            expect(screen.getByRole('separator')).toBeInTheDocument()
        })

        it('should render with id', () => {
            renderDivider()
            expect(document.querySelector('#test-divider')).toBeInTheDocument()
        })

        it('should have horizontal orientation by default', () => {
            const { container } = renderDivider()
            expect(container.querySelector('.divider--horizontal')).toBeInTheDocument()
        })
    })

    describe('Orientations', () => {
        it('should apply horizontal orientation', () => {
            const { container } = renderDivider({ orientation: 'horizontal' })
            expect(container.querySelector('.divider--horizontal')).toBeInTheDocument()
        })

        it('should apply vertical orientation', () => {
            const { container } = renderDivider({ orientation: 'vertical' })
            expect(container.querySelector('.divider--vertical')).toBeInTheDocument()
        })

        it('should have correct aria-orientation', () => {
            renderDivider({ orientation: 'vertical' })
            expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
        })
    })

    describe('Variants', () => {
        it('should apply solid variant by default', () => {
            const { container } = renderDivider()
            expect(container.querySelector('.divider--solid')).toBeInTheDocument()
        })

        it('should apply dashed variant', () => {
            const { container } = renderDivider({ variant: 'dashed' })
            expect(container.querySelector('.divider--dashed')).toBeInTheDocument()
        })

        it('should apply dotted variant', () => {
            const { container } = renderDivider({ variant: 'dotted' })
            expect(container.querySelector('.divider--dotted')).toBeInTheDocument()
        })
    })

    describe('Label', () => {
        it('should render label when provided', () => {
            renderDivider({ label: 'OR' })
            expect(screen.getByText('OR')).toBeInTheDocument()
        })

        it('should have with-label class when label is provided', () => {
            const { container } = renderDivider({ label: 'OR' })
            expect(container.querySelector('.divider--with-label')).toBeInTheDocument()
        })

        it('should apply label position', () => {
            const { container } = renderDivider({ label: 'OR', labelPosition: 'left' })
            expect(container.querySelector('.divider--label-left')).toBeInTheDocument()
        })

        it('should not render label for vertical orientation', () => {
            renderDivider({ label: 'OR', orientation: 'vertical' })
            expect(screen.queryByText('OR')).not.toBeInTheDocument()
        })
    })

    describe('Custom styles', () => {
        it('should apply custom className', () => {
            const { container } = renderDivider({ className: 'custom-divider' })
            expect(container.querySelector('.custom-divider')).toBeInTheDocument()
        })

        it('should apply custom color via CSS variable', () => {
            const { container } = renderDivider({ color: 'red' })
            const divider = container.querySelector('.divider')
            expect(divider?.getAttribute('style')).toContain('--divider-color: red')
        })

        it('should apply custom thickness via CSS variable', () => {
            const { container } = renderDivider({ thickness: '2px' })
            const divider = container.querySelector('.divider')
            expect(divider?.getAttribute('style')).toContain('--divider-thickness: 2px')
        })

        it('should apply custom spacing via CSS variable', () => {
            const { container } = renderDivider({ spacing: '2rem' })
            const divider = container.querySelector('.divider')
            expect(divider?.getAttribute('style')).toContain('--divider-spacing: 2rem')
        })
    })
})
