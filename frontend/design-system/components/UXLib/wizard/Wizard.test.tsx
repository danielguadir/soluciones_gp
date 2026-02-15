import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Wizard } from './Wizard'
import type { WizardStep } from './Wizard.types'

// Test data with current API
const mockSteps: WizardStep[] = [
  { label: '1', title: 'Step 1' },
  { label: '2', title: 'Step 2' },
  { label: '3', title: 'Step 3' },
]

const mockStepsWithIcons: WizardStep[] = [
  { label: '1', title: 'Step 1', icon: 'home' },
  { label: '2', title: 'Step 2', icon: 'settings' },
  { label: '3', title: 'Step 3', icon: 'check' },
]

const mockChildren = [
  <div key='1'>Step 1 Content</div>,
  <div key='2'>Step 2 Content</div>,
  <div key='3'>Step 3 Content</div>,
]

// Helper to render the Wizard
const renderWizard = (props = {}) => {
  const onComplete = vi.fn()
  const onClose = vi.fn()

  const result = render(
    <Wizard
      id='test-wizard'
      steps={mockSteps}
      onComplete={onComplete}
      onClose={onClose}
      {...props}
    >
      {mockChildren}
    </Wizard>
  )

  return {
    ...result,
    onComplete,
    onClose,
  }
}

describe('Wizard - General Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render the wizard correctly', () => {
      renderWizard()

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 1 Content')).toBeInTheDocument()
      expect(screen.getByText('Siguiente')).toBeInTheDocument()
    })

    it('should render the wizard structure', () => {
      const { container } = renderWizard()

      expect(container.querySelector('.wrapper-stepper')).toBeInTheDocument()
      expect(container.querySelector('.wrapper-head')).toBeInTheDocument()
      expect(container.querySelector('.wrapper-close')).toBeInTheDocument()
    })

    it('should render the wizard with correct id', () => {
      renderWizard()

      const wizard = document.querySelector('#test-wizard')
      expect(wizard).toBeInTheDocument()
    })

    it('should render the title as heading', () => {
      renderWizard()

      const titleElement = screen.getByRole('heading')
      expect(titleElement).toBeInTheDocument()
    })

    it('should render with custom title', () => {
      renderWizard({ title: 'Custom Title' })

      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })

    it('should render without close button when onClose is not provided', () => {
      const { container } = render(
        <Wizard steps={mockSteps}>{mockChildren}</Wizard>
      )

      expect(container.querySelector('.wrapper-close')).not.toBeInTheDocument()
    })
  })

  describe('Step navigation', () => {
    it('should advance to next step when clicking "Siguiente"', async () => {
      const user = userEvent.setup()
      renderWizard()

      const nextButton = screen.getByText('Siguiente')
      await user.click(nextButton)

      expect(screen.getByText('Step 2 Content')).toBeInTheDocument()
    })

    it('should go back to previous step when clicking "Anterior"', async () => {
      const user = userEvent.setup()
      renderWizard()

      const nextButton = screen.getByText('Siguiente')
      await user.click(nextButton)

      const backButton = screen.getByText('Anterior')
      await user.click(backButton)

      expect(screen.getByText('Step 1 Content')).toBeInTheDocument()
    })

    it('should navigate through all steps', async () => {
      const user = userEvent.setup()
      renderWizard()

      // Step 1 -> Step 2
      await user.click(screen.getByText('Siguiente'))
      expect(screen.getByText('Step 2 Content')).toBeInTheDocument()

      // Step 2 -> Step 3
      await user.click(screen.getByText('Siguiente'))
      expect(screen.getByText('Step 3 Content')).toBeInTheDocument()
    })
  })

  describe('Navigation buttons', () => {
    it('should disable "Anterior" button on first step', () => {
      renderWizard()

      const step1Content = screen.getByText('Step 1 Content')
      expect(step1Content).toBeInTheDocument()

      const backButtonSpan = screen.getByText('Anterior')
      const backButton = backButtonSpan.closest('button')

      expect(backButton).toHaveAttribute('disabled')
    })

    it('should change button text to "Finalizar" on last step', () => {
      renderWizard()

      // Advance to last step
      fireEvent.click(screen.getByText('Siguiente')) // Step 2
      fireEvent.click(screen.getByText('Siguiente')) // Step 3

      expect(screen.getByText('Finalizar')).toBeInTheDocument()
    })

    it('should have visible navigation buttons', () => {
      renderWizard()

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should use custom button texts', () => {
      renderWizard({
        backButtonText: 'Back',
        nextButtonText: 'Next',
        doneButtonText: 'Finish',
      })

      expect(screen.getByText('Back')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()

      // Navigate to last step
      fireEvent.click(screen.getByText('Next'))
      fireEvent.click(screen.getByText('Next'))

      expect(screen.getByText('Finish')).toBeInTheDocument()
    })
  })

  describe('Callbacks', () => {
    it('should call onComplete when wizard is completed', async () => {
      const user = userEvent.setup()
      const { onComplete } = renderWizard()

      const nextButton = screen.getByText('Siguiente')
      await user.click(nextButton) // Go to step 2
      await user.click(nextButton) // Go to step 3
      await user.click(nextButton) // Complete wizard

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const { onClose, container } = renderWizard()

      const closeButton = container.querySelector('.wrapper-close')
      expect(closeButton).toBeInTheDocument()

      // Svg component renders an <i> element with icon class, not an <svg>
      const iconElement = closeButton?.querySelector('i[class*="icon-"]') || closeButton
      if (iconElement) {
        await user.click(iconElement)
        expect(onClose).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe('Styles and properties', () => {
    it('should apply default size style', () => {
      const { container } = renderWizard()

      const wizardElement = container.querySelector('.wrapper-stepper')
      expect(wizardElement).toBeInTheDocument()
      expect(wizardElement).toHaveStyle('--wizard-size: 60%')
    })

    it('should apply custom styles with width prop', () => {
      const { container } = renderWizard({
        width: '800px',
        stepSize: 'small',
      })

      const wizardElement = container.querySelector('.wrapper-stepper')
      expect(wizardElement).toBeInTheDocument()
      expect(wizardElement).toHaveStyle('--wizard-size: 800px')
      expect(wizardElement).toHaveStyle('--wizard-itemCounter: 25pt')
      expect(wizardElement).toHaveStyle('--wizard-iconNumSize: 15pt')
    })

    it('should apply custom stepperWidth', () => {
      const { container } = renderWizard({
        stepperWidth: '80%',
      })

      const wizardElement = container.querySelector('.wrapper-stepper')
      expect(wizardElement).toHaveStyle('--wizard-stepWidth: 80%')
    })

    it('should apply custom className', () => {
      const { container } = renderWizard({ className: 'custom-wizard' })

      const wizardElement = container.querySelector('.wrapper-stepper')
      expect(wizardElement).toHaveClass('custom-wizard')
    })

    it('should apply custom style object', () => {
      const { container } = renderWizard({
        style: { backgroundColor: 'red' },
      })

      const wizardElement = container.querySelector('.wrapper-stepper')
      expect(wizardElement?.getAttribute('style')).toContain('background-color: red')
    })
  })

  describe('Step icons', () => {
    it('should render steps with icons when showStepIcons is true', () => {
      const { container } = render(
        <Wizard steps={mockStepsWithIcons} showStepIcons>
          {mockChildren}
        </Wizard>
      )

      const stepCounters = container.querySelectorAll('.stepper-item-counter')
      expect(stepCounters.length).toBe(3)
    })

    it('should show check icon for completed steps', async () => {
      const user = userEvent.setup()
      const { container } = renderWizard()

      await user.click(screen.getByText('Siguiente'))

      const successSteps = container.querySelectorAll('.stepper-item.success')
      expect(successSteps.length).toBe(1)
    })
  })

  describe('Controlled mode', () => {
    it('should work in controlled mode', () => {
      const onStepChange = vi.fn()

      render(
        <Wizard
          steps={mockSteps}
          currentStep={2}
          onStepChange={onStepChange}
        >
          {mockChildren}
        </Wizard>
      )

      expect(screen.getByText('Step 2 Content')).toBeInTheDocument()
    })

    it('should call onStepChange when navigating in controlled mode', async () => {
      const user = userEvent.setup()
      const onStepChange = vi.fn()

      render(
        <Wizard
          steps={mockSteps}
          currentStep={1}
          onStepChange={onStepChange}
        >
          {mockChildren}
        </Wizard>
      )

      await user.click(screen.getByText('Siguiente'))
      expect(onStepChange).toHaveBeenCalledWith(2)
    })
  })

  describe('Responsiveness', () => {
    it('should render correctly at different screen sizes', () => {
      global.innerWidth = 500
      const { container } = renderWizard()

      const wizardElement = container.querySelector('.wrapper-stepper')
      expect(wizardElement).toBeInTheDocument()
    })

    it('should maintain structure on small screens', () => {
      global.innerWidth = 320
      const { container } = renderWizard()

      expect(container.querySelector('.wrapper-stepper')).toBeInTheDocument()
      expect(container.querySelector('.wrapper-head')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle a wizard with a single step', () => {
      const singleStep: WizardStep[] = [{ label: '1', title: 'Only Step' }]
      const singleChild = [<div key='1'>Only Step Content</div>]

      render(
        <Wizard steps={singleStep}>
          {singleChild}
        </Wizard>
      )

      expect(screen.getByText('Only Step Content')).toBeInTheDocument()
      // Should show Finalizar immediately since it's the only step
      expect(screen.getByText('Finalizar')).toBeInTheDocument()
    })

    it('should handle multiple steps correctly', () => {
      const manySteps: WizardStep[] = Array.from({ length: 5 }, (_, i) => ({
        label: String(i + 1),
        title: `S${i + 1}`,
      }))

      const manyChildren = Array.from({ length: 5 }, (_, i) => (
        <div key={i + 1}>Step {i + 1} Content</div>
      ))

      render(
        <Wizard steps={manySteps}>
          {manyChildren}
        </Wizard>
      )

      expect(screen.getByText('Step 1 Content')).toBeInTheDocument()
    })

    it('should handle steps with numeric labels', () => {
      const numericSteps: WizardStep[] = [
        { label: 1, title: 'First' },
        { label: 2, title: 'Second' },
      ]

      render(
        <Wizard steps={numericSteps}>
          {[<div key='1'>Content 1</div>, <div key='2'>Content 2</div>]}
        </Wizard>
      )

      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      renderWizard()

      const wizard = screen.getByLabelText('wizard-test-wizard')
      expect(wizard).toBeInTheDocument()
    })

    it('should have default aria-label when no id is provided', () => {
      render(
        <Wizard steps={mockSteps}>
          {mockChildren}
        </Wizard>
      )

      const wizard = screen.getByLabelText('wizard')
      expect(wizard).toBeInTheDocument()
    })
  })
})
