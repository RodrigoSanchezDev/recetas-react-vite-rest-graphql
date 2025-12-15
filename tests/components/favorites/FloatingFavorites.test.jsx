import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FloatingFavorites from '../../../src/components/favorites/FloatingFavorites';
import { FavoritesContext } from '../../../src/context/FavoritesContext';

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
        <FloatingFavorites />
      </FavoritesContext.Provider>
    </BrowserRouter>
  );
};

describe('FloatingFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Botón flotante', () => {
    it('renderiza el botón flotante con aria-label', () => {
      const context = createMockContext([]);
      renderWithContext(context);
      
      expect(screen.getByLabelText('Ver mi colección')).toBeInTheDocument();
    });

    it('muestra contador cuando hay favoritos', () => {
      const context = createMockContext([{ id: '1' }, { id: '2' }]);
      renderWithContext(context);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('no muestra contador cuando no hay favoritos', () => {
      const context = createMockContext([]);
      renderWithContext(context);
      
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('llama toggleDrawer al hacer clic', () => {
      const mockToggle = vi.fn();
      const context = createMockContext([], { toggleDrawer: mockToggle });
      renderWithContext(context);
      
      fireEvent.click(screen.getByLabelText('Ver mi colección'));
      expect(mockToggle).toHaveBeenCalled();
    });
  });

  describe('Drawer cerrado', () => {
    it('drawer tiene clase translate-x-full cuando está cerrado', () => {
      const context = createMockContext([], { isDrawerOpen: false });
      const { container } = renderWithContext(context);
      
      expect(container.querySelector('.translate-x-full')).toBeInTheDocument();
    });

    it('no muestra overlay cuando drawer está cerrado', () => {
      const context = createMockContext([], { isDrawerOpen: false });
      const { container } = renderWithContext(context);
      
      expect(container.querySelector('.bg-black\\/40')).not.toBeInTheDocument();
    });
  });

  describe('Drawer abierto', () => {
    it('drawer tiene clase translate-x-0 cuando está abierto', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      const { container } = renderWithContext(context);
      
      expect(container.querySelector('.translate-x-0')).toBeInTheDocument();
    });

    it('muestra título "Mi Colección"', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('Mi Colección')).toBeInTheDocument();
    });

    it('muestra botón cerrar con icono', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      // El botón cerrar tiene aria-label
      const closeBtn = screen.getByRole('button', { name: /cerrar/i });
      expect(closeBtn).toBeInTheDocument();
    });

    it('llama setIsDrawerOpen(false) al cerrar', () => {
      const mockSetDrawer = vi.fn();
      const context = createMockContext([], { isDrawerOpen: true, setIsDrawerOpen: mockSetDrawer });
      renderWithContext(context);
      
      const closeBtn = screen.getByRole('button', { name: /cerrar/i });
      fireEvent.click(closeBtn);
      expect(mockSetDrawer).toHaveBeenCalledWith(false);
    });

    it('muestra overlay', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      const { container } = renderWithContext(context);
      
      expect(container.querySelector('.bg-black\\/40')).toBeInTheDocument();
    });

    it('cierra drawer al hacer clic en overlay', () => {
      const mockSetDrawer = vi.fn();
      const context = createMockContext([], { isDrawerOpen: true, setIsDrawerOpen: mockSetDrawer });
      const { container } = renderWithContext(context);
      
      const overlay = container.querySelector('.bg-black\\/40');
      fireEvent.click(overlay);
      expect(mockSetDrawer).toHaveBeenCalledWith(false);
    });
  });

  describe('Drawer vacío', () => {
    it('muestra "Tu colección está vacía"', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('Tu colección está vacía')).toBeInTheDocument();
    });

    it('muestra mensaje motivacional', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('¡Explora recetas y guarda tus favoritas!')).toBeInTheDocument();
    });

    it('muestra enlace "Explorar Recetas"', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      const link = screen.getByText('Explorar Recetas');
      expect(link.closest('a')).toHaveAttribute('href', '/recetas');
    });

    it('muestra icono de libro SVG', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      // El icono de libro ahora es un SVG de react-icons
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('muestra "0 recetas guardadas"', () => {
      const context = createMockContext([], { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('0 recetas guardadas')).toBeInTheDocument();
    });
  });

  describe('Drawer con favoritos', () => {
    const mockFavorites = [
      { id: '1', title: 'Paella', category: 'Platos', cookingTime: '45 min', rating: 4.5, image: 'img.jpg' },
      { id: '2', title: 'Brownie', category: 'Postres', cookingTime: '30 min', rating: 4.8, image: 'img2.jpg' }
    ];

    it('muestra las recetas favoritas', () => {
      const context = createMockContext(mockFavorites, { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('Paella')).toBeInTheDocument();
      expect(screen.getByText('Brownie')).toBeInTheDocument();
    });

    it('muestra categorías', () => {
      const context = createMockContext(mockFavorites, { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('Platos')).toBeInTheDocument();
      expect(screen.getByText('Postres')).toBeInTheDocument();
    });

    it('muestra imágenes', () => {
      const context = createMockContext(mockFavorites, { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('muestra botones eliminar', () => {
      const context = createMockContext(mockFavorites, { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getAllByLabelText('Quitar de favoritos')).toHaveLength(2);
    });

    it('llama removeFromFavorites al eliminar', () => {
      const mockRemove = vi.fn();
      const context = createMockContext(mockFavorites, { isDrawerOpen: true, removeFromFavorites: mockRemove });
      renderWithContext(context);
      
      fireEvent.click(screen.getAllByLabelText('Quitar de favoritos')[0]);
      expect(mockRemove).toHaveBeenCalledWith('1');
    });

    it('muestra "Ver toda mi colección"', () => {
      const context = createMockContext(mockFavorites, { isDrawerOpen: true });
      renderWithContext(context);
      
      const link = screen.getByText('Ver toda mi colección');
      expect(link.closest('a')).toHaveAttribute('href', '/mi-coleccion');
    });

    it('muestra contador plural', () => {
      const context = createMockContext(mockFavorites, { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('2 recetas guardadas')).toBeInTheDocument();
    });

    it('muestra contador singular para una receta', () => {
      const context = createMockContext([mockFavorites[0]], { isDrawerOpen: true });
      renderWithContext(context);
      
      expect(screen.getByText('1 receta guardada')).toBeInTheDocument();
    });
  });
});
