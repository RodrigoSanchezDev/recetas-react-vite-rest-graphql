import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { productionHelpers, restApi } from '../../src/services/restApi'
import recipesData from '../../src/data/recipes.json'

describe('REST API Service', () => {
  describe('productionHelpers', () => {
    describe('getRecipesFromStatic', () => {
      it('retorna todas las recetas correctamente', () => {
        const result = productionHelpers.getRecipesFromStatic()
        
        expect(result.success).toBe(true)
        expect(result.data).toBeInstanceOf(Array)
        expect(result.count).toBe(recipesData.length)
      })

      it('las recetas tienen la estructura correcta', () => {
        const result = productionHelpers.getRecipesFromStatic()
        const recipe = result.data[0]
        
        expect(recipe).toHaveProperty('id')
        expect(recipe).toHaveProperty('title')
        expect(recipe).toHaveProperty('category')
        expect(recipe).toHaveProperty('difficulty')
      })
    })

    describe('getRecipeByIdFromStatic', () => {
      it('retorna una receta por ID string', () => {
        const result = productionHelpers.getRecipeByIdFromStatic('1')
        
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
        expect(result.data.id).toBe('1')
      })

      it('retorna una receta por ID numérico', () => {
        const result = productionHelpers.getRecipeByIdFromStatic(1)
        
        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
      })

      it('retorna error cuando la receta no existe', () => {
        const result = productionHelpers.getRecipeByIdFromStatic('999')
        
        expect(result.success).toBe(false)
        expect(result.message).toBe('Receta no encontrada')
      })

      it('busca por ID como String exacto', () => {
        const result = productionHelpers.getRecipeByIdFromStatic(String(1))
        
        expect(result.success).toBe(true)
      })
    })

    describe('getRecipesByCategoryFromStatic', () => {
      it('filtra recetas por categoría', () => {
        const category = recipesData[0].category
        const result = productionHelpers.getRecipesByCategoryFromStatic(category)
        
        expect(result.success).toBe(true)
        expect(result.data.every(r => r.category === category)).toBe(true)
      })

      it('retorna array vacío para categoría inexistente', () => {
        const result = productionHelpers.getRecipesByCategoryFromStatic('CategoríaInexistente')
        
        expect(result.success).toBe(true)
        expect(result.data).toHaveLength(0)
        expect(result.count).toBe(0)
      })

      it('cuenta correctamente las recetas filtradas', () => {
        const category = recipesData[0].category
        const result = productionHelpers.getRecipesByCategoryFromStatic(category)
        
        expect(result.count).toBe(result.data.length)
      })
    })

    describe('searchRecipesFromStatic', () => {
      it('busca recetas por título', () => {
        const searchTerm = recipesData[0].title.split(' ')[0]
        const result = productionHelpers.searchRecipesFromStatic(searchTerm)
        
        expect(result.success).toBe(true)
        expect(result.data.length).toBeGreaterThan(0)
      })

      it('busca recetas por descripción', () => {
        const recipe = recipesData.find(r => r.description)
        if (recipe) {
          const searchTerm = recipe.description.split(' ')[0]
          const result = productionHelpers.searchRecipesFromStatic(searchTerm)
          
          expect(result.success).toBe(true)
        }
      })

      it('busca recetas por categoría', () => {
        const category = recipesData[0].category
        const result = productionHelpers.searchRecipesFromStatic(category)
        
        expect(result.success).toBe(true)
        expect(result.data.length).toBeGreaterThan(0)
      })

      it('busca recetas por ingrediente', () => {
        const recipeWithIngredients = recipesData.find(r => r.ingredients && r.ingredients.length > 0)
        if (recipeWithIngredients) {
          const ingredient = recipeWithIngredients.ingredients[0].split(' ').pop()
          const result = productionHelpers.searchRecipesFromStatic(ingredient)
          
          expect(result.success).toBe(true)
        }
      })

      it('la búsqueda es case-insensitive', () => {
        const searchTerm = recipesData[0].title.toUpperCase()
        const result = productionHelpers.searchRecipesFromStatic(searchTerm)
        
        expect(result.success).toBe(true)
        expect(result.data.length).toBeGreaterThan(0)
      })

      it('retorna array vacío para búsqueda sin resultados', () => {
        const result = productionHelpers.searchRecipesFromStatic('términoinexistente12345')
        
        expect(result.success).toBe(true)
        expect(result.data).toHaveLength(0)
      })

      it('cuenta correctamente los resultados de búsqueda', () => {
        const searchTerm = recipesData[0].title.split(' ')[0]
        const result = productionHelpers.searchRecipesFromStatic(searchTerm)
        
        expect(result.count).toBe(result.data.length)
      })
    })

    describe('createRecipeFromStatic', () => {
      it('crea una receta nueva', () => {
        const newRecipe = {
          title: 'Nueva Receta Test',
          category: 'Postres',
          difficulty: 'Fácil'
        }
        
        const result = productionHelpers.createRecipeFromStatic(newRecipe)
        
        expect(result.success).toBe(true)
        expect(result.data.title).toBe(newRecipe.title)
        expect(result.data.id).toBeDefined()
        expect(result.message).toContain('exitosamente')
      })

      it('asigna un ID único a la receta creada', () => {
        const newRecipe = { title: 'Test Recipe', category: 'Test' }
        const result = productionHelpers.createRecipeFromStatic(newRecipe)
        
        expect(result.data.id).toBe((recipesData.length + 1).toString())
      })

      it('preserva los datos originales de la receta', () => {
        const newRecipe = {
          title: 'Recipe Test',
          category: 'Postres',
          difficulty: 'Alta',
          servings: 6
        }
        
        const result = productionHelpers.createRecipeFromStatic(newRecipe)
        
        expect(result.data.category).toBe(newRecipe.category)
        expect(result.data.difficulty).toBe(newRecipe.difficulty)
        expect(result.data.servings).toBe(newRecipe.servings)
      })
    })

    describe('getCategoriesFromStatic', () => {
      it('retorna las categorías únicas', () => {
        const result = productionHelpers.getCategoriesFromStatic()
        
        expect(result.success).toBe(true)
        expect(result.data).toBeInstanceOf(Array)
        expect(result.count).toBeGreaterThan(0)
        
        // Verificar que no hay duplicados
        const uniqueCategories = [...new Set(result.data)]
        expect(uniqueCategories.length).toBe(result.data.length)
      })

      it('el count coincide con la cantidad de categorías', () => {
        const result = productionHelpers.getCategoriesFromStatic()
        
        expect(result.count).toBe(result.data.length)
      })
    })

    describe('getStatsFromStatic', () => {
      it('retorna estadísticas correctas', () => {
        const result = productionHelpers.getStatsFromStatic()
        
        expect(result.success).toBe(true)
        expect(result.data.totalRecipes).toBe(recipesData.length)
        expect(result.data.categories).toBeGreaterThan(0)
        expect(typeof result.data.totalServings).toBe('number')
        expect(typeof result.data.averageRating).toBe('number')
      })

      it('calcula el total de porciones correctamente', () => {
        const result = productionHelpers.getStatsFromStatic()
        const expectedServings = recipesData.reduce((sum, r) => sum + r.servings, 0)
        
        expect(result.data.totalServings).toBe(expectedServings)
      })

      it('calcula el promedio de rating redondeado a un decimal', () => {
        const result = productionHelpers.getStatsFromStatic()
        
        // El rating debe estar entre 0 y 5
        expect(result.data.averageRating).toBeGreaterThanOrEqual(0)
        expect(result.data.averageRating).toBeLessThanOrEqual(5)
        
        // Debe tener máximo un decimal
        const decimals = (result.data.averageRating.toString().split('.')[1] || '').length
        expect(decimals).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('restApi (métodos async)', () => {
    const mockFetch = vi.fn()
    
    beforeEach(() => {
      vi.stubGlobal('fetch', mockFetch)
      mockFetch.mockClear()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('getRecipes', () => {
      it('hace fetch a /api/recipes en desarrollo', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ success: true, data: [] })
        })
        
        await restApi.getRecipes()
        
        expect(mockFetch).toHaveBeenCalledWith('/api/recipes')
      })

      it('retorna la respuesta parseada como JSON', async () => {
        const mockResponse = { success: true, data: [{ id: '1', title: 'Test' }] }
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve(mockResponse)
        })
        
        const result = await restApi.getRecipes()
        
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getRecipeById', () => {
      it('hace fetch a /api/recipes/:id', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ success: true, data: {} })
        })
        
        await restApi.getRecipeById('123')
        
        expect(mockFetch).toHaveBeenCalledWith('/api/recipes/123')
      })
    })

    describe('getRecipesByCategory', () => {
      it('hace fetch a /api/recipes/category/:category', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ success: true, data: [] })
        })
        
        await restApi.getRecipesByCategory('Postres')
        
        expect(mockFetch).toHaveBeenCalledWith('/api/recipes/category/Postres')
      })
    })

    describe('searchRecipes', () => {
      it('hace fetch a /api/search con query encoded', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ success: true, data: [] })
        })
        
        await restApi.searchRecipes('pasta con queso')
        
        expect(mockFetch).toHaveBeenCalledWith('/api/search?q=pasta%20con%20queso')
      })
    })

    describe('createRecipe', () => {
      it('hace POST a /api/recipes con los datos', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ success: true, data: {} })
        })
        
        const newRecipe = { title: 'New Recipe', category: 'Test' }
        await restApi.createRecipe(newRecipe)
        
        expect(mockFetch).toHaveBeenCalledWith('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecipe)
        })
      })
    })

    describe('getCategories', () => {
      it('hace fetch a /api/recipes y extrae categorías únicas', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ 
            success: true, 
            data: [
              { category: 'Postres' },
              { category: 'Ensaladas' },
              { category: 'Postres' }
            ] 
          })
        })
        
        const result = await restApi.getCategories()
        
        expect(result.success).toBe(true)
        expect(result.data).toContain('Postres')
        expect(result.data).toContain('Ensaladas')
        expect(result.data.length).toBe(2) // Sin duplicados
      })

      it('retorna la respuesta original si no es success', async () => {
        const errorResponse = { success: false, error: 'Error' }
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve(errorResponse)
        })
        
        const result = await restApi.getCategories()
        
        expect(result).toEqual(errorResponse)
      })
    })

    describe('getStats', () => {
      it('hace fetch a /api/stats', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ success: true, data: {} })
        })
        
        await restApi.getStats()
        
        expect(mockFetch).toHaveBeenCalledWith('/api/stats')
      })
    })
  })
})
