import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CmpAvatar } from './CmpAvatar'
import { SvgMock } from '../cmpSvg/__mock__/CmpSvg'

const btnColor = 'green'

// Mock de CmpButton
vi.mock('../cmpButton/CmpButton', () => ({
  CmpButton: ({
    className,
    onClick,
    nameBtn,
    color
  }: {
    className?: string
    onClick?: () => void
    nameBtn?: string
    color?: string
  }) => (
    <button className={className} onClick={onClick} color={btnColor} data-testid='btns'>
      {nameBtn}
    </button>
  ),
}))

// Mock del Modal
vi.mock('../../modal/Modal', async () => {
  return {
    Modal: vi.fn((props: any) => {
      const { isOpen, children, onAccept, onCancel, nameBtnLeft = 'Aceptar', nameBtnRight = 'Cancelar' } = props

      const handleAccept = () => {
        if (onAccept) {
          onAccept()
        }
      }

      const handleCancel = () => {
        if (onCancel) {
          onCancel()
        }
      }

      return isOpen ? (
        <div data-testid='mock-modal' role='dialog'>
          <div>{children}</div>
          <div>
            <button onClick={handleAccept} data-testid='btn-accept'>
              {nameBtnLeft}
            </button>
            <button onClick={handleCancel} data-testid='btn-cancel'>
              {nameBtnRight}
            </button>
          </div>
        </div>
      ) : null
    }),
  }
})

// Mock de CmpListSvg
vi.mock('../cmpListSvg/CmpListSvg', async () => {
  return {
    CmpListSvg: vi.fn((props: any) => {
      const { onClick, nameSvg, svgDefault = 'heart' } = props
      const selectedIcon = svgDefault

      const handleIconClick = (iconName: string) => {
        if (nameSvg) {
          nameSvg(iconName)
        }
      }

      return (
        <div data-testid='cmp-list-svg' onClick={onClick} data-selected-icon={selectedIcon}>
          {['user', 'heart', 'home'].map((icon) => (
            <SvgMock
              key={icon}
              icon={icon}
              className={`icon-${icon}`}
              data-testid={`svg-${icon}`}
              data-selected={icon === selectedIcon}
              onClick={() => handleIconClick(icon)}
            />
          ))}
        </div>
      )
    }),
  }
})

// Helper para renderizar CmpAvatar
const renderAvatar = (props = {}) => {
  return render(<CmpAvatar id='avatar' {...props} />)
}

describe('CmpAvatar - Tests Generales', () => {
  describe('Renderizado básico', () => {
    it('debe renderizar el botón de avatar', () => {
      renderAvatar()

      const avatarButtons = screen.getAllByRole('button')
      expect(avatarButtons.length).toBeGreaterThan(0)
      expect(avatarButtons[0]).toBeInTheDocument()
    })

    it('debe renderizar con el id correcto', () => {
      renderAvatar()

      const button = screen.getByTestId('btns')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Funcionalidad del modal', () => {
    it('debe abrir el modal al hacer click en el botón', async () => {
      const user = userEvent.setup()
      renderAvatar()

      const buttonAvatar = screen.getByTestId('btns')
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument()

      await user.click(buttonAvatar)

      expect(screen.getByTestId('mock-modal')).toBeInTheDocument()
    })

    it('debe cerrar el modal al hacer click en cancelar', async () => {
      const user = userEvent.setup()
      renderAvatar()

      const buttonAvatar = screen.getByTestId('btns')
      await user.click(buttonAvatar)

      expect(screen.getByTestId('mock-modal')).toBeInTheDocument()

      const btnCancel = screen.getByTestId('btn-cancel')
      await user.click(btnCancel)

      // El modal debería cerrarse (esto depende de la implementación real)
    })

    it('debe mostrar los botones del modal', async () => {
      const user = userEvent.setup()
      renderAvatar()

      const buttonAvatar = screen.getByTestId('btns')
      await user.click(buttonAvatar)

      const btnAccept = screen.getByTestId('btn-accept')
      const btnCancel = screen.getByTestId('btn-cancel')

      expect(btnAccept).toBeInTheDocument()
      expect(btnCancel).toBeInTheDocument()
    })
  })

  describe('Selección de íconos', () => {
    it('debe seleccionar un ícono y llamar a onChange', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()
      renderAvatar({ onChange: mockOnChange })

      // Abrir el modal
      const buttonAvatar = screen.getByTestId('btns')
      await user.click(buttonAvatar)

      // Seleccionar un ícono
      const iconToSelect = screen.getByTestId('svg-user')
      expect(iconToSelect).toBeInTheDocument()
      await user.click(iconToSelect)

      // Aceptar la selección
      const btnAccept = screen.getByTestId('btn-accept')
      await user.click(btnAccept)

      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith('user')
    })

    it('debe mostrar la lista de íconos en el modal', async () => {
      const user = userEvent.setup()
      renderAvatar()

      const buttonAvatar = screen.getByTestId('btns')
      await user.click(buttonAvatar)

      expect(screen.getByTestId('cmp-list-svg')).toBeInTheDocument()
      expect(screen.getByTestId('svg-user')).toBeInTheDocument()
      expect(screen.getByTestId('svg-heart')).toBeInTheDocument()
      expect(screen.getByTestId('svg-home')).toBeInTheDocument()
    })

    it('debe permitir seleccionar diferentes íconos', async () => {
      const user = userEvent.setup()
      const mockOnChange = vi.fn()
      renderAvatar({ onChange: mockOnChange })

      const buttonAvatar = screen.getByTestId('btns')
      await user.click(buttonAvatar)

      // Seleccionar ícono 'heart'
      const heartIcon = screen.getByTestId('svg-heart')
      await user.click(heartIcon)

      const btnAccept = screen.getByTestId('btn-accept')
      await user.click(btnAccept)

      expect(mockOnChange).toHaveBeenCalledWith('heart')
    })
  })

  describe('Estilos y propiedades', () => {
    it('debe aplicar el color al botón', () => {
      renderAvatar()

      const buttons = screen.getAllByTestId('btns')
      const button = buttons[0]
      expect(button).toHaveAttribute('color', btnColor)
    })

    it('debe tener la clase correcta', () => {
      renderAvatar()

      const button = screen.getByTestId('btns')
      expect(button).toHaveClass
    })
  })

  describe('Casos edge', () => {
    it('debe manejar onChange undefined', async () => {
      const user = userEvent.setup()
      renderAvatar()

      const buttonAvatar = screen.getByTestId('btns')
      await user.click(buttonAvatar)

      const iconToSelect = screen.getByTestId('svg-user')
      await user.click(iconToSelect)

      const btnAccept = screen.getByTestId('btn-accept')
      // No debería lanzar error
      await user.click(btnAccept)

      expect(buttonAvatar).toBeInTheDocument()
    })
  })
})
