import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test-utils'
import Home from '../../src/pages/Home'

// Mock del módulo restApi
vi.mock('../../src/services/restApi', () => ({
  restApi: {
    getRecipes: vi.fn(),
    getStats: vi.fn()
  }
}))

// Importar el mock después de definirlo
import { restApi } from '../../src/services/restApi'

describe('Home', () => {
  const mockRecipes = [
    { id: '1', title: 'Paella', category: 'Platos Principales', difficulty: 'Media', rating: 4.5 },
    { id: '2', title: 'Brownie', category: 'Postres', difficulty: 'Fácil', rating: 4.8 },
  ]

  const mockStats = {
    totalRecipes: 8,
    categories: 5,
    totalServings: 48,
    averageRating: 4.2
  }

  beforeEach(() => {
    vi.clearAllMocks()
    restApi.getRecipes.mockResolvedValue({ success: true, data: mockRecipes })
    restApi.getStats.mockResolvedValue({ success: true, data: mockStats })
  })

  it('muestra el spinner de carga inicialmente', () => {
    // Hacer que las promesas no resuelvan inmediatamente
    restApi.getRecipes.mockImplementation(() => new Promise(() => {}))
    restApi.getStats.mockImplementation(() => new Promise(() => {}))
    
    render(<Home />)
    
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('muestra el contenido después de cargar', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument()
    })
  })

  it('llama a getRecipes y getStats al montar', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(restApi.getRecipes).toHaveBeenCalledTimes(1)
      expect(restApi.getStats).toHaveBeenCalledTimes(1)
    })
  })

  it('muestra mensaje de error cuando falla la carga', async () => {
    restApi.getRecipes.mockRejectedValue(new Error('Error de red'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    })
  })

  it('tiene enlace para explorar más recetas', async () => {
    render(<Home />)
    
    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const explorarLink = links.find(link => 
        link.getAttribute('href') === '/recetas'
      )
      expect(explorarLink).toBeDefined()
    })
  })

  it('muestra sección hero con título', async () => {
    render(<Home />)
    
    await waitFor(() => {
      // Buscar elementos del hero
      const heroSection = document.querySelector('section')
      expect(heroSection).toBeInTheDocument()
    })
  })
})
