import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CmpField } from './CmpField'

describe('Debug CmpField maxStr', () => {
    const mockGetValue = vi.fn((id, value, isValid, text) => {
        console.log(`[DEBUG] id: ${id}, value: ${value}, isValid: ${isValid}, text: ${text}`);
    })

    it('debe manejar maxStr correctamente (DEBUG)', async () => {
        const testCases = [
            { id: 'TextField', type: 'text' as const, maxStr: 10 },
            { id: 'NumberField', type: 'number' as const, maxStr: 15 },
            { id: 'LocationField', type: 'location' as const, maxStr: 20 },
            { id: 'PasswordField', type: 'password' as const, maxStr: 25 },
            { id: 'IconField', type: 'icon' as const, maxStr: 30 },
        ]

        render(
            <>
                {testCases.map(({ id, type, maxStr }) => (
                    <CmpField
                        key={id}
                        type={type}
                        id={id}
                        value='Very long text value'
                        maxStr={maxStr}
                        getValue={mockGetValue}
                    />
                ))}
            </>
        )

        await waitFor(() => {
            // Assertions that might fail but give us info
            expect(mockGetValue).toHaveBeenCalledTimes(5)
        }, { timeout: 2000 })
    })
})
