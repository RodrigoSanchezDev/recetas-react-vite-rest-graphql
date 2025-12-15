import { http, HttpResponse, delay, graphql } from 'msw';
import recipesData from '../data/recipes.json';

// Simular delay de red realista (200-500ms)
const networkDelay = () => delay(Math.random() * 300 + 200);

// Handlers para REST API
export const restHandlers = [
  // GET /api/recipes - Obtener todas las recetas
  http.get('/api/recipes', async () => {
    await networkDelay();
    return HttpResponse.json({
      success: true,
      data: recipesData,
      message: 'Recetas obtenidas exitosamente'
    });
  }),

  // GET /api/recipes/:id - Obtener una receta por ID
  http.get('/api/recipes/:id', async ({ params }) => {
    await networkDelay();
    const { id } = params;
    const recipe = recipesData.find(r => String(r.id) === String(id));
    
    if (!recipe) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Receta no encontrada'
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: recipe
    });
  }),

  // GET /api/recipes/category/:category - Filtrar por categoría
  http.get('/api/recipes/category/:category', async ({ params }) => {
    await networkDelay();
    const { category } = params;
    const filtered = recipesData.filter(r => 
      r.category.toLowerCase() === category.toLowerCase()
    );

    return HttpResponse.json({
      success: true,
      data: filtered
    });
  }),

  // POST /api/recipes - Crear nueva receta
  http.post('/api/recipes', async ({ request }) => {
    await networkDelay();
    const newRecipe = await request.json();
    
    const recipeWithId = {
      ...newRecipe,
      id: String(recipesData.length + 1)
    };

    return HttpResponse.json(
      {
        success: true,
        data: recipeWithId,
        message: 'Receta creada exitosamente'
      },
      { status: 201 }
    );
  }),

  // GET /api/stats - Obtener estadísticas
  http.get('/api/stats', async () => {
    await networkDelay();
    
    const totalRecipes = recipesData.length;
    const categories = [...new Set(recipesData.map(r => r.category))].length;
    const totalServings = recipesData.reduce((sum, r) => sum + r.servings, 0);
    const averageRating = Math.round(
      (recipesData.reduce((sum, r) => sum + r.rating, 0) / recipesData.length) * 10
    ) / 10;

    return HttpResponse.json({
      success: true,
      data: {
        totalRecipes,
        categories,
        totalServings,
        averageRating
      }
    });
  }),

  // GET /api/search?q=query - Buscar recetas
  http.get('/api/search', async ({ request }) => {
    await networkDelay();
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() || '';

    const results = recipesData.filter(recipe =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(query)))
    );

    return HttpResponse.json({
      success: true,
      data: results,
      count: results.length
    });
  })
];

// Handlers para GraphQL API
export const graphqlHandlers = [
  // Query: getRecipeDetails
  graphql.query('GetRecipeDetails', async ({ variables }) => {
    await networkDelay();
    const { id } = variables;
    const recipe = recipesData.find(r => String(r.id) === String(id));

    if (!recipe) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Receta no encontrada',
            extensions: { code: 'NOT_FOUND' }
          }
        ]
      });
    }

    return HttpResponse.json({
      data: {
        recipe
      }
    });
  }),

  // Query: searchByIngredient
  graphql.query('SearchByIngredient', async ({ variables }) => {
    await networkDelay();
    const { ingredient } = variables;
    
    const results = recipesData.filter(recipe =>
      recipe.ingredients && recipe.ingredients.some(ing => 
        ing.toLowerCase().includes(ingredient.toLowerCase())
      )
    );

    return HttpResponse.json({
      data: {
        recipes: results
      }
    });
  }),

  // Query: getNutritionInfo
  graphql.query('GetNutritionInfo', async ({ variables }) => {
    await networkDelay();
    const { recipeId } = variables;
    const recipe = recipesData.find(r => String(r.id) === String(recipeId));

    if (!recipe) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Receta no encontrada',
            extensions: { code: 'NOT_FOUND' }
          }
        ]
      });
    }

    return HttpResponse.json({
      data: {
        nutrition: {
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          recipeId: recipe.id
        }
      }
    });
  }),

  // Query: getPopularRecipes
  graphql.query('GetPopularRecipes', async () => {
    await networkDelay();
    
    const popular = recipesData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    return HttpResponse.json({
      data: {
        popularRecipes: popular
      }
    });
  })
];

// Combinar todos los handlers
export const handlers = [...restHandlers, ...graphqlHandlers];
