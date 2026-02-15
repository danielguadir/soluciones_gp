import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ButtonSwt } from './ButtonSwt'


// Mock styles
vi.mock('../styles/cmpStyles.scss', () => ({}))

// Mock de Button
vi.mock('./Button', () => ({
  Button: ({
    className,
    onClick,
    nameBtn,
    color,
  }: {
    className: string
    onClick: () => void
    nameBtn: string
    color: string
  }) => (
    <button className={className} onClick={onClick} color={color} data-testid='btns'>
      {nameBtn}
    </button>
  ),
}))

// Botones por defecto
const DEFAULT_BUTTONS = ['UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO']

// Helper para renderizar CmpButtonSwt
const renderButtonSwt = (props = {}) => {
  return render(<ButtonSwt onCallBack={() => { }} {...props} />)
}

describe('CmpButtonSwt - Tests Generales', () => {
  describe('Renderizado básico', () => {
    it('debe renderizar 5 botones por defecto', () => {
      renderButtonSwt()

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('debe renderizar con los textos por defecto', () => {
      renderButtonSwt()

      const buttons = screen.getAllByTestId('btns')
      expect(buttons[0]).toHaveTextContent('UNO')
      expect(buttons[1]).toHaveTextContent('DOS')
      expect(buttons[2]).toHaveTextContent('TRES')
      expect(buttons[3]).toHaveTextContent('CUATRO')
      expect(buttons[4]).toHaveTextContent('CINCO')
    })

    it('debe renderizar con botones personalizados', () => {
      const customBtns = ['A', 'B', 'C']
      renderButtonSwt({ btns: customBtns })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons).toHaveLength(3)
      expect(buttons[0]).toHaveTextContent('A')
      expect(buttons[1]).toHaveTextContent('B')
      expect(buttons[2]).toHaveTextContent('C')
    })
  })

  describe('Funcionalidad de click', () => {
    it('debe llamar a onCallBack cuando se hace click en un botón', async () => {
      const user = userEvent.setup()
      const mockCallBack = vi.fn()
      renderButtonSwt({
        btns: DEFAULT_BUTTONS,
        onCallBack: mockCallBack,
        btnInit: 0,
      })

      const buttons = screen.getAllByTestId('btns')
      await user.click(buttons[2])

      expect(mockCallBack).toHaveBeenCalledTimes(1)
      expect(mockCallBack).toHaveBeenCalledWith({ name: 'TRES', position: 2 })
    })

    it('debe llamar a onCallBack con la información correcta del botón', async () => {
      const user = userEvent.setup()
      const mockCallBack = vi.fn()
      renderButtonSwt({
        btns: DEFAULT_BUTTONS,
        onCallBack: mockCallBack,
      })

      const buttons = screen.getAllByTestId('btns')
      await user.click(buttons[0])

      expect(mockCallBack).toHaveBeenCalledWith({ name: 'UNO', position: 0 })
    })

    it('debe llamar a onCallBack para cada botón clickeado', async () => {
      const user = userEvent.setup()
      const mockCallBack = vi.fn()
      renderButtonSwt({
        btns: ['A', 'B', 'C'],
        onCallBack: mockCallBack,
      })

      const buttons = screen.getAllByTestId('btns')

      await user.click(buttons[0])
      expect(mockCallBack).toHaveBeenLastCalledWith({ name: 'A', position: 0 })

      await user.click(buttons[1])
      expect(mockCallBack).toHaveBeenLastCalledWith({ name: 'B', position: 1 })

      await user.click(buttons[2])
      expect(mockCallBack).toHaveBeenLastCalledWith({ name: 'C', position: 2 })

      expect(mockCallBack).toHaveBeenCalledTimes(3)
    })
  })

  describe('Selección inicial (btnInit)', () => {
    it('debe marcar el primer botón como seleccionado por defecto', () => {
      renderButtonSwt({ btnInit: 0 })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons[0]).toHaveClass('btn-init')
    })

    it('debe marcar el botón especificado como seleccionado', () => {
      renderButtonSwt({ btnInit: 3 })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons[3]).toHaveClass('btn-selected')
    })

    it('debe marcar el último botón como seleccionado', () => {
      renderButtonSwt({ btnInit: 4 })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons[4]).toHaveClass('btn-end')
    })

  })

  describe('Propiedades de estilo', () => {
    it('debe aplicar clases CSS a los botones', () => {
      renderButtonSwt()

      const buttons = screen.getAllByTestId('btns')
      const button = buttons[0]
      expect(button).toHaveClass('btn-item')
    })

    it('debe aplicar la clase btn-init al primer botón cuando btnInit es 0', () => {
      renderButtonSwt({ btnInit: 0 })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons[0]).toHaveClass('btn-init')
    })

    it('debe aplicar la clase btn-end al último botón cuando btnInit es 4', () => {
      renderButtonSwt({ btnInit: 4 })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons[4]).toHaveClass('btn-end')
    })
  })

  describe('Casos edge', () => {
    it('debe manejar un solo botón', () => {
      renderButtonSwt({ btns: ['ÚNICO'] })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons).toHaveLength(1)
      expect(buttons[0]).toHaveTextContent('ÚNICO')
    })

    it('debe manejar muchos botones', () => {
      const manyButtons = Array.from({ length: 10 }, (_, i) => `BTN${i + 1}`)
      renderButtonSwt({ btns: manyButtons })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons).toHaveLength(10)
    })

    it('debe manejar botones con textos vacíos', () => {
      renderButtonSwt({ btns: ['', 'B', ''] })

      const buttons = screen.getAllByTestId('btns')
      expect(buttons).toHaveLength(3)
    })
  })
})
