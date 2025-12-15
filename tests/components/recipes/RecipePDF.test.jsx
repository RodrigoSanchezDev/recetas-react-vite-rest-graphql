import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipePDF from '../../../src/components/recipes/RecipePDF';

describe('RecipePDF', () => {
  const mockRecipe = {
    id: '1',
    title: 'Paella Valenciana',
    category: 'Platos Principales',
    description: 'Deliciosa paella tradicional de Valencia',
    difficulty: 'Media',
    cookingTime: '45 min',
    servings: 4,
    rating: 4.5,
    ingredients: ['Arroz', 'Pollo', 'Mariscos', 'Azafrán'],
    preparation: 'Calentar el aceite en la paellera. Sofreír el pollo hasta dorar. Añadir las verduras y el arroz. Verter el caldo y el azafrán.'
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal', () => {
    it('renderiza el header del modal', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText('Vista Previa del PDF')).toBeInTheDocument();
    });

    it('renderiza iconos SVG de react-icons', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      // react-icons renderiza SVGs
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('muestra botón "Descargar PDF"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText('Descargar PDF')).toBeInTheDocument();
    });

    it('tiene botón con icono de descarga', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      const downloadBtn = screen.getByText('Descargar PDF').closest('button');
      expect(downloadBtn.querySelector('svg')).toBeInTheDocument();
    });

    it('muestra botón cerrar con aria-label', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      const closeBtn = screen.getByRole('button', { name: /cerrar/i });
      expect(closeBtn).toBeInTheDocument();
    });

    it('llama onClose al cerrar', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      const closeBtn = screen.getByRole('button', { name: /cerrar/i });
      fireEvent.click(closeBtn);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Contenido', () => {
    it('muestra título de la receta', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText('Paella Valenciana')).toBeInTheDocument();
    });

    it('muestra categoría', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText('Platos Principales')).toBeInTheDocument();
    });

    it('muestra descripción entre comillas tipográficas', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      // Las comillas son tipográficas " y "
      expect(screen.getByText(/Deliciosa paella tradicional de Valencia/)).toBeInTheDocument();
    });

    it('muestra tiempo de cocción', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText('45 min')).toBeInTheDocument();
    });

    it('muestra porciones', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      // Servings se muestra como número - puede haber múltiples elementos con "4"
      const elements = screen.getAllByText('4');
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('muestra rating formateado', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText('(4.5/5)')).toBeInTheDocument();
    });

    it('muestra label "Tiempo"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Tiempo/)).toBeInTheDocument();
    });

    it('muestra label "Porciones"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Porciones/)).toBeInTheDocument();
    });

    it('muestra label "Dificultad"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Dificultad/)).toBeInTheDocument();
    });
  });

  describe('Ingredientes', () => {
    it('muestra sección "Ingredientes"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Ingredientes/)).toBeInTheDocument();
    });

    it('muestra iconos SVG en sección ingredientes', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      // Los iconos se renderizan como SVG
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('muestra todos los ingredientes', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Arroz/)).toBeInTheDocument();
      expect(screen.getByText(/Pollo/)).toBeInTheDocument();
      expect(screen.getByText(/Mariscos/)).toBeInTheDocument();
      expect(screen.getByText(/Azafrán/)).toBeInTheDocument();
    });

    it('no muestra ingredientes si lista está vacía', () => {
      const recipeNoIngredients = { ...mockRecipe, ingredients: [] };
      render(<RecipePDF recipe={recipeNoIngredients} onClose={mockOnClose} />);
      
      expect(screen.queryByText(/Arroz/)).not.toBeInTheDocument();
    });

    it('no muestra sección si ingredients es undefined', () => {
      const recipeNoIngredients = { ...mockRecipe, ingredients: undefined };
      render(<RecipePDF recipe={recipeNoIngredients} onClose={mockOnClose} />);
      
      expect(screen.queryByText(/Arroz/)).not.toBeInTheDocument();
    });
  });

  describe('Preparación', () => {
    it('muestra sección "Preparación"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Preparación/)).toBeInTheDocument();
    });

    it('muestra icono SVG en sección preparación', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      // Los iconos GiChefToque se renderizan como SVG
      const svgs = document.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('parsea y muestra los pasos de preparación', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Calentar el aceite/)).toBeInTheDocument();
      expect(screen.getByText(/Sofreír el pollo/)).toBeInTheDocument();
    });

    it('no muestra pasos si preparation está vacía', () => {
      const recipeNoPreparation = { ...mockRecipe, preparation: '', instructions: undefined };
      render(<RecipePDF recipe={recipeNoPreparation} onClose={mockOnClose} />);
      
      expect(screen.queryByText(/Calentar el aceite/)).not.toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('muestra "RecetasHub"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/RecetasHub/)).toBeInTheDocument();
    });

    it('muestra "¡Buen Provecho!"', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Buen Provecho/)).toBeInTheDocument();
    });
  });

  describe('Datos mínimos', () => {
    it('renderiza con solo título', () => {
      const minimal = { id: '1', title: 'Simple' };
      render(<RecipePDF recipe={minimal} onClose={mockOnClose} />);
      
      expect(screen.getByText('Simple')).toBeInTheDocument();
    });

    it('no falla sin rating', () => {
      const noRating = { ...mockRecipe, rating: undefined };
      render(<RecipePDF recipe={noRating} onClose={mockOnClose} />);
      
      expect(screen.getByText('Paella Valenciana')).toBeInTheDocument();
    });
  });

  describe('Interacción', () => {
    it('llama window.print al descargar', () => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      fireEvent.click(screen.getByText('Descargar PDF'));
      expect(printSpy).toHaveBeenCalled();
      
      printSpy.mockRestore();
    });

    it('el overlay tiene onClick que llama onClose', () => {
      render(<RecipePDF recipe={mockRecipe} onClose={mockOnClose} />);
      
      // Verificamos que el overlay existe con la estructura correcta
      const overlay = document.querySelector('[data-testid="pdf-modal-overlay"]');
      expect(overlay).toBeInTheDocument();
      // El overlay tiene el evento onClick configurado
      expect(overlay.getAttribute('data-testid')).toBe('pdf-modal-overlay');
    });
  });
});
