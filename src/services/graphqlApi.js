// GraphQL API usando MSW (Mock Service Worker)
// En desarrollo: MSW intercepta las peticiones
// En producción: Usa datos estáticos del JSON

import recipesData from '../data/recipes.json';

const GRAPHQL_ENDPOINT = '/graphql';
const IS_PRODUCTION = import.meta.env.PROD;

// Manejador de queries en producción (exportado para testing)
export function handleProductionQuery(query, variables) {
  if (query.includes('GetRecipeDetails')) {
    const recipe = recipesData.find(r => r.id === variables.id || r.id === parseInt(variables.id));
    return { data: { recipe: recipe || null } };
  }
  
  if (query.includes('SearchByIngredient')) {
    const results = recipesData.filter(r => 
      r.ingredients?.some(ing => ing.toLowerCase().includes(variables.ingredient.toLowerCase()))
    );
    return { data: { recipes: results } };
  }
  
  if (query.includes('GetNutritionInfo')) {
    const recipe = recipesData.find(r => r.id === variables.recipeId || r.id === parseInt(variables.recipeId));
    return {
      data: {
        nutrition: {
          servings: recipe ? recipe.servings : 0,
          difficulty: recipe ? recipe.difficulty : '',
          recipeId: variables.recipeId
        }
      }
    };
  }
  
  if (query.includes('GetPopularRecipes')) {
    const popular = recipesData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    return { data: { popularRecipes: popular } };
  }
  
  return { data: null };
}

// Helper para hacer queries GraphQL
async function graphqlRequest(query, variables = {}) {
  // En producción, simular respuestas GraphQL con datos estáticos
  if (IS_PRODUCTION) {
    return handleProductionQuery(query, variables);
  }
  
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  
  return response.json();
}

// Queries predefinidos
export const graphqlQueries = {
  GET_RECIPE_DETAILS: `
    query GetRecipeDetails($id: ID!) {
      recipe(id: $id) {
        id
        title
        difficulty
        cookingTime
        category
        description
        servings
        rating
        ingredients
        preparation
        image
        tips
        nutritionFacts {
          calories
          protein
          carbs
          fat
        }
      }
    }
  `,

  SEARCH_BY_INGREDIENT: `
    query SearchByIngredient($ingredient: String!) {
      recipes(ingredient: $ingredient) {
        id
        title
        difficulty
        cookingTime
        ingredients
      }
    }
  `,

  GET_NUTRITION_INFO: `
    query GetNutritionInfo($recipeId: ID!) {
      nutrition(recipeId: $recipeId) {
        servings
        difficulty
        recipeId
      }
    }
  `,

  GET_POPULAR: `
    query GetPopularRecipes {
      popularRecipes {
        id
        title
        difficulty
        cookingTime
        category
        rating
      }
    }
  `
};

// API exportada
export const graphqlApi = {
  async query(queryString, variables) {
    return graphqlRequest(queryString, variables);
  },

  // Métodos de conveniencia
  async getRecipeDetails(id) {
    return graphqlRequest(graphqlQueries.GET_RECIPE_DETAILS, { id });
  },

  async searchByIngredient(ingredient) {
    return graphqlRequest(graphqlQueries.SEARCH_BY_INGREDIENT, { ingredient });
  },

  async getNutritionInfo(recipeId) {
    return graphqlRequest(graphqlQueries.GET_NUTRITION_INFO, { recipeId });
  },

  async getPopularRecipes() {
    return graphqlRequest(graphqlQueries.GET_POPULAR);
  }
};
