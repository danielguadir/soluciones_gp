/* eslint-disable react-refresh/only-export-components */
import type { Preview, Decorator } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { store } from '../src/api/store/store'
import { v4 as uuidv4 } from 'uuid'
import '../src/index.css'
import '../src/components/UXLib/styles/cmpStyles.scss'

// Polyfill con tipo correcto
if (typeof window !== 'undefined') {
  // Tipo exacto que espera crypto.randomUUID
  type UUID = `${string}-${string}-${string}-${string}-${string}`

  const win = window as typeof window & {
    crypto: {
      randomUUID: () => UUID
    }
  }

  if (!win.crypto) {
    win.crypto = {} as typeof win.crypto
  }

  if (!win.crypto.randomUUID) {
    // Type assertion para decirle a TypeScript que uuidv4 retorna el tipo correcto
    win.crypto.randomUUID = uuidv4 as () => UUID
  }
}

//Redux decorator
const withRedux: Decorator = (Story) => (
  <Provider store={store}>
    <Story />
  </Provider>
)

import { useEffect } from 'react'

// Portal root component
const PortalWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    let portalRoot = document.getElementById('portal-root')
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.setAttribute('id', 'portal-root')
      document.body.appendChild(portalRoot)
    }
  }, [])
  return <>{children}</>
}

// Portal root decorator
const withPortal: Decorator = (Story) => (
  <PortalWrapper>
    <Story />
  </PortalWrapper>
)

// import { setTheme } from '../src/api/store/slices/ui/uiSlice'

// Component to handle theme logic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeWrapper = ({ Story, context }: { Story: any; context: any }) => {
  const { theme } = context.globals

  useEffect(() => {
    const selectedTheme = theme || 'light'
    document.documentElement.setAttribute('data-theme', selectedTheme)
    // store.dispatch(setTheme(selectedTheme as 'light' | 'dark'))
  }, [theme])

  return <Story />
}

// Theme decorator
const withTheme: Decorator = (Story, context) => <ThemeWrapper Story={Story} context={context} />

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#121212' },
      },
    },
  },

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },

  decorators: [withRedux, withPortal, withTheme],

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
}

export default preview
