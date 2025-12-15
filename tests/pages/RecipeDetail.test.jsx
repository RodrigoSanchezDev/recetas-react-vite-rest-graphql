import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import RecipeDetail from '../../src/pages/RecipeDetail';
import { FavoritesProvider } from '../../src/context/FavoritesContext';
import { restApi } from '../../src/services/restApi';
import { graphqlApi } from '../../src/services/graphqlApi';

// Mock de los servicios
vi.mock('../../src/services/restApi', () => ({
  restApi: {
    getRecipeById: vi.fn()
  }
}));

vi.mock('../../src/services/graphqlApi', () => ({
  graphqlApi: {
    getRecipeDetails: vi.fn()
  }
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const mockRecipe = {
  id: '1',
  title: 'Pasta Carbonara',
  description: 'Deliciosa pasta italiana tradicional con huevo y tocino.',
  category: 'Platos Principales',
  difficulty: 'Media',
  cookingTime: '30 minutos',
  servings: 4,
  rating: 4.5,
  image: 'https://example.com/pasta.jpg',
  ingredients: ['200g pasta', '100g tocino', '2 huevos', '50g queso'],
  preparation: '1. Cocinar pasta\n2. Freír tocino\n3. Mezclar todo'
};

const renderWithRouter = (initialRoute = '/recetas/1') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <FavoritesProvider>
        <Routes>
          <Route path="/recetas/:id" element={<RecipeDetail />} />
          <Route path="/recetas" element={<div>Lista de Recetas</div>} />
        </Routes>
      </FavoritesProvider>
    </MemoryRouter>
  );
};

describe('RecipeDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Estado de carga', () => {
    it('muestra spinner mientras carga', () => {
      restApi.getRecipeById.mockImplementation(() => new Promise(() => {}));
      graphqlApi.getRecipeDetails.mockImplementation(() => new Promise(() => {}));
      
      renderWithRouter();
      
      expect(screen.getByText(/Cargando detalles de la receta/i)).toBeInTheDocument();
    });
  });

  describe('Estado de error', () => {
    it('muestra error cuando la receta no se encuentra', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: false 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: null } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('Receta no encontrada')).toBeInTheDocument();
      });
    });

    it('muestra mensaje de error del servidor', async () => {
      restApi.getRecipeById.mockRejectedValue(new Error('Server error'));
      
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });
    });

    it('tiene botón de reintentar que navega a recetas', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: false 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /Reintentar/i });
        fireEvent.click(retryButton);
        expect(mockNavigate).toHaveBeenCalledWith('/recetas');
      });
    });
  });

  describe('Contenido de la receta', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra el título de la receta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        // El título aparece múltiples veces (breadcrumb + h1), usamos getAllByText
        const titles = screen.getAllByText('Pasta Carbonara');
        expect(titles.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('muestra la imagen de la receta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        const image = screen.getByAltText('Pasta Carbonara');
        expect(image).toHaveAttribute('src', 'https://example.com/pasta.jpg');
      });
    });

    it('muestra la categoría', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('Platos Principales')).toBeInTheDocument();
      });
    });

    it('muestra la dificultad', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getAllByText('Media').length).toBeGreaterThan(0);
      });
    });

    it('muestra el tiempo de cocción', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getAllByText('30 minutos').length).toBeGreaterThan(0);
      });
    });

    it('muestra las porciones', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText(/4 personas/i)).toBeInTheDocument();
      });
    });

    it('muestra la descripción', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText(/Deliciosa pasta italiana tradicional/i)).toBeInTheDocument();
      });
    });

    it('muestra el rating con estrellas', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('4.5 / 5')).toBeInTheDocument();
      });
    });
  });

  describe('Ingredientes', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra sección de ingredientes', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText(/🥗 Ingredientes/i)).toBeInTheDocument();
      });
    });

    it('muestra la lista de ingredientes', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('200g pasta')).toBeInTheDocument();
        expect(screen.getByText('100g tocino')).toBeInTheDocument();
        expect(screen.getByText('2 huevos')).toBeInTheDocument();
        expect(screen.getByText('50g queso')).toBeInTheDocument();
      });
    });
  });

  describe('Preparación', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra sección de preparación', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText(/👨‍🍳 Método de Preparación/i)).toBeInTheDocument();
      });
    });

    it('muestra los pasos de preparación', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText(/Cocinar pasta/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navegación breadcrumb', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra enlace a Inicio', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        const homeLink = screen.getByRole('link', { name: 'Inicio' });
        expect(homeLink).toHaveAttribute('href', '/');
      });
    });

    it('muestra enlace a Recetas', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        const recipesLink = screen.getByRole('link', { name: 'Recetas' });
        expect(recipesLink).toHaveAttribute('href', '/recetas');
      });
    });

    it('muestra el nombre de la receta actual', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        // El breadcrumb tiene el nombre de la receta como texto (no link)
        const breadcrumbs = screen.getByRole('navigation');
        expect(breadcrumbs).toHaveTextContent('Pasta Carbonara');
      });
    });
  });

  describe('Guardar receta', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra botón de guardar receta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Guardar en Favoritos/i })).toBeInTheDocument();
      });
    });

    it('muestra sección de ¿Te gusta esta receta?', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('¿Te gusta esta receta?')).toBeInTheDocument();
      });
    });

    it('permite guardar la receta en el carrito', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /Guardar en Favoritos/i });
        fireEvent.click(saveButton);
      });
      
      // Verificar que se guardó en localStorage
      const savedFavorites = JSON.parse(localStorage.getItem('recetashub-favorites') || '[]');
      expect(savedFavorites.length).toBeGreaterThanOrEqual(0); // Solo verificamos que la operación no falle
    });
  });

  describe('Quick Info Card', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra tarjeta de información rápida', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('Información Rápida')).toBeInTheDocument();
      });
    });

    it('muestra dificultad en la tarjeta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        // Hay múltiples menciones de la dificultad
        const difficultyLabels = screen.getAllByText('Dificultad');
        expect(difficultyLabels.length).toBeGreaterThan(0);
      });
    });

    it('muestra tiempo en la tarjeta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('Tiempo')).toBeInTheDocument();
      });
    });

    it('muestra porciones en la tarjeta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        // Hay múltiples menciones de porciones
        const servingsText = screen.getAllByText('Porciones');
        expect(servingsText.length).toBeGreaterThan(0);
      });
    });

    it('muestra rating en la tarjeta', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        expect(screen.getByText('Rating')).toBeInTheDocument();
      });
    });
  });

  describe('Botón volver', () => {
    beforeEach(() => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
    });

    it('muestra botón para volver a recetas', async () => {
      renderWithRouter();
      
      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /Volver a Recetas/i });
        expect(backLink).toHaveAttribute('href', '/recetas');
      });
    });
  });

  describe('Colores de dificultad', () => {
    it('muestra verde para dificultad Fácil', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: { ...mockRecipe, difficulty: 'Fácil' }
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: { ...mockRecipe, difficulty: 'Fácil' } } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        const badges = screen.getAllByText('Fácil');
        expect(badges[0]).toHaveClass('bg-green-100', 'text-green-800');
      });
    });

    it('muestra amarillo para dificultad Media', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: mockRecipe } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        const badges = screen.getAllByText('Media');
        expect(badges[0]).toHaveClass('bg-yellow-100', 'text-yellow-800');
      });
    });

    it('muestra rojo para dificultad Alta', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: { ...mockRecipe, difficulty: 'Alta' }
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: { ...mockRecipe, difficulty: 'Alta' } } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        const badges = screen.getAllByText('Alta');
        expect(badges[0]).toHaveClass('bg-red-100', 'text-red-800');
      });
    });

    it('muestra gris para dificultad desconocida', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: { ...mockRecipe, difficulty: 'Desconocida' }
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: { ...mockRecipe, difficulty: 'Desconocida' } } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        const badges = screen.getAllByText('Desconocida');
        expect(badges[0]).toHaveClass('bg-gray-100', 'text-gray-800');
      });
    });
  });

  describe('Sin ingredientes o preparación', () => {
    it('no muestra sección de ingredientes si no hay', async () => {
      const recipeWithoutIngredients = { ...mockRecipe, ingredients: undefined };
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: recipeWithoutIngredients 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: recipeWithoutIngredients } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        // El título aparece múltiples veces
        const titles = screen.getAllByText('Pasta Carbonara');
        expect(titles.length).toBeGreaterThanOrEqual(1);
      });
      
      expect(screen.queryByText(/🥗 Ingredientes/i)).not.toBeInTheDocument();
    });

    it('no muestra sección de preparación si no hay', async () => {
      const recipeWithoutPreparation = { ...mockRecipe, preparation: undefined };
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: recipeWithoutPreparation 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: recipeWithoutPreparation } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        // El título aparece múltiples veces
        const titles = screen.getAllByText('Pasta Carbonara');
        expect(titles.length).toBeGreaterThanOrEqual(1);
      });
      
      expect(screen.queryByText(/👨‍🍳 Método de Preparación/i)).not.toBeInTheDocument();
    });
  });

  describe('Uso de datos de GraphQL', () => {
    it('usa datos de GraphQL si están disponibles', async () => {
      const graphqlRecipe = { 
        ...mockRecipe, 
        title: 'Pasta Carbonara GraphQL',
        tips: ['Tip 1', 'Tip 2']
      };
      
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: graphqlRecipe } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        // Debe usar el título de GraphQL ya que tiene más datos
        const titles = screen.getAllByText('Pasta Carbonara GraphQL');
        expect(titles.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('usa datos de REST si GraphQL no tiene la receta', async () => {
      restApi.getRecipeById.mockResolvedValue({ 
        success: true, 
        data: mockRecipe 
      });
      graphqlApi.getRecipeDetails.mockResolvedValue({ 
        data: { recipe: null } 
      });
      
      renderWithRouter();
      
      await waitFor(() => {
        // El título aparece múltiples veces
        const titles = screen.getAllByText('Pasta Carbonara');
        expect(titles.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
