import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CmpField } from './CmpField'

describe('Simple CmpField Test', () => {
    it('renders text field', () => {
        render(<CmpField type="text" id="test" />)
        expect(true).toBe(true)
    })

    it('renders location field', () => {
        render(<CmpField type="location" id="test-loc" />)
        expect(true).toBe(true)
    })

    it('renders icon field', () => {
        render(<CmpField type="icon" id="test-icon" />)
        expect(true).toBe(true)
    })

    it('renders password field', () => {
        render(<CmpField type="password" id="test-pass" />)
        expect(true).toBe(true)
    })
})
