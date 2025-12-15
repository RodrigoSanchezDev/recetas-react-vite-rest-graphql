import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../../src/context/FavoritesContext';

// Componente de prueba para interactuar con el contexto
const TestComponent = () => {
  const { 
    favorites, 
    favoritesCount, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    toggleFavorite,
    clearFavorites,
    isDrawerOpen,
    toggleDrawer,
    setIsDrawerOpen
  } = useFavorites();

  const testRecipe = { id: '1', title: 'Test Recipe', category: 'Postres' };
  const testRecipe2 = { id: '2', title: 'Second Recipe', category: 'Platos' };

  return (
    <div>
      <span data-testid="count">{favoritesCount}</span>
      <span data-testid="drawer-open">{isDrawerOpen.toString()}</span>
      <span data-testid="is-favorite-1">{isFavorite('1').toString()}</span>
      <span data-testid="is-favorite-2">{isFavorite('2').toString()}</span>
      <ul data-testid="favorites-list">
        {favorites.map(f => <li key={f.id}>{f.title}</li>)}
      </ul>
      <button onClick={() => addToFavorites(testRecipe)}>Add</button>
      <button onClick={() => addToFavorites(testRecipe2)}>Add Second</button>
      <button onClick={() => removeFromFavorites('1')}>Remove</button>
      <button onClick={() => toggleFavorite(testRecipe)}>Toggle</button>
      <button onClick={clearFavorites}>Clear</button>
      <button onClick={toggleDrawer}>Toggle Drawer</button>
      <button onClick={() => setIsDrawerOpen(true)}>Open Drawer</button>
      <button onClick={() => setIsDrawerOpen(false)}>Close Drawer</button>
    </div>
  );
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    localStorage.removeItem('recetashub-favorites');
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Limpiar también después para evitar estado persistente
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('provee el contexto correctamente', () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('lanza error cuando se usa fuera del provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFavorites debe ser usado dentro de FavoritesProvider');
    
    consoleSpy.mockRestore();
  });

  describe('addToFavorites', () => {
    it('agrega una receta a favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(screen.getByTestId('favorites-list')).toHaveTextContent('Test Recipe');
    });

    it('no agrega duplicados', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Add'));
      
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });

    it('puede agregar múltiples recetas diferentes', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Add Second'));
      
      expect(screen.getByTestId('count')).toHaveTextContent('2');
    });

    it('abre el drawer al agregar', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
      fireEvent.click(screen.getByText('Add'));
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('true');
    });
  });

  describe('removeFromFavorites', () => {
    it('elimina una receta de favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      
      fireEvent.click(screen.getByText('Remove'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('no hace nada si la receta no existe', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Remove'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('isFavorite', () => {
    it('retorna false si la receta NO está en favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    });

    it('retorna true si la receta SÍ está en favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    });
  });

  describe('toggleFavorite', () => {
    it('agrega cuando no está en favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });

    it('elimina cuando ya está en favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      
      fireEvent.click(screen.getByText('Toggle'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('clearFavorites', () => {
    it('limpia todos los favoritos', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Add Second'));
      expect(screen.getByTestId('count')).toHaveTextContent('2');
      
      fireEvent.click(screen.getByText('Clear'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('Drawer state', () => {
    it('toggleDrawer alterna el estado', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
      fireEvent.click(screen.getByText('Toggle Drawer'));
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('true');
      fireEvent.click(screen.getByText('Toggle Drawer'));
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
    });

    it('setIsDrawerOpen(true) abre el drawer', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
      fireEvent.click(screen.getByText('Open Drawer'));
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('true');
    });

    it('setIsDrawerOpen(false) cierra el drawer', () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      fireEvent.click(screen.getByText('Open Drawer'));
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('true');
      
      fireEvent.click(screen.getByText('Close Drawer'));
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
    });
  });

  describe('localStorage', () => {
    it('persiste favoritos en localStorage', async () => {
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
      
      fireEvent.click(screen.getByText('Add'));
      
      // Esperar a que React actualice el estado
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1');
      });
      
      // Verificamos que localStorage tiene datos
      await waitFor(() => {
        const stored = localStorage.getItem('recetashub-favorites');
        expect(stored).not.toBeNull();
        const parsed = JSON.parse(stored);
        expect(parsed.length).toBeGreaterThan(0);
      });
    });

    it('guarda y recupera datos del localStorage correctamente', async () => {
      // Este test verifica el ciclo completo: guardar -> verificar localStorage
      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );
      
      // Agregar un favorito
      fireEvent.click(screen.getByText('Add'));
      
      await waitFor(() => {
        // Verificar que se guardó en localStorage
        const stored = localStorage.getItem('recetashub-favorites');
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored);
        expect(parsed.some(item => item.id === '1')).toBe(true);
      });
    });

    it('maneja localStorage vacío correctamente', () => {
      localStorage.setItem('recetashub-favorites', '');

      render(
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });
});
