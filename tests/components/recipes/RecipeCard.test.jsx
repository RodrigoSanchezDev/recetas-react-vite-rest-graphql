import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from '../../../src/components/recipes/RecipeCard';
import { FavoritesContext } from '../../../src/context/FavoritesContext';

// Helper para crear contexto mock
const createMockContext = (overrides = {}) => ({
  favorites: [],
  favoritesCount: 0,
  isDrawerOpen: false,
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn(),
  clearFavorites: vi.fn(),
  toggleDrawer: vi.fn(),
  setIsDrawerOpen: vi.fn(),
  ...overrides
});

const renderWithContext = (ui, contextValue) => {
  return render(
    <BrowserRouter>
      <FavoritesContext.Provider value={contextValue}>
        {ui}
      </FavoritesContext.Provider>
    </BrowserRouter>
  );
};

describe('RecipeCard', () => {
  const mockRecipe = {
    id: '1',
    title: 'Paella Valenciana',
    description: 'Deliciosa paella tradicional de Valencia',
    category: 'Platos Principales',
    difficulty: 'Media',
    cookingTime: '45 min',
    servings: 4,
    rating: 4.5,
    image: 'https://example.com/paella.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título de la receta', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('Paella Valenciana')).toBeInTheDocument();
  });

  it('renderiza la descripción de la receta', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText(/Deliciosa paella tradicional/i)).toBeInTheDocument();
  });

  it('muestra la categoría de la receta', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('Platos Principales')).toBeInTheDocument();
  });

  it('muestra el nivel de dificultad', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('muestra el tiempo de cocción', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('muestra las porciones', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText(/4 porciones/)).toBeInTheDocument();
  });

  it('muestra el rating', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText(/4.5 \/ 5/)).toBeInTheDocument();
  });

  it('el enlace navega al detalle de la receta', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/recetas/1');
  });

  it('renderiza la imagen de la receta', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    const img = screen.getByRole('img', { name: 'Paella Valenciana' });
    expect(img).toHaveAttribute('src', 'https://example.com/paella.jpg');
  });

  it('aplica color verde para dificultad Fácil', () => {
    const easyRecipe = { ...mockRecipe, difficulty: 'Fácil' };
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={easyRecipe} />, context);
    
    const badge = screen.getByText('Fácil');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('aplica color amarillo para dificultad Media', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    const badge = screen.getByText('Media');
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('aplica color rojo para dificultad Alta', () => {
    const hardRecipe = { ...mockRecipe, difficulty: 'Alta' };
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={hardRecipe} />, context);
    
    const badge = screen.getByText('Alta');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('muestra "Guardar Receta" cuando NO está en favoritos', () => {
    const context = createMockContext({ isFavorite: vi.fn(() => false) });
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('Guardar Receta')).toBeInTheDocument();
  });

  it('muestra "En mi colección" cuando SÍ está en favoritos', () => {
    const context = createMockContext({ isFavorite: vi.fn(() => true) });
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('En mi colección')).toBeInTheDocument();
  });

  it('llama toggleFavorite al hacer clic en el botón', () => {
    const mockToggle = vi.fn();
    const context = createMockContext({ toggleFavorite: mockToggle });
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    const button = screen.getByText('Guardar Receta');
    fireEvent.click(button);
    
    expect(mockToggle).toHaveBeenCalledWith(mockRecipe);
  });

  it('muestra texto "Ver receta"', () => {
    const context = createMockContext();
    renderWithContext(<RecipeCard recipe={mockRecipe} />, context);
    
    expect(screen.getByText('Ver receta')).toBeInTheDocument();
  });
});
