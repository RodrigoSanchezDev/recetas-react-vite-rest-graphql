import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from '../context/FavoritesContext'

// Wrapper con todos los providers necesarios
export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-exportar todo de testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
export { renderWithProviders as render }
