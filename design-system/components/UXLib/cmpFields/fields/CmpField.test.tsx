import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { CmpField } from '../CmpField'

// Constantes para mensajes de validación
const VALIDATION_MESSAGE = 'Campo requerido'

// Helper para renderizar múltiples campos con las mismas props
const renderMultipleFields = (props: Partial<React.ComponentProps<typeof CmpField>> = {}) => {
  return render(
    <>
      <CmpField type='text' id='TextField' label='Text Field' {...props} />
      <CmpField type='number' id='NumberField' label='Number Field' {...props} />
      <CmpField type='location' id='LocationField' label='Location Field' {...props} />
      <CmpField type='password' id='PasswordField' label='Password Field' {...props} />
      <CmpField type='foreign' id='ForeignField' label='Foreign Field' {...props} />
      <CmpField type='date' id='DateField' label='Date Field' {...props} />
      <CmpField type='icon' id='IconField' label='Icon Field' {...props} />
    </>
  )
}

// Helper para obtener todos los campos por sus labels
const getAllFieldsByLabel = async () => ({
  text: await screen.findByLabelText('Text Field'),
  number: await screen.findByLabelText('Number Field'),
  location: await screen.findByLabelText('Location Field'),
  password: await screen.findByLabelText('Password Field'),
  foreign: await screen.findByLabelText('Foreign Field'),
  date: await screen.findByLabelText('Date Field'),
  icon: await screen.findByLabelText('Icon Field'),
})

describe('CmpField - Tests Generales', () => {
  const mockGetValue = vi.fn()

  beforeEach(() => {
    mockGetValue.mockClear()
  })

  describe('Renderizado básico', () => {
    it('debe renderizar correctamente un campo de texto', async () => {
      render(<CmpField type='text' id='TextField' />)
      const field = await screen.findByRole('textbox')
      expect(field).toBeInTheDocument()
    })

    it('debe renderizar todos los tipos de campos', async () => {
      render(
        <>
          <CmpField type='number' id='NumberField' label='Number Field' />
          <CmpField type='location' id='LocationField' label='Location Field' />
          <CmpField type='boolean' id='BooleanField' label='Boolean Field' />
          <CmpField type='text' id='TextField' label='Text Field' />
          <CmpField type='password' id='PasswordField' label='Password Field' />
          <CmpField type='foreign' id='ForeignField' label='Foreign Field' />
          <CmpField type='date' id='DateField' label='Date Field' />
          <CmpField type='typedocument' id='TypeDocumentField' label='Type Document Field' />
          <CmpField type='icon' id='IconField' label='Icon Field' />
        </>
      )

      expect(await screen.findByLabelText('Number Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Location Field', {}, { timeout: 5000 })).toBeInTheDocument()
      expect(await screen.findByLabelText('Boolean Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Text Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Password Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Foreign Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Date Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Type Document Field')).toBeInTheDocument()
      expect(await screen.findByLabelText('Icon Field')).toBeInTheDocument()
    })
  })

  describe('Campos obligatorios (mandatory)', () => {
    it('debe marcar los campos como requeridos cuando mandatory=true', async () => {
      renderMultipleFields({ mandatory: true })
      const fields = await getAllFieldsByLabel()

      Object.values(fields).forEach(field => {
        expect(field).toBeRequired()
      })

      const validationMessages = screen.getAllByText(VALIDATION_MESSAGE)
      expect(validationMessages).toHaveLength(7)
      validationMessages.forEach(message => {
        expect(message).toBeInTheDocument()
      })
    })

    it('debe mostrar asterisco cuando mandatory=true e iconMndtory=true', async () => {
      renderMultipleFields({ mandatory: true, iconMndtory: true })
      const fields = await getAllFieldsByLabel()

      Object.values(fields).forEach(field => {
        expect(field).toBeRequired()
      })

      const asterisks = screen.getAllByText('*')
      expect(asterisks.length).toBeGreaterThan(0)
      asterisks.forEach(asterisk => {
        expect(asterisk).toBeInTheDocument()
        expect(asterisk).toHaveClass('field-valIcon')
      })
    })

    it('NO debe marcar los campos como requeridos cuando mandatory=false', async () => {
      renderMultipleFields({ mandatory: false })
      const fields = await getAllFieldsByLabel()

      Object.values(fields).forEach(field => {
        expect(field).not.toBeRequired()
      })
    })

    it('NO debe mostrar asterisco cuando mandatory=false', () => {
      renderMultipleFields({ mandatory: false, iconMndtory: true })
      const asterisk = screen.queryByText('*')
      expect(asterisk).not.toBeInTheDocument()
    })

    it('NO debe mostrar asterisco cuando iconMndtory=false', () => {
      renderMultipleFields({ mandatory: true, iconMndtory: false })
      const asterisk = screen.queryByText('*')
      expect(asterisk).not.toBeInTheDocument()
    })
  })

  describe('Estados de campos (disabled/readOnly)', () => {
    it('debe deshabilitar los campos cuando disabled=true', async () => {
      renderMultipleFields({ disabled: true, readOnly: true })
      const fields = await getAllFieldsByLabel()

      Object.values(fields).forEach(field => {
        expect(field).toBeDisabled()
      })
    })

    it('debe marcar los campos como solo lectura cuando readOnly=true', async () => {
      renderMultipleFields({ readOnly: true })
      const fields = await getAllFieldsByLabel()

      Object.values(fields).forEach(field => {
        expect(field).toHaveAttribute('readonly')
      })
    })
  })

  describe('Valores iniciales', () => {
    it('debe establecer valores iniciales correctamente', () => {
      const initialValues = {
        text: 'Valor inicial',
        number: '237',
        password: '123ABC',
        icon: 'plus',
      }

      render(
        <>
          <CmpField type='text' id='TextField' label='Text Field' value={initialValues.text} />
          <CmpField type='number' id='NumberField' label='Number Field' value={initialValues.number} />
          <CmpField type='password' id='PasswordField' label='Password Field' value={initialValues.password} />
          <CmpField type='icon' id='IconField' label='Icon Field' value={initialValues.icon} />
        </>
      )

      expect((screen.getByLabelText('Text Field') as HTMLInputElement).value).toBe(initialValues.text)
      expect((screen.getByLabelText('Number Field') as HTMLInputElement).value).toBe(initialValues.number)
      expect((screen.getByLabelText('Password Field') as HTMLInputElement).value).toBe(initialValues.password)
      expect((screen.getByLabelText('Icon Field') as HTMLInputElement).value).toBe(initialValues.icon)
    })

    it('debe llamar a getValue con el valor inicial', async () => {
      const testCases = [
        { id: 'TextField', type: 'text' as const, value: 'initial text' },
        { id: 'NumberField', type: 'number' as const, value: '237' },
        { id: 'LocationField', type: 'location' as const, value: 'initial location' },
        { id: 'PasswordField', type: 'password' as const, value: 'initial password' },
        { id: 'IconField', type: 'icon' as const, value: 'initial icon' },
      ]

      render(
        <>
          {testCases.map(({ id, type, value }) => (
            <CmpField key={id} id={id} type={type} value={value} getValue={mockGetValue} />
          ))}
        </>
      )

      for (const { id, value } of testCases) {
        await waitFor(() => {
          expect(mockGetValue).toHaveBeenCalledWith(id, value, true, '')
        })
      }
    })

    it('debe manejar valores vacíos correctamente', async () => {
      render(
        <>
          <CmpField id='TextField' type='text' value='' getValue={mockGetValue} />
          <CmpField id='NumberField' type='number' value='237' getValue={mockGetValue} />
          <CmpField id='LocationField' type='location' value='' getValue={mockGetValue} />
          <CmpField id='PasswordField' type='password' value='' getValue={mockGetValue} />
          <CmpField id='IconField' type='icon' value='' getValue={mockGetValue} />
        </>
      )

      await waitFor(() => {
        expect(mockGetValue).toHaveBeenCalled()
      })
    })
  })

  describe('Interacción de usuario', () => {
    it('debe actualizar el valor cuando el usuario escribe', async () => {
      const user = userEvent.setup()

      render(
        <>
          <CmpField type='text' id='TextField' label='Text Field' />
          <CmpField type='number' id='NumberField' label='Number Field' />
          <CmpField type='password' id='PasswordField' label='Password Field' />
        </>
      )

      const textField = screen.getByLabelText('Text Field') as HTMLInputElement
      await user.clear(textField)
      await user.type(textField, 'Nuevo valor')
      expect(textField.value).toBe('Nuevo valor')

      const numberField = screen.getByLabelText('Number Field') as HTMLInputElement
      await user.clear(numberField)
      await user.type(numberField, '237')
      expect(numberField.value).toBe('237')

      const passwordField = screen.getByLabelText('Password Field') as HTMLInputElement
      await user.clear(passwordField)
      await user.type(passwordField, '237')
      expect(passwordField.value).toBe('237')
    })
  })

  describe('Propiedades específicas', () => {
    describe('maxStr por tipo', () => {
      it('debe manejar maxStr en TextField', async () => {
        render(<CmpField type='text' id='TextField' value='Very long text value' maxStr={10} getValue={mockGetValue} />)
        await waitFor(() => expect(mockGetValue).toHaveBeenCalled())
      })

      it('debe manejar maxStr en NumberField', async () => {
        render(<CmpField type='number' id='NumberField' value='Very long text value' maxStr={15} getValue={mockGetValue} />)
        await waitFor(() => expect(mockGetValue).toHaveBeenCalled())
      })

      it('debe manejar maxStr en LocationField', async () => {
        render(<CmpField type='location' id='LocationField' value='Very long text value' maxStr={20} getValue={mockGetValue} />)
        await waitFor(() => expect(mockGetValue).toHaveBeenCalled(), { timeout: 5000 })
      })

      it('debe manejar maxStr en PasswordField', async () => {
        render(<CmpField type='password' id='PasswordField' value='Very long text value' maxStr={25} getValue={mockGetValue} />)
        await waitFor(() => expect(mockGetValue).toHaveBeenCalled())
      })

      it('debe manejar maxStr en IconField', async () => {
        render(<CmpField type='icon' id='IconField' value='Very long text value' maxStr={30} getValue={mockGetValue} />)
        await waitFor(() => expect(mockGetValue).toHaveBeenCalled())
      })
    })

    it('debe manejar foreignDao correctamente', async () => {
      const mockForeignDao = {
        '1': 'United States',
        '2': 'Colombia',
      }

      render(
        <CmpField
          id='ForeignField'
          type='foreign'
          value='2'
          foreignDao={mockForeignDao}
          getValue={mockGetValue}
        />
      )

      await waitFor(() => {
        expect(mockGetValue).toHaveBeenCalled()
      })
    })
  })

  describe('Casos especiales de renderizado', () => {
    it('NO debe renderizar FieldFactory para tipo hidden', () => {
      render(<CmpField id='hidden-field' type='hidden' getValue={mockGetValue} />)
      const fieldFactory = screen.queryByTestId('field-factory-hidden-field')
      expect(fieldFactory).not.toBeInTheDocument()
    })

    it('NO debe renderizar FieldFactory para tipo icon', () => {
      render(<CmpField id='icon-field' type='icon' getValue={mockGetValue} />)
      const fieldFactory = screen.queryByTestId('field-factory-icon-field')
      expect(fieldFactory).not.toBeInTheDocument()
    })
  })
})


