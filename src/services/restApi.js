// REST API usando MSW (Mock Service Worker)
// En desarrollo: MSW intercepta las peticiones
// En producción: Usa datos estáticos del JSON

import recipesData from '../data/recipes.json';

const API_BASE_URL = '/api';
const IS_PRODUCTION = import.meta.env.PROD;

// Funciones de producción exportadas para testing
export const productionHelpers = {
  getRecipesFromStatic: () => ({
    success: true,
    data: recipesData,
    count: recipesData.length
  }),

  getRecipeByIdFromStatic: (id) => {
    const recipe = recipesData.find(r => r.id === id || r.id === String(id) || r.id === parseInt(id));
    return recipe 
      ? { success: true, data: recipe }
      : { success: false, message: 'Receta no encontrada' };
  },

  getRecipesByCategoryFromStatic: (category) => {
    const filtered = recipesData.filter(r => r.category === category);
    return {
      success: true,
      data: filtered,
      count: filtered.length
    };
  },

  searchRecipesFromStatic: (query) => {
    const lowerQuery = query.toLowerCase();
    const results = recipesData.filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.category.toLowerCase().includes(lowerQuery) ||
      (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery)))
    );
    return {
      success: true,
      data: results,
      count: results.length
    };
  },

  createRecipeFromStatic: (recipeData) => {
    const newRecipe = {
      ...recipeData,
      id: (recipesData.length + 1).toString()
    };
    return {
      success: true,
      data: newRecipe,
      message: 'Receta creada exitosamente (demo mode)'
    };
  },

  getCategoriesFromStatic: () => {
    const categories = [...new Set(recipesData.map(r => r.category))];
    return {
      success: true,
      data: categories,
      count: categories.length
    };
  },

  getStatsFromStatic: () => {
    const recipes = recipesData;
    const categories = [...new Set(recipes.map(r => r.category))];
    const totalServings = recipes.reduce((sum, r) => sum + r.servings, 0);
    const averageRating = recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length;

    return {
      success: true,
      data: {
        totalRecipes: recipes.length,
        categories: categories.length,
        totalServings,
        averageRating: Math.round(averageRating * 10) / 10
      }
    };
  }
};

export const restApi = {
  // GET: Obtener todas las recetas
  async getRecipes() {
    if (IS_PRODUCTION) {
      return productionHelpers.getRecipesFromStatic();
    }
    const response = await fetch(`${API_BASE_URL}/recipes`);
    return response.json();
  },

  // GET: Obtener receta por ID
  async getRecipeById(id) {
    if (IS_PRODUCTION) {
      return productionHelpers.getRecipeByIdFromStatic(id);
    }
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return response.json();
  },

  // GET: Filtrar recetas por categoría
  async getRecipesByCategory(category) {
    if (IS_PRODUCTION) {
      return productionHelpers.getRecipesByCategoryFromStatic(category);
    }
    const response = await fetch(`${API_BASE_URL}/recipes/category/${category}`);
    return response.json();
  },

  // GET: Buscar recetas
  async searchRecipes(query) {
    if (IS_PRODUCTION) {
      return productionHelpers.searchRecipesFromStatic(query);
    }
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // POST: Crear nueva receta
  async createRecipe(recipeData) {
    if (IS_PRODUCTION) {
      return productionHelpers.createRecipeFromStatic(recipeData);
    }
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    });
    return response.json();
  },

  // GET: Obtener categorías únicas
  async getCategories() {
    if (IS_PRODUCTION) {
      return productionHelpers.getCategoriesFromStatic();
    }
    const response = await fetch(`${API_BASE_URL}/recipes`);
    const data = await response.json();
    
    if (data.success) {
      const categories = [...new Set(data.data.map(r => r.category))];
      return {
        success: true,
        data: categories,
        count: categories.length
      };
    }
    return data;
  },

  // GET: Estadísticas generales
  async getStats() {
    if (IS_PRODUCTION) {
      return productionHelpers.getStatsFromStatic();
    }
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  }
};
