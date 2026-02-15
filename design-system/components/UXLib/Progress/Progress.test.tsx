import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Progress } from './Progress'

vi.mock('../styles/cmpStyles.scss', () => ({}))

const renderProgress = (props = {}) => {
    return render(<Progress id="test-progress" value={50} {...props} />)
}

describe('Progress - General Tests', () => {
    describe('Basic rendering', () => {
        it('should render the progress correctly', () => {
            renderProgress()
            expect(screen.getByRole('progressbar')).toBeInTheDocument()
        })

        it('should render with id', () => {
            renderProgress()
            expect(document.querySelector('#test-progress')).toBeInTheDocument()
        })

        it('should have correct aria attributes', () => {
            renderProgress({ value: 75 })
            const progress = screen.getByRole('progressbar')
            expect(progress).toHaveAttribute('aria-valuenow', '75')
            expect(progress).toHaveAttribute('aria-valuemin', '0')
            expect(progress).toHaveAttribute('aria-valuemax', '100')
        })
    })

    describe('Variants', () => {
        it('should render linear variant by default', () => {
            const { container } = renderProgress()
            expect(container.querySelector('.progress--linear')).toBeInTheDocument()
        })

        it('should render circular variant', () => {
            const { container } = renderProgress({ variant: 'circular' })
            expect(container.querySelector('.progress--circular')).toBeInTheDocument()
        })

        it('should render SVG for circular variant', () => {
            const { container } = renderProgress({ variant: 'circular' })
            expect(container.querySelector('.progress__svg')).toBeInTheDocument()
        })
    })

    describe('Sizes', () => {
        it('should render medium size by default', () => {
            const { container } = renderProgress()
            expect(container.querySelector('.progress--medium')).toBeInTheDocument()
        })

        it('should render small size', () => {
            const { container } = renderProgress({ size: 'small' })
            expect(container.querySelector('.progress--small')).toBeInTheDocument()
        })

        it('should render large size', () => {
            const { container } = renderProgress({ size: 'large' })
            expect(container.querySelector('.progress--large')).toBeInTheDocument()
        })
    })

    describe('Value handling', () => {
        it('should clamp value to 0 minimum', () => {
            renderProgress({ value: -10 })
            const progress = screen.getByRole('progressbar')
            expect(progress).toHaveAttribute('aria-valuenow', '0')
        })

        it('should clamp value to 100 maximum', () => {
            renderProgress({ value: 150 })
            const progress = screen.getByRole('progressbar')
            expect(progress).toHaveAttribute('aria-valuenow', '100')
        })

        it('should apply width for linear progress', () => {
            const { container } = renderProgress({ value: 75 })
            const fill = container.querySelector('.progress__fill')
            expect(fill?.getAttribute('style')).toContain('width: 75%')
        })
    })

    describe('Labels', () => {
        it('should not show label by default', () => {
            const { container } = renderProgress()
            expect(container.querySelector('.progress__label')).not.toBeInTheDocument()
        })

        it('should show percentage label when showLabel is true', () => {
            renderProgress({ showLabel: true })
            expect(screen.getByText('50%')).toBeInTheDocument()
        })

        it('should show custom label', () => {
            renderProgress({ label: 'Loading...' })
            expect(screen.getByText('Loading...')).toBeInTheDocument()
        })

        it('should show label in circular variant', () => {
            renderProgress({ variant: 'circular', showLabel: true })
            expect(screen.getByText('50%')).toBeInTheDocument()
        })
    })

    describe('Indeterminate state', () => {
        it('should apply indeterminate class', () => {
            const { container } = renderProgress({ indeterminate: true })
            expect(container.querySelector('.progress--indeterminate')).toBeInTheDocument()
        })

        it('should not have aria-valuenow when indeterminate', () => {
            renderProgress({ indeterminate: true })
            const progress = screen.getByRole('progressbar')
            expect(progress).not.toHaveAttribute('aria-valuenow')
        })
    })

    describe('Custom styles', () => {
        it('should apply custom className', () => {
            const { container } = renderProgress({ className: 'custom-progress' })
            expect(container.querySelector('.custom-progress')).toBeInTheDocument()
        })

        it('should apply custom color via CSS variable', () => {
            const { container } = renderProgress({ color: 'green' })
            const progress = container.querySelector('.progress')
            expect(progress?.getAttribute('style')).toContain('--progress-color: green')
        })

        it('should apply custom trackColor via CSS variable', () => {
            const { container } = renderProgress({ trackColor: 'lightgray' })
            const progress = container.querySelector('.progress')
            expect(progress?.getAttribute('style')).toContain('--progress-track-color: lightgray')
        })

        it('should apply custom thickness via CSS variable', () => {
            const { container } = renderProgress({ thickness: '8px' })
            const progress = container.querySelector('.progress')
            expect(progress?.getAttribute('style')).toContain('--progress-thickness: 8px')
        })
    })

    describe('Circular variant specifics', () => {
        it('should have track and fill circles', () => {
            const { container } = renderProgress({ variant: 'circular' })
            expect(container.querySelectorAll('circle')).toHaveLength(2)
        })

        it('should apply different sizes to SVG', () => {
            const { container: smallContainer } = render(
                <Progress id="small" value={50} variant="circular" size="small" />
            )
            const { container: largeContainer } = render(
                <Progress id="large" value={50} variant="circular" size="large" />
            )

            const smallSvg = smallContainer.querySelector('.progress__svg')
            const largeSvg = largeContainer.querySelector('.progress__svg')

            expect(smallSvg?.getAttribute('width')).toBe('32')
            expect(largeSvg?.getAttribute('width')).toBe('64')
        })
    })
})
