import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'


// Mock styles
vi.mock('../styles/cmpStyles.scss', () => ({}))

// Mock de Svg
vi.mock('../Svg/Svg', () => ({
  Svg: ({ icon, className }: { icon: string; className: string }) => (
    <i className={`${className} icon-${icon}`} data-testid="svg-mock" />
  ),
}))

// Helper para renderizar el botón
const renderButton = (props = {}) => {
  return render(<Button id='test-button' {...props} />)
}

describe('Button - Tests Generales', () => {
  describe('Renderizado básico', () => {
    it('debe renderizar el botón correctamente', () => {
      renderButton({ nameBtn: 'Haz clic aquí' })

      const button = screen.getByRole('button', { name: /Btn-test-button/i })
      expect(button).toBeInTheDocument()
    })

    it('debe renderizar con el texto proporcionado', () => {
      const buttonText = 'Mi Botón'
      renderButton({ nameBtn: buttonText })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Funcionalidad de click', () => {
    it('debe llamar a onClick cuando se hace clic', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      renderButton({ nameBtn: 'Clic', onClick: handleClick })

      const button = screen.getByRole('button', { name: /Btn-test-button/i })
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('NO debe llamar a onClick cuando está deshabilitado', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      renderButton({ nameBtn: 'Desactivado', onClick: handleClick, disabled: true })

      const button = screen.getByRole('button', { name: /Btn-test-button/i })
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Estado disabled', () => {
    it('debe estar deshabilitado cuando disabled es true', () => {
      renderButton({ nameBtn: 'Desactivado', disabled: true })

      const button = screen.getByRole('button', { name: /Btn-test-button/i })
      expect(button).toBeDisabled()
    })

    it('debe estar habilitado cuando disabled es false', () => {
      renderButton({ nameBtn: 'Habilitado', disabled: false })

      const button = screen.getByRole('button', { name: /Btn-test-button/i })
      expect(button).not.toBeDisabled()
    })

    it('debe estar habilitado por defecto', () => {
      renderButton({ nameBtn: 'Por Defecto' })

      const button = screen.getByRole('button', { name: /Btn-test-button/i })
      expect(button).not.toBeDisabled()
    })
  })

  describe('Renderizado de íconos', () => {
    const iconPositions = [
      { position: 'left', expectedClass: 'btn-icon--left' },
      { position: 'right', expectedClass: 'btn-icon--right' },
      { position: 'center', expectedClass: 'btn-icon--center' },
    ]

    iconPositions.forEach(({ position, expectedClass }) => {
      it(`debe renderizar ícono a la ${position}`, () => {
        renderButton({
          nameBtn: 'Con Icono',
          icon: 'user',
          iconPosition: position,
        })

        const icon = screen.getByTestId('svg-mock')
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveClass(expectedClass)
      })
    })

    it('debe renderizar el ícono correcto', () => {
      const iconName = 'heart'
      renderButton({
        nameBtn: 'Con Icono',
        icon: iconName,
        iconPosition: 'left',
      })

      const icon = screen.getByTestId('svg-mock')
      expect(icon).toHaveClass(`icon-${iconName}`)
    })

    it('NO debe renderizar ícono cuando no se proporciona', () => {
      renderButton({ nameBtn: 'Sin Icono' })

      const icon = screen.queryByTestId('svg-mock')
      expect(icon).not.toBeInTheDocument()
    })
  })

  describe('Variantes de botón', () => {
    it('debe aplicar la variante contained', () => {
      renderButton({ nameBtn: 'Contained', variant: 'contained' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn--contained')
    })

    it('debe aplicar la variante outlined', () => {
      renderButton({ nameBtn: 'Outlined', variant: 'outlined' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn--outlined')
    })

    it('debe aplicar la variante text', () => {
      renderButton({ nameBtn: 'Text', variant: 'text' })

      const button = screen.getByRole('button')
      expect(button).toHaveClass('btn--text')
    })
  })

  describe('Propiedades de color', () => {
    it('debe aplicar el color personalizado', () => {
      const customColor = 'primary'
      renderButton({ nameBtn: 'Color', color: customColor })

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Clases CSS personalizadas', () => {
    it('debe aplicar className personalizado', () => {
      const customClass = 'my-custom-button'
      renderButton({ nameBtn: 'Custom', className: customClass })

      const button = screen.getByRole('button')
      expect(button).toHaveClass(customClass)
    })
  })
})
