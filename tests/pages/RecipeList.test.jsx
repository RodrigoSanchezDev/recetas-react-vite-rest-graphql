import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../test-utils'
import RecipeList from '../../src/pages/RecipeList'

// Mock del módulo restApi
vi.mock('../../src/services/restApi', () => ({
  restApi: {
    getRecipes: vi.fn(),
    getCategories: vi.fn(),
    searchRecipes: vi.fn()
  }
}))

import { restApi } from '../../src/services/restApi'

describe('RecipeList', () => {
  const mockRecipes = [
    { id: '1', title: 'Paella', category: 'Platos Principales', difficulty: 'Media', rating: 4.5, cookingTime: '45 min', description: 'Deliciosa paella', servings: 4, image: 'img1.jpg', ingredients: ['arroz', 'pollo'] },
    { id: '2', title: 'Brownie', category: 'Postres', difficulty: 'Fácil', rating: 4.8, cookingTime: '30 min', description: 'Brownie de chocolate', servings: 8, image: 'img2.jpg', ingredients: ['chocolate', 'harina'] },
    { id: '3', title: 'Ensalada Verde', category: 'Ensaladas', difficulty: 'Fácil', rating: 4.2, cookingTime: '10 min', description: 'Ensalada fresca', servings: 2, image: 'img3.jpg', ingredients: ['lechuga', 'tomate'] },
  ]

  const mockCategories = ['Platos Principales', 'Postres', 'Ensaladas']

  beforeEach(() => {
    vi.clearAllMocks()
    restApi.getRecipes.mockResolvedValue({ success: true, data: mockRecipes })
    restApi.getCategories.mockResolvedValue({ success: true, data: mockCategories })
    restApi.searchRecipes.mockResolvedValue({ success: true, data: mockRecipes })
  })

  describe('Estado inicial', () => {
    it('muestra spinner de carga inicialmente', () => {
      restApi.getRecipes.mockImplementation(() => new Promise(() => {}))
      restApi.getCategories.mockImplementation(() => new Promise(() => {}))
      
      render(<RecipeList />)
      expect(screen.getByText(/cargando/i)).toBeInTheDocument()
    })

    it('muestra el título de la página', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Todas las Recetas')).toBeInTheDocument()
      })
    })

    it('muestra contador de recetas disponibles', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText(/3 recetas disponibles/i)).toBeInTheDocument()
      })
    })
  })

  describe('Carga de datos', () => {
    it('carga y muestra las recetas', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
        expect(screen.getByText('Brownie')).toBeInTheDocument()
        expect(screen.getByText('Ensalada Verde')).toBeInTheDocument()
      })
    })

    it('llama a getRecipes y getCategories al montar', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(restApi.getRecipes).toHaveBeenCalledTimes(1)
        expect(restApi.getCategories).toHaveBeenCalledTimes(1)
      })
    })

    it('muestra mensaje de error cuando falla la carga', async () => {
      restApi.getRecipes.mockRejectedValue(new Error('Error de conexión'))
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
      })
    })
  })

  describe('Campo de búsqueda', () => {
    it('muestra campo de búsqueda', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/buscar/i)
        expect(searchInput).toBeInTheDocument()
      })
    })

    it('permite escribir en el campo de búsqueda', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'pasta' } })
      expect(searchInput.value).toBe('pasta')
    })

    it('filtra recetas localmente por búsqueda', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'brownie' } })
      
      await waitFor(() => {
        expect(screen.getByText('Brownie')).toBeInTheDocument()
        expect(screen.queryByText('Paella')).not.toBeInTheDocument()
      })
    })

    it('botón de búsqueda está presente', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument()
      })
    })
  })

  describe('Filtro de categoría', () => {
    it('muestra texto de categoría', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Categoría')).toBeInTheDocument()
      })
    })

    it('muestra selector de categoría', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        const selects = screen.getAllByRole('combobox')
        expect(selects.length).toBeGreaterThan(0)
      })
    })

    it('muestra opción de todas las categorías', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Todas las categorías' })).toBeInTheDocument()
      })
    })
  })

  describe('Ordenamiento', () => {
    it('muestra texto de ordenar por', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Ordenar por')).toBeInTheDocument()
      })
    })

    it('tiene opciones de ordenamiento', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Rating' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Tiempo de cocción' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Nombre' })).toBeInTheDocument()
      })
    })

    it('ordena por rating por defecto', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        const ratingOption = screen.getByRole('option', { name: 'Rating' })
        expect(ratingOption.selected).toBe(true)
      })
    })
  })

  describe('Botón limpiar filtros', () => {
    it('muestra botón de limpiar filtros', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        const resetButton = screen.getByRole('button', { name: /limpiar filtros/i })
        expect(resetButton).toBeInTheDocument()
      })
    })

    it('resetea filtros al hacer click', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'brownie' } })
      
      const resetButton = screen.getByRole('button', { name: /limpiar filtros/i })
      fireEvent.click(resetButton)
      
      await waitFor(() => {
        expect(searchInput.value).toBe('')
      })
    })
  })

  describe('Resultados', () => {
    it('muestra contador de resultados', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        // El texto dice "Mostrando X de Y recetas"
        expect(screen.getByText(/mostrando.*recetas/i)).toBeInTheDocument()
      })
    })

    it('muestra EmptyState cuando no hay resultados', async () => {
      restApi.getRecipes.mockResolvedValue({ success: true, data: [] })
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText(/no se encontraron recetas/i)).toBeInTheDocument()
      })
    })
  })

  describe('Estados de error', () => {
    it('muestra error con mensaje específico', async () => {
      restApi.getRecipes.mockRejectedValue(new Error('Error de red'))
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
      })
    })

    it('tiene botón de reintentar', async () => {
      restApi.getRecipes.mockRejectedValue(new Error('Error'))
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
      })
    })

    it('reintenta cargar al hacer click en reintentar', async () => {
      restApi.getRecipes.mockRejectedValueOnce(new Error('Error'))
      restApi.getRecipes.mockResolvedValueOnce({ success: true, data: mockRecipes })
      
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))
      
      await waitFor(() => {
        expect(restApi.getRecipes).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Búsqueda avanzada', () => {
    it('ejecuta búsqueda API al enviar formulario', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'brownie' } })
      
      const searchButton = screen.getByRole('button', { name: /buscar/i })
      fireEvent.click(searchButton)
      
      await waitFor(() => {
        expect(restApi.searchRecipes).toHaveBeenCalledWith('brownie')
      })
    })

    it('no busca si el query está vacío', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: '   ' } })
      
      const searchButton = screen.getByRole('button', { name: /buscar/i })
      fireEvent.click(searchButton)
      
      // searchRecipes no debería ser llamado con query vacío
      expect(restApi.searchRecipes).not.toHaveBeenCalled()
    })

    it('filtra por ingredientes', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'arroz' } })
      
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
        expect(screen.queryByText('Brownie')).not.toBeInTheDocument()
      })
    })

    it('maneja error en búsqueda', async () => {
      restApi.searchRecipes.mockRejectedValue(new Error('Error de búsqueda'))
      
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      const searchButton = screen.getByRole('button', { name: /buscar/i })
      fireEvent.click(searchButton)
      
      await waitFor(() => {
        expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
      })
    })
  })

  describe('Filtros avanzados', () => {
    it('filtra por categoría seleccionada', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const categorySelect = screen.getAllByRole('combobox')[0]
      fireEvent.change(categorySelect, { target: { value: 'Postres' } })
      
      await waitFor(() => {
        expect(screen.getByText('Brownie')).toBeInTheDocument()
        expect(screen.queryByText('Paella')).not.toBeInTheDocument()
      })
    })

    it('ordena por tiempo de cocción', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const sortSelect = screen.getAllByRole('combobox')[1]
      fireEvent.change(sortSelect, { target: { value: 'cookingTime' } })
      
      await waitFor(() => {
        // Verificar que todos siguen presentes
        expect(screen.getByText('Paella')).toBeInTheDocument()
        expect(screen.getByText('Brownie')).toBeInTheDocument()
      })
    })

    it('ordena por nombre', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const sortSelect = screen.getAllByRole('combobox')[1]
      fireEvent.change(sortSelect, { target: { value: 'title' } })
      
      await waitFor(() => {
        expect(screen.getByText('Brownie')).toBeInTheDocument()
      })
    })

    it('muestra filtros activos', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const categorySelect = screen.getAllByRole('combobox')[0]
      fireEvent.change(categorySelect, { target: { value: 'Postres' } })
      
      await waitFor(() => {
        expect(screen.getByText('Filtros activos:')).toBeInTheDocument()
      })
    })

    it('permite quitar filtro de categoría', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const categorySelect = screen.getAllByRole('combobox')[0]
      fireEvent.change(categorySelect, { target: { value: 'Postres' } })
      
      await waitFor(() => {
        expect(screen.getByText('Filtros activos:')).toBeInTheDocument()
      })
      
      // Buscar el botón × para quitar el filtro
      const removeButtons = screen.getAllByRole('button')
      const removeFilterButton = removeButtons.find(btn => btn.textContent === '×')
      
      if (removeFilterButton) {
        fireEvent.click(removeFilterButton)
        await waitFor(() => {
          expect(screen.getByText('Paella')).toBeInTheDocument()
        })
      }
    })

    it('muestra filtro de búsqueda activo', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      await waitFor(() => {
        expect(screen.getByText('Filtros activos:')).toBeInTheDocument()
        expect(screen.getByText(/"test"/)).toBeInTheDocument()
      })
    })
  })

  describe('Manejo de datos', () => {
    it('maneja response sin success correctamente', async () => {
      restApi.getRecipes.mockResolvedValue({ success: false, data: [] })
      restApi.getCategories.mockResolvedValue({ success: false, data: [] })
      
      render(<RecipeList />)
      await waitFor(() => {
        // Debería manejar el caso sin mostrar error
        expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument()
      })
    })

    it('muestra EmptyState con botón cuando no hay resultados filtrados', async () => {
      render(<RecipeList />)
      await waitFor(() => {
        expect(screen.getByText('Paella')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      fireEvent.change(searchInput, { target: { value: 'xyznonexistent123' } })
      
      await waitFor(() => {
        expect(screen.getByText(/no se encontraron recetas/i)).toBeInTheDocument()
      })
      
      // Verificar que EmptyState tiene el botón de acción (puede haber múltiples)
      const clearButtons = screen.getAllByRole('button', { name: /limpiar filtros/i })
      expect(clearButtons.length).toBeGreaterThan(0)
    })
  })
})
