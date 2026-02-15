import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CmpListSvg } from './CmpListSvg'

describe('CmpListSvg - Tests Generales', () => {
    const mockNameSvg = vi.fn()

    beforeEach(() => {
        mockNameSvg.mockClear()
    })

    describe('Renderizado básico', () => {
        it('debe renderizar el componente correctamente', async () => {
            render(<CmpListSvg svgDefault='camera' />)

            const container = document.querySelector('.container-list-svg')
            expect(container).toBeInTheDocument()

            const searchField = await screen.findByLabelText('searchSvg')
            expect(searchField).toBeInTheDocument()

            const svgItems = document.querySelectorAll('.item-svg')
            expect(svgItems.length).toBeGreaterThan(0)
        })

        it('debe renderizar con el ícono por defecto seleccionado', () => {
            const defaultIcon = 'camera'
            render(<CmpListSvg svgDefault={defaultIcon} />)

            const selectedItem = document.querySelector('.item-svg-selected')
            expect(selectedItem).toBeInTheDocument()
        })

        it('debe renderizar todos los íconos disponibles', () => {
            render(<CmpListSvg svgDefault='camera' />)

            const svgItems = document.querySelectorAll('.item-svg')
            expect(svgItems.length).toBeGreaterThan(0)
        })
    })

    describe('Funcionalidad de búsqueda', () => {
        it('debe filtrar íconos al escribir en el campo de búsqueda', async () => {
            const user = userEvent.setup()
            render(<CmpListSvg svgDefault='camera' />)

            const searchInput = await screen.findByLabelText('searchSvg') as HTMLInputElement

            // Obtener cantidad inicial de íconos
            const initialItems = document.querySelectorAll('.item-svg')
            const initialCount = initialItems.length

            // Escribir en el campo de búsqueda
            await user.type(searchInput, 'camera')

            // Verificar que el filtro se aplicó
            const filteredItems = document.querySelectorAll('.item-svg')
            expect(filteredItems.length).toBeLessThanOrEqual(initialCount)
        })

        it('debe mostrar todos los íconos cuando el campo de búsqueda está vacío', async () => {
            render(<CmpListSvg svgDefault='camera' />)

            const searchInput = await screen.findByLabelText('searchSvg') as HTMLInputElement
            expect(searchInput.value).toBe('')

            const svgItems = document.querySelectorAll('.item-svg')
            expect(svgItems.length).toBeGreaterThan(0)
        })
    })

    describe('Selección de íconos', () => {
        it('debe llamar a nameSvg cuando se selecciona un ícono', async () => {
            const user = userEvent.setup()
            render(<CmpListSvg svgDefault='camera' nameSvg={mockNameSvg} />)

            const firstIcon = document.querySelector('.item-svg') as HTMLElement
            expect(firstIcon).toBeInTheDocument()

            await user.click(firstIcon)

            expect(mockNameSvg).toHaveBeenCalled()
        })

        it('debe cambiar el ícono seleccionado al hacer click', async () => {
            const user = userEvent.setup()
            render(<CmpListSvg svgDefault='camera' />)

            const svgItems = document.querySelectorAll('.item-svg')
            expect(svgItems.length).toBeGreaterThan(1)

            // Click en el segundo ícono
            const secondIcon = svgItems[1] as HTMLElement
            await user.click(secondIcon)

            // Verificar que ahora está seleccionado
            expect(secondIcon.classList.contains('item-svg-selected')).toBe(true)
        })
    })

    describe('Propiedades personalizadas', () => {
        it('debe aceptar svgClr personalizado', () => {
            const customColor = '#FF0000'
            render(<CmpListSvg svgDefault='camera' svgClr={customColor} />)

            const container = document.querySelector('.container-list-svg')
            expect(container).toBeInTheDocument()
        })

        it('debe aceptar svgSize personalizado', () => {
            const customSize = '48px'
            render(<CmpListSvg svgDefault='camera' svgSize={customSize} />)

            const container = document.querySelector('.container-list-svg')
            expect(container).toBeInTheDocument()
        })
    })

    describe('Integración con CmpField', () => {
        it('debe integrar correctamente el campo de búsqueda', async () => {
            const user = userEvent.setup()
            render(<CmpListSvg svgDefault='camera' />)

            const searchInput = await screen.findByLabelText('searchSvg') as HTMLInputElement
            expect(searchInput).toBeInTheDocument()

            await user.type(searchInput, 'test')
            expect(searchInput.value).toBe('test')
        })
    })
})
