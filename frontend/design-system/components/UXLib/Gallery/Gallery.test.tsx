import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Gallery } from './Gallery'
import type { GalleryItem } from './Gallery.types'

vi.mock('../styles/cmpStyles.scss', () => ({}))

const mockItems: GalleryItem[] = [
    { src: 'image1.jpg', alt: 'Image 1', caption: 'Caption 1' },
    { src: 'image2.jpg', alt: 'Image 2', caption: 'Caption 2' },
    { src: 'image3.jpg', alt: 'Image 3', caption: 'Caption 3' },
]

const renderGallery = (props = {}) => {
    return render(<Gallery id="test-gallery" items={mockItems} {...props} />)
}

describe('Gallery - General Tests', () => {
    describe('Basic rendering', () => {
        it('should render the gallery correctly', () => {
            renderGallery()
            expect(screen.getByRole('list')).toBeInTheDocument()
        })

        it('should render with id', () => {
            renderGallery()
            expect(document.querySelector('#test-gallery')).toBeInTheDocument()
        })

        it('should render all items', () => {
            renderGallery()
            const items = screen.getAllByRole('listitem')
            expect(items).toHaveLength(3)
        })

        it('should render images with correct src', () => {
            const { container } = renderGallery()
            const images = container.querySelectorAll('.gallery__image')
            expect(images[0]).toHaveAttribute('src', 'image1.jpg')
        })

        it('should render images with alt text', () => {
            renderGallery()
            expect(screen.getByAltText('Image 1')).toBeInTheDocument()
        })
    })

    describe('Captions', () => {
        it('should not show captions by default', () => {
            renderGallery()
            expect(screen.queryByText('Caption 1')).not.toBeInTheDocument()
        })

        it('should show captions when showCaptions is true', () => {
            renderGallery({ showCaptions: true })
            expect(screen.getByText('Caption 1')).toBeInTheDocument()
        })
    })

    describe('Aspect ratios', () => {
        it('should apply 1:1 aspect ratio by default', () => {
            const { container } = renderGallery()
            expect(container.querySelector('.gallery--ratio-1-1')).toBeInTheDocument()
        })

        it('should apply 4:3 aspect ratio', () => {
            const { container } = renderGallery({ aspectRatio: '4:3' })
            expect(container.querySelector('.gallery--ratio-4-3')).toBeInTheDocument()
        })

        it('should apply 16:9 aspect ratio', () => {
            const { container } = renderGallery({ aspectRatio: '16:9' })
            expect(container.querySelector('.gallery--ratio-16-9')).toBeInTheDocument()
        })

        it('should apply auto aspect ratio', () => {
            const { container } = renderGallery({ aspectRatio: 'auto' })
            expect(container.querySelector('.gallery--ratio-auto')).toBeInTheDocument()
        })
    })

    describe('Click functionality', () => {
        it('should call onItemClick when item is clicked', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn()
            renderGallery({ onItemClick: handleClick })

            const items = screen.getAllByRole('listitem')
            await user.click(items[0])

            expect(handleClick).toHaveBeenCalledTimes(1)
            expect(handleClick).toHaveBeenCalledWith(
                mockItems[0],
                0,
                expect.any(Object)
            )
        })

        it('should have clickable class when onItemClick is provided', () => {
            const { container } = renderGallery({ onItemClick: vi.fn() })
            expect(container.querySelector('.gallery__item--clickable')).toBeInTheDocument()
        })

        it('should be focusable when clickable', () => {
            const { container } = renderGallery({ onItemClick: vi.fn() })
            const item = container.querySelector('.gallery__item')
            expect(item).toHaveAttribute('tabindex', '0')
        })
    })

    describe('Custom styles', () => {
        it('should apply custom className', () => {
            const { container } = renderGallery({ className: 'custom-gallery' })
            expect(container.querySelector('.custom-gallery')).toBeInTheDocument()
        })

        it('should apply custom columns via CSS variable', () => {
            const { container } = renderGallery({ columns: 4 })
            const gallery = container.querySelector('.gallery')
            expect(gallery?.getAttribute('style')).toContain('--gallery-columns: 4')
        })

        it('should apply custom gap via CSS variable', () => {
            const { container } = renderGallery({ gap: '2rem' })
            const gallery = container.querySelector('.gallery')
            expect(gallery?.getAttribute('style')).toContain('--gallery-gap: 2rem')
        })
    })

    describe('Thumbnails', () => {
        it('should use thumbnail when provided', () => {
            const itemsWithThumbnails: GalleryItem[] = [
                { src: 'full.jpg', thumbnail: 'thumb.jpg', alt: 'Test' },
            ]
            const { container } = render(
                <Gallery id="test" items={itemsWithThumbnails} />
            )
            const img = container.querySelector('.gallery__image')
            expect(img).toHaveAttribute('src', 'thumb.jpg')
        })
    })

    describe('Empty state', () => {
        it('should render empty gallery', () => {
            const { container } = render(<Gallery id="test" items={[]} />)
            expect(container.querySelector('.gallery')).toBeInTheDocument()
            expect(screen.queryAllByRole('listitem')).toHaveLength(0)
        })
    })
})
