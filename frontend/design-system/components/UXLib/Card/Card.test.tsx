import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Card } from './Card'

vi.mock('../styles/cmpStyles.scss', () => ({}))

const renderCard = (props = {}) => {
    return render(<Card id="test-card" {...props} />)
}

describe('Card - General Tests', () => {
    describe('Basic rendering', () => {
        it('should render the card correctly', () => {
            const { container } = renderCard()
            expect(container.querySelector('.card')).toBeInTheDocument()
        })

        it('should render with id', () => {
            renderCard()
            expect(document.querySelector('#test-card')).toBeInTheDocument()
        })

        it('should render title', () => {
            renderCard({ title: 'Card Title' })
            expect(screen.getByText('Card Title')).toBeInTheDocument()
        })

        it('should render subtitle', () => {
            renderCard({ subtitle: 'Card Subtitle' })
            expect(screen.getByText('Card Subtitle')).toBeInTheDocument()
        })

        it('should render children', () => {
            render(
                <Card id="test-card">
                    <p>Card content</p>
                </Card>
            )
            expect(screen.getByText('Card content')).toBeInTheDocument()
        })

        it('should render footer', () => {
            renderCard({ footer: <button>Action</button> })
            expect(screen.getByText('Action')).toBeInTheDocument()
        })

        it('should render header actions', () => {
            renderCard({
                title: 'Title',
                headerActions: <button>Menu</button>
            })
            expect(screen.getByText('Menu')).toBeInTheDocument()
        })
    })

    describe('Variants', () => {
        it('should apply elevated variant by default', () => {
            const { container } = renderCard()
            expect(container.querySelector('.card--elevated')).toBeInTheDocument()
        })

        it('should apply outlined variant', () => {
            const { container } = renderCard({ variant: 'outlined' })
            expect(container.querySelector('.card--outlined')).toBeInTheDocument()
        })

        it('should apply filled variant', () => {
            const { container } = renderCard({ variant: 'filled' })
            expect(container.querySelector('.card--filled')).toBeInTheDocument()
        })
    })

    describe('Sizes', () => {
        it('should apply medium size by default', () => {
            const { container } = renderCard()
            expect(container.querySelector('.card--medium')).toBeInTheDocument()
        })

        it('should apply small size', () => {
            const { container } = renderCard({ size: 'small' })
            expect(container.querySelector('.card--small')).toBeInTheDocument()
        })

        it('should apply large size', () => {
            const { container } = renderCard({ size: 'large' })
            expect(container.querySelector('.card--large')).toBeInTheDocument()
        })
    })

    describe('Click functionality', () => {
        it('should call onClick when clicked', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn()
            renderCard({ onClick: handleClick })

            const card = document.querySelector('#test-card')!
            await user.click(card)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should have clickable class when onClick is provided', () => {
            const { container } = renderCard({ onClick: vi.fn() })
            expect(container.querySelector('.card--clickable')).toBeInTheDocument()
        })

        it('should have button role when clickable', () => {
            renderCard({ onClick: vi.fn() })
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        it('should have article role when not clickable', () => {
            renderCard()
            expect(screen.getByRole('article')).toBeInTheDocument()
        })
    })

    describe('Media', () => {
        it('should render image media', () => {
            const { container } = renderCard({
                media: 'https://example.com/image.jpg',
                mediaAlt: 'Test image'
            })
            const img = container.querySelector('.card__media img')
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('alt', 'Test image')
        })

        it('should render custom media element', () => {
            renderCard({ media: <video data-testid="video">Video</video> })
            expect(screen.getByTestId('video')).toBeInTheDocument()
        })
    })

    describe('Custom styles', () => {
        it('should apply custom className', () => {
            const { container } = renderCard({ className: 'custom-card' })
            expect(container.querySelector('.custom-card')).toBeInTheDocument()
        })

        it('should apply custom style', () => {
            const { container } = renderCard({ style: { backgroundColor: 'red' } })
            const card = container.querySelector('.card')
            expect(card?.getAttribute('style')).toContain('background-color: red')
        })
    })
})
