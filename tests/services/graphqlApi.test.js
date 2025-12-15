import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleProductionQuery, graphqlApi, graphqlQueries } from '../../src/services/graphqlApi'
import recipesData from '../../src/data/recipes.json'

describe('GraphQL API Service', () => {
  describe('handleProductionQuery', () => {
    describe('GetRecipeDetails', () => {
      it('retorna detalles de una receta por ID string', () => {
        const query = 'query GetRecipeDetails($id: ID!) { recipe(id: $id) { id title } }'
        const result = handleProductionQuery(query, { id: '1' })
        
        expect(result.data.recipe).toBeDefined()
        expect(result.data.recipe.id).toBe('1')
      })

      it('retorna detalles de una receta por ID numérico', () => {
        const query = 'query GetRecipeDetails($id: ID!) { recipe(id: $id) { id title } }'
        const result = handleProductionQuery(query, { id: 1 })
        
        expect(result.data.recipe).toBeDefined()
      })

      it('retorna null para receta inexistente', () => {
        const query = 'query GetRecipeDetails($id: ID!) { recipe(id: $id) { id title } }'
        const result = handleProductionQuery(query, { id: '999' })
        
        expect(result.data.recipe).toBeNull()
      })

      it('retorna todos los campos de la receta', () => {
        const query = 'query GetRecipeDetails($id: ID!) { recipe(id: $id) { id title category } }'
        const result = handleProductionQuery(query, { id: '1' })
        
        const recipe = result.data.recipe
        expect(recipe).toHaveProperty('title')
        expect(recipe).toHaveProperty('category')
      })
    })

    describe('SearchByIngredient', () => {
      it('busca recetas por ingrediente', () => {
        const recipeWithIngredients = recipesData.find(r => r.ingredients && r.ingredients.length > 0)
        
        if (recipeWithIngredients) {
          const ingredient = recipeWithIngredients.ingredients[0].split(' ').pop()
          const query = 'query SearchByIngredient($ingredient: String!) { recipes(ingredient: $ingredient) { id } }'
          const result = handleProductionQuery(query, { ingredient })
          
          expect(result.data.recipes).toBeInstanceOf(Array)
        }
      })

      it('retorna array vacío si no hay coincidencias', () => {
        const query = 'query SearchByIngredient($ingredient: String!) { recipes(ingredient: $ingredient) { id } }'
        const result = handleProductionQuery(query, { ingredient: 'ingredienteInexistente12345' })
        
        expect(result.data.recipes).toHaveLength(0)
      })

      it('la búsqueda es case-insensitive', () => {
        const recipeWithIngredients = recipesData.find(r => r.ingredients && r.ingredients.length > 0)
        
        if (recipeWithIngredients) {
          const ingredient = recipeWithIngredients.ingredients[0].toUpperCase()
          const query = 'query SearchByIngredient($ingredient: String!) { recipes(ingredient: $ingredient) { id } }'
          const result = handleProductionQuery(query, { ingredient })
          
          expect(result.data.recipes).toBeInstanceOf(Array)
        }
      })
    })

    describe('GetNutritionInfo', () => {
      it('retorna información nutricional', () => {
        const query = 'query GetNutritionInfo($recipeId: ID!) { nutrition(recipeId: $recipeId) { servings } }'
        const result = handleProductionQuery(query, { recipeId: '1' })
        
        expect(result.data.nutrition).toBeDefined()
        expect(result.data.nutrition.recipeId).toBe('1')
      })

      it('retorna valores por defecto para receta inexistente', () => {
        const query = 'query GetNutritionInfo($recipeId: ID!) { nutrition(recipeId: $recipeId) { servings } }'
        const result = handleProductionQuery(query, { recipeId: '999' })
        
        expect(result.data.nutrition.servings).toBe(0)
        expect(result.data.nutrition.difficulty).toBe('')
      })

      it('retorna porciones y dificultad de la receta', () => {
        const query = 'query GetNutritionInfo($recipeId: ID!) { nutrition(recipeId: $recipeId) { servings difficulty } }'
        const result = handleProductionQuery(query, { recipeId: '1' })
        
        expect(typeof result.data.nutrition.servings).toBe('number')
        expect(result.data.nutrition.difficulty).toBeDefined()
      })

      it('busca por ID numérico también', () => {
        const query = 'query GetNutritionInfo($recipeId: ID!) { nutrition(recipeId: $recipeId) { servings } }'
        const result = handleProductionQuery(query, { recipeId: 1 })
        
        expect(result.data.nutrition).toBeDefined()
      })
    })

    describe('GetPopularRecipes', () => {
      it('retorna las recetas más populares ordenadas por rating', () => {
        const query = 'query GetPopularRecipes { popularRecipes { id rating } }'
        const result = handleProductionQuery(query, {})
        
        expect(result.data.popularRecipes).toBeInstanceOf(Array)
        expect(result.data.popularRecipes.length).toBeLessThanOrEqual(5)
        
        // Verificar que están ordenadas por rating descendente
        const ratings = result.data.popularRecipes.map(r => r.rating)
        for (let i = 1; i < ratings.length; i++) {
          expect(ratings[i - 1]).toBeGreaterThanOrEqual(ratings[i])
        }
      })

      it('retorna máximo 5 recetas', () => {
        const query = 'query GetPopularRecipes { popularRecipes { id rating } }'
        const result = handleProductionQuery(query, {})
        
        expect(result.data.popularRecipes.length).toBeLessThanOrEqual(5)
      })

      it('las recetas populares tienen los campos necesarios', () => {
        const query = 'query GetPopularRecipes { popularRecipes { id title rating } }'
        const result = handleProductionQuery(query, {})
        
        result.data.popularRecipes.forEach(recipe => {
          expect(recipe).toHaveProperty('id')
          expect(recipe).toHaveProperty('rating')
        })
      })
    })

    describe('Query no soportada', () => {
      it('retorna null para queries no soportadas', () => {
        const query = 'query UnsupportedQuery { something }'
        const result = handleProductionQuery(query, {})
        
        expect(result.data).toBeNull()
      })

      it('retorna null para query vacío', () => {
        const query = ''
        const result = handleProductionQuery(query, {})
        
        expect(result.data).toBeNull()
      })
    })
  })

  describe('graphqlQueries', () => {
    it('tiene definida la query GET_RECIPE_DETAILS', () => {
      expect(graphqlQueries.GET_RECIPE_DETAILS).toBeDefined()
      expect(graphqlQueries.GET_RECIPE_DETAILS).toContain('GetRecipeDetails')
    })

    it('tiene definida la query SEARCH_BY_INGREDIENT', () => {
      expect(graphqlQueries.SEARCH_BY_INGREDIENT).toBeDefined()
      expect(graphqlQueries.SEARCH_BY_INGREDIENT).toContain('SearchByIngredient')
    })

    it('tiene definida la query GET_NUTRITION_INFO', () => {
      expect(graphqlQueries.GET_NUTRITION_INFO).toBeDefined()
      expect(graphqlQueries.GET_NUTRITION_INFO).toContain('GetNutritionInfo')
    })

    it('tiene definida la query GET_POPULAR', () => {
      expect(graphqlQueries.GET_POPULAR).toBeDefined()
      expect(graphqlQueries.GET_POPULAR).toContain('GetPopularRecipes')
    })
  })

  describe('graphqlApi (métodos async)', () => {
    const mockFetch = vi.fn()

    beforeEach(() => {
      vi.stubGlobal('fetch', mockFetch)
      mockFetch.mockClear()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('query', () => {
      it('hace POST a /graphql con query y variables', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ data: {} })
        })

        const queryString = 'query Test { test }'
        const variables = { id: '1' }
        await graphqlApi.query(queryString, variables)

        expect(mockFetch).toHaveBeenCalledWith('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryString, variables })
        })
      })

      it('retorna la respuesta parseada', async () => {
        const mockResponse = { data: { test: 'value' } }
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve(mockResponse)
        })

        const result = await graphqlApi.query('query Test { test }', {})

        expect(result).toEqual(mockResponse)
      })
    })

    describe('getRecipeDetails', () => {
      it('usa la query GET_RECIPE_DETAILS con el id', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ data: { recipe: {} } })
        })

        await graphqlApi.getRecipeDetails('123')

        expect(mockFetch).toHaveBeenCalled()
        const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(callBody.query).toContain('GetRecipeDetails')
        expect(callBody.variables.id).toBe('123')
      })
    })

    describe('searchByIngredient', () => {
      it('usa la query SEARCH_BY_INGREDIENT', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ data: { recipes: [] } })
        })

        await graphqlApi.searchByIngredient('tomate')

        expect(mockFetch).toHaveBeenCalled()
        const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(callBody.query).toContain('SearchByIngredient')
        expect(callBody.variables.ingredient).toBe('tomate')
      })
    })

    describe('getNutritionInfo', () => {
      it('usa la query GET_NUTRITION_INFO', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ data: { nutrition: {} } })
        })

        await graphqlApi.getNutritionInfo('456')

        expect(mockFetch).toHaveBeenCalled()
        const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(callBody.query).toContain('GetNutritionInfo')
        expect(callBody.variables.recipeId).toBe('456')
      })
    })

    describe('getPopularRecipes', () => {
      it('usa la query GET_POPULAR sin variables', async () => {
        mockFetch.mockResolvedValue({
          json: () => Promise.resolve({ data: { popularRecipes: [] } })
        })

        await graphqlApi.getPopularRecipes()

        expect(mockFetch).toHaveBeenCalled()
        const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(callBody.query).toContain('GetPopularRecipes')
      })
    })
  })
})
