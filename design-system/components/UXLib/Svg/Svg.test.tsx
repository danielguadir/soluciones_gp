import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Svg } from './Svg'

// Helper para renderizar el ícono SVG
const renderSvg = (props = {}) => {
    return render(<Svg icon='plus' title='test-icon' {...props} />)
}

describe('Svg - Tests Generales', () => {
    describe('Renderizado básico', () => {
        it('debe renderizar el ícono correctamente', () => {
            renderSvg({ icon: 'plus' })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toBeInTheDocument()
        })

        it('debe aplicar la clase del ícono correctamente', () => {
            const iconName = 'heart'
            renderSvg({ icon: iconName })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveClass(`icon-${iconName}`)
        })

        it('debe renderizar con el título proporcionado', () => {
            const customTitle = 'Mi Ícono'
            renderSvg({ title: customTitle })

            const iconElement = screen.getByTitle(customTitle)
            expect(iconElement).toBeInTheDocument()
        })
    })

    describe('Estilos personalizados', () => {
        it('debe aplicar el color personalizado', () => {
            const customColor = 'red'
            renderSvg({ color: customColor })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveStyle({ color: 'rgb(255, 0, 0)' })
        })

        it('debe aplicar el tamaño de fuente personalizado', () => {
            const fontSize = '24px'
            renderSvg({ fontSize })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveStyle({ fontSize })
            expect(iconElement.getAttribute('style')).toContain(`font-size: ${fontSize}`)
        })

        it('debe aplicar el cursor personalizado', () => {
            const cursor = 'pointer'
            renderSvg({ cursor })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveStyle({ cursor })
            expect(iconElement.getAttribute('style')).toContain(`cursor: ${cursor}`)
        })

        it('debe aplicar múltiples estilos simultáneamente', () => {
            const styles = {
                color: 'blue',
                fontSize: '32px',
                cursor: 'pointer',
            }
            renderSvg(styles)

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveStyle({
                color: 'rgb(0, 0, 255)',
                fontSize: styles.fontSize,
                cursor: styles.cursor,
            })
        })
    })

    describe('Funcionalidad de click', () => {
        it('debe llamar a onClick cuando se hace click', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn()
            renderSvg({ onClick: handleClick })

            const iconElement = screen.getByTitle('test-icon')
            await user.click(iconElement)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('debe llamar a onClick múltiples veces', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn()
            renderSvg({ onClick: handleClick })

            const iconElement = screen.getByTitle('test-icon')
            await user.click(iconElement)
            await user.click(iconElement)
            await user.click(iconElement)

            expect(handleClick).toHaveBeenCalledTimes(3)
        })

        it('NO debe llamar a onClick cuando no se proporciona', async () => {
            const user = userEvent.setup()
            renderSvg()

            const iconElement = screen.getByTitle('test-icon')
            // No debería lanzar error al hacer click sin onClick
            await user.click(iconElement)

            expect(iconElement).toBeInTheDocument()
        })
    })

    describe('Diferentes tipos de íconos', () => {
        const iconTypes = [
            'plus',
            'heart',
            'home',
            'user',
            'star',
            'search',
            'settings',
        ]

        iconTypes.forEach((iconType) => {
            it(`debe renderizar el ícono ${iconType} correctamente`, () => {
                renderSvg({ icon: iconType })

                const iconElement = screen.getByTitle('test-icon')
                expect(iconElement).toHaveClass(`icon-${iconType}`)
            })
        })
    })

    describe('Propiedades de className', () => {
        it('debe aplicar className personalizado', () => {
            const customClass = 'my-custom-icon'
            renderSvg({ className: customClass })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveClass(customClass)
        })

        it('debe combinar className con la clase del ícono', () => {
            const customClass = 'custom-class'
            const iconName = 'star'
            renderSvg({ className: customClass, icon: iconName })

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toHaveClass(customClass)
            expect(iconElement).toHaveClass(`icon-${iconName}`)
        })
    })

    describe('Casos edge', () => {
        it('debe manejar íconos sin título', () => {
            render(<Svg icon='plus' />)

            // El ícono debería renderizarse aunque no tenga título
            const iconElement = document.querySelector('.icon-plus')
            expect(iconElement).toBeInTheDocument()
        })

        it('debe manejar valores por defecto', () => {
            renderSvg()

            const iconElement = screen.getByTitle('test-icon')
            expect(iconElement).toBeInTheDocument()
        })
    })
})
