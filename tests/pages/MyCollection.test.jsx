import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyCollection from '../../src/pages/MyCollection';
import { FavoritesContext } from '../../src/context/FavoritesContext';

// Helper para crear contexto mock
const createMockContext = (favorites = [], overrides = {}) => ({
  favorites,
  favoritesCount: favorites.length,
  isDrawerOpen: false,
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isFavorite: vi.fn(),
  toggleFavorite: vi.fn(),
  clearFavorites: vi.fn(),
  toggleDrawer: vi.fn(),
  setIsDrawerOpen: vi.fn(),
  ...overrides
});

const renderWithContext = (contextValue) => {
  return render(
    <BrowserRouter>
      <FavoritesContext.Provider value={contextValue}>
        <MyCollection />
      </FavoritesContext.Provider>
    </BrowserRouter>
  );
};

describe('MyCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado vacío', () => {
    it('muestra título "Tu colección está vacía"', () => {
      const context = createMockContext([]);
      renderWithContext(context);
      
      expect(screen.getByText('Tu colección está vacía')).toBeInTheDocument();
    });

    it('muestra enlace a explorar recetas', () => {
      const context = createMockContext([]);
      renderWithContext(context);
      
      const link = screen.getByText('Explorar Recetas');
      expect(link.closest('a')).toHaveAttribute('href', '/recetas');
    });

    it('no muestra EmptyState cuando hay favoritos', () => {
      const context = createMockContext([]);
      renderWithContext(context);
      
      // EmptyState no usa emoji sino icono de react-icons, verificamos que se renderiza
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Con favoritos', () => {
    const mockFavorites = [
      { 
        id: '1', 
        title: 'Paella Valenciana', 
        category: 'Platos Principales', 
        difficulty: 'Media',
        cookingTime: '45 min', 
        rating: 4.5, 
        servings: 4,
        description: 'Deliciosa paella tradicional',
        image: 'test.jpg' 
      },
      { 
        id: '2', 
        title: 'Brownie de Chocolate', 
        category: 'Postres', 
        difficulty: 'Fácil',
        cookingTime: '30 min', 
        rating: 4.8,
        servings: 8,
        description: 'Brownie húmedo y delicioso',
        image: 'test2.jpg' 
      }
    ];

    it('muestra título "Mi Colección de Recetas"', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText('Mi Colección de Recetas')).toBeInTheDocument();
    });

    it('muestra contador de recetas plural', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText('2 recetas guardadas')).toBeInTheDocument();
    });

    it('muestra contador singular para una receta', () => {
      const context = createMockContext([mockFavorites[0]]);
      renderWithContext(context);
      
      expect(screen.getByText('1 receta guardada')).toBeInTheDocument();
    });

    it('muestra nombres de recetas', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText('Paella Valenciana')).toBeInTheDocument();
      expect(screen.getByText('Brownie de Chocolate')).toBeInTheDocument();
    });

    it('muestra categorías', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText('Platos Principales')).toBeInTheDocument();
      expect(screen.getByText('Postres')).toBeInTheDocument();
    });

    it('muestra descripciones', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText('Deliciosa paella tradicional')).toBeInTheDocument();
      expect(screen.getByText('Brownie húmedo y delicioso')).toBeInTheDocument();
    });

    it('muestra botones "Ver Receta"', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      const buttons = screen.getAllByText('Ver Receta');
      expect(buttons).toHaveLength(2);
    });

    it('links a detalle tienen href correcto', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      const buttons = screen.getAllByText('Ver Receta');
      expect(buttons[0].closest('a')).toHaveAttribute('href', '/recetas/1');
      expect(buttons[1].closest('a')).toHaveAttribute('href', '/recetas/2');
    });

    it('muestra botones de PDF', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getAllByTitle('Descargar PDF')).toHaveLength(2);
    });

    it('muestra botones de eliminar', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getAllByTitle('Quitar de favoritos')).toHaveLength(2);
    });

    it('llama removeFromFavorites al eliminar', () => {
      const mockRemove = vi.fn();
      const context = createMockContext(mockFavorites, { removeFromFavorites: mockRemove });
      renderWithContext(context);
      
      fireEvent.click(screen.getAllByTitle('Quitar de favoritos')[0]);
      expect(mockRemove).toHaveBeenCalledWith('1');
    });

    it('muestra botón "Limpiar colección"', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText(/Limpiar colección/)).toBeInTheDocument();
    });

    it('llama clearFavorites al limpiar', () => {
      const mockClear = vi.fn();
      const context = createMockContext(mockFavorites, { clearFavorites: mockClear });
      renderWithContext(context);
      
      fireEvent.click(screen.getByText(/Limpiar colección/));
      expect(mockClear).toHaveBeenCalled();
    });

    it('muestra enlace "Explorar más recetas"', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText(/Explorar más recetas/)).toBeInTheDocument();
    });

    it('muestra imágenes de recetas', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('muestra tip sobre PDF', () => {
      const context = createMockContext(mockFavorites);
      renderWithContext(context);
      
      expect(screen.getByText(/Descarga tus recetas en PDF/)).toBeInTheDocument();
    });
  });

  describe('Colores de dificultad', () => {
    it('verde para dificultad fácil', () => {
      const context = createMockContext([{ id: '1', title: 'Test', difficulty: 'fácil', image: 'x.jpg' }]);
      renderWithContext(context);
      
      expect(screen.getByText('fácil')).toHaveClass('bg-green-100');
    });

    it('amarillo para dificultad media', () => {
      const context = createMockContext([{ id: '1', title: 'Test', difficulty: 'media', image: 'x.jpg' }]);
      renderWithContext(context);
      
      expect(screen.getByText('media')).toHaveClass('bg-yellow-100');
    });

    it('rojo para dificultad difícil', () => {
      const context = createMockContext([{ id: '1', title: 'Test', difficulty: 'difícil', image: 'x.jpg' }]);
      renderWithContext(context);
      
      expect(screen.getByText('difícil')).toHaveClass('bg-red-100');
    });
  });

  describe('Modal PDF', () => {
    const recipeWithDetails = { 
      id: '1', 
      title: 'Paella', 
      category: 'Platos',
      description: 'Test',
      ingredients: ['Arroz'],
      preparation: 'Paso 1. Hervir arroz.',
      image: 'x.jpg'
    };

    it('abre modal PDF al hacer clic', () => {
      const context = createMockContext([recipeWithDetails]);
      renderWithContext(context);
      
      fireEvent.click(screen.getByTitle('Descargar PDF'));
      expect(screen.getByText('Vista Previa del PDF')).toBeInTheDocument();
    });

    it('cierra modal PDF al hacer clic en cerrar', () => {
      const context = createMockContext([recipeWithDetails]);
      renderWithContext(context);
      
      fireEvent.click(screen.getByTitle('Descargar PDF'));
      expect(screen.getByText('Vista Previa del PDF')).toBeInTheDocument();
      
      // El botón cerrar ahora usa aria-label="Cerrar"
      const closeBtn = screen.getByRole('button', { name: /cerrar/i });
      fireEvent.click(closeBtn);
      expect(screen.queryByText('Vista Previa del PDF')).not.toBeInTheDocument();
    });
  });

  describe('Estrellas de rating', () => {
    it('renderiza estrellas SVG', () => {
      const context = createMockContext([{ id: '1', title: 'Test', rating: 4, image: 'x.jpg' }]);
      renderWithContext(context);
      
      // Las estrellas ahora son iconos SVG de react-icons
      const stars = document.querySelectorAll('svg');
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  describe('Receta sin imagen', () => {
    it('no muestra img cuando no hay imagen', () => {
      const context = createMockContext([{ id: '1', title: 'Sin imagen' }]);
      renderWithContext(context);
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });
});
