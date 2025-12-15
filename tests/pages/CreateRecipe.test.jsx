import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateRecipe from '../../src/pages/CreateRecipe';
import { restApi } from '../../src/services/restApi';

// Mock del servicio restApi
vi.mock('../../src/services/restApi', () => ({
  restApi: {
    createRecipe: vi.fn()
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

const renderCreateRecipe = () => {
  return render(
    <BrowserRouter>
      <CreateRecipe />
    </BrowserRouter>
  );
};

describe('CreateRecipe Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('muestra el título de la página', () => {
      renderCreateRecipe();
      
      expect(screen.getByText('Crear Nueva Receta')).toBeInTheDocument();
    });

    it('muestra el subtítulo', () => {
      renderCreateRecipe();
      
      expect(screen.getByText(/Comparte tu receta favorita/i)).toBeInTheDocument();
    });

    it('muestra sección de Información Básica', () => {
      renderCreateRecipe();
      
      expect(screen.getByText(/Información Básica/i)).toBeInTheDocument();
    });

    it('muestra sección de Ingredientes', () => {
      renderCreateRecipe();
      
      expect(screen.getByText(/🥗/)).toBeInTheDocument();
    });

    it('muestra sección de Método de Preparación', () => {
      renderCreateRecipe();
      
      expect(screen.getByText(/👨‍🍳/)).toBeInTheDocument();
    });
  });

  describe('Campos del formulario', () => {
    it('tiene campo para nombre de la receta', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Nombre de la Receta/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toBeRequired();
    });

    it('tiene selector de categoría', () => {
      renderCreateRecipe();
      
      const select = screen.getByLabelText(/Categoría/i);
      expect(select).toBeInTheDocument();
    });

    it('muestra todas las categorías disponibles', () => {
      renderCreateRecipe();
      
      const select = screen.getByLabelText(/Categoría/i);
      fireEvent.click(select);
      
      expect(screen.getByText('Postres')).toBeInTheDocument();
      expect(screen.getByText('Platos Principales')).toBeInTheDocument();
      expect(screen.getByText('Ensaladas')).toBeInTheDocument();
      expect(screen.getByText('Sopas')).toBeInTheDocument();
      expect(screen.getByText('Vegetariano')).toBeInTheDocument();
    });

    it('tiene selector de dificultad', () => {
      renderCreateRecipe();
      
      const select = screen.getByLabelText(/Dificultad/i);
      expect(select).toBeInTheDocument();
    });

    it('tiene las opciones de dificultad', () => {
      renderCreateRecipe();
      
      expect(screen.getByRole('option', { name: 'Fácil' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Media' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Alta' })).toBeInTheDocument();
    });

    it('tiene campo para tiempo de cocción', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Tiempo de Cocción/i);
      expect(input).toBeInTheDocument();
      expect(input).toBeRequired();
    });

    it('tiene campo para porciones', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Porciones/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('tiene campo para URL de imagen', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/URL de la Imagen/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'url');
    });

    it('tiene campo para descripción', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByLabelText(/Descripción/i);
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('tiene campo para ingredientes', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByLabelText(/Lista de Ingredientes/i);
      expect(textarea).toBeInTheDocument();
    });

    it('tiene campo para preparación', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByLabelText(/Pasos de Preparación/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Interacciones del formulario', () => {
    it('permite escribir en el campo de título', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Nombre de la Receta/i);
      fireEvent.change(input, { target: { value: 'Mi Receta Test' } });
      
      expect(input.value).toBe('Mi Receta Test');
    });

    it('permite seleccionar una categoría', () => {
      renderCreateRecipe();
      
      const select = screen.getByLabelText(/Categoría/i);
      fireEvent.change(select, { target: { value: 'Postres' } });
      
      expect(select.value).toBe('Postres');
    });

    it('permite seleccionar dificultad', () => {
      renderCreateRecipe();
      
      const select = screen.getByLabelText(/Dificultad/i);
      fireEvent.change(select, { target: { value: 'Alta' } });
      
      expect(select.value).toBe('Alta');
    });

    it('permite escribir tiempo de cocción', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Tiempo de Cocción/i);
      fireEvent.change(input, { target: { value: '45 minutos' } });
      
      expect(input.value).toBe('45 minutos');
    });

    it('permite cambiar porciones', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Porciones/i);
      fireEvent.change(input, { target: { value: '6' } });
      
      expect(input.value).toBe('6');
    });

    it('permite escribir descripción', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByLabelText(/Descripción/i);
      fireEvent.change(textarea, { target: { value: 'Una receta deliciosa' } });
      
      expect(textarea.value).toBe('Una receta deliciosa');
    });

    it('permite escribir ingredientes', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByLabelText(/Lista de Ingredientes/i);
      fireEvent.change(textarea, { target: { value: '200g harina\n100ml leche' } });
      
      expect(textarea.value).toBe('200g harina\n100ml leche');
    });

    it('permite escribir preparación', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByLabelText(/Pasos de Preparación/i);
      fireEvent.change(textarea, { target: { value: '1. Mezclar ingredientes\n2. Hornear' } });
      
      expect(textarea.value).toBe('1. Mezclar ingredientes\n2. Hornear');
    });
  });

  describe('Botones de acción', () => {
    it('tiene botón de cancelar', () => {
      renderCreateRecipe();
      
      const button = screen.getByRole('button', { name: /Cancelar/i });
      expect(button).toBeInTheDocument();
    });

    it('botón cancelar navega a recetas', () => {
      renderCreateRecipe();
      
      const button = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/recetas');
    });

    it('tiene botón de crear receta', () => {
      renderCreateRecipe();
      
      const button = screen.getByRole('button', { name: /Crear Receta/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Envío del formulario', () => {
    const fillForm = () => {
      fireEvent.change(screen.getByLabelText(/Nombre de la Receta/i), { 
        target: { value: 'Test Recipe' } 
      });
      fireEvent.change(screen.getByLabelText(/Categoría/i), { 
        target: { value: 'Postres' } 
      });
      fireEvent.change(screen.getByLabelText(/Tiempo de Cocción/i), { 
        target: { value: '30 minutos' } 
      });
      fireEvent.change(screen.getByLabelText(/Descripción/i), { 
        target: { value: 'Una descripción' } 
      });
      fireEvent.change(screen.getByLabelText(/Lista de Ingredientes/i), { 
        target: { value: 'Ingrediente 1\nIngrediente 2' } 
      });
      fireEvent.change(screen.getByLabelText(/Pasos de Preparación/i), { 
        target: { value: 'Paso 1' } 
      });
    };

    it('envía el formulario correctamente', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: true, 
        data: { id: '123' } 
      });
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(restApi.createRecipe).toHaveBeenCalled();
      });
    });

    it('navega al detalle después de crear', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: true, 
        data: { id: '123' } 
      });
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/recetas/123');
      });
    });

    it('muestra error cuando falla la creación', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: false 
      });
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error al crear la receta')).toBeInTheDocument();
      });
    });

    it('muestra error cuando hay excepción', async () => {
      restApi.createRecipe.mockRejectedValue(new Error('Network error'));
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('deshabilita el botón mientras carga', async () => {
      restApi.createRecipe.mockImplementation(() => new Promise(() => {}));
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Guardando...')).toBeInTheDocument();
      });
    });

    it('convierte ingredientes de texto a array', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: true, 
        data: { id: '123' } 
      });
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const callArgs = restApi.createRecipe.mock.calls[0][0];
        expect(Array.isArray(callArgs.ingredients)).toBe(true);
        expect(callArgs.ingredients).toContain('Ingrediente 1');
        expect(callArgs.ingredients).toContain('Ingrediente 2');
      });
    });

    it('filtra líneas vacías de ingredientes', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: true, 
        data: { id: '123' } 
      });
      
      renderCreateRecipe();
      
      fireEvent.change(screen.getByLabelText(/Nombre de la Receta/i), { 
        target: { value: 'Test' } 
      });
      fireEvent.change(screen.getByLabelText(/Categoría/i), { 
        target: { value: 'Postres' } 
      });
      fireEvent.change(screen.getByLabelText(/Tiempo de Cocción/i), { 
        target: { value: '30 min' } 
      });
      fireEvent.change(screen.getByLabelText(/Descripción/i), { 
        target: { value: 'Desc' } 
      });
      fireEvent.change(screen.getByLabelText(/Lista de Ingredientes/i), { 
        target: { value: 'Ing1\n\n  \nIng2' } 
      });
      fireEvent.change(screen.getByLabelText(/Pasos de Preparación/i), { 
        target: { value: 'Paso' } 
      });
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const callArgs = restApi.createRecipe.mock.calls[0][0];
        expect(callArgs.ingredients.length).toBe(2);
      });
    });

    it('convierte porciones a número', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: true, 
        data: { id: '123' } 
      });
      
      renderCreateRecipe();
      fillForm();
      
      fireEvent.change(screen.getByLabelText(/Porciones/i), { 
        target: { value: '8' } 
      });
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const callArgs = restApi.createRecipe.mock.calls[0][0];
        expect(callArgs.servings).toBe(8);
        expect(typeof callArgs.servings).toBe('number');
      });
    });

    it('establece rating inicial a 0', async () => {
      restApi.createRecipe.mockResolvedValue({ 
        success: true, 
        data: { id: '123' } 
      });
      
      renderCreateRecipe();
      fillForm();
      
      const submitButton = screen.getByRole('button', { name: /Crear Receta/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const callArgs = restApi.createRecipe.mock.calls[0][0];
        expect(callArgs.rating).toBe(0);
      });
    });
  });

  describe('Placeholders', () => {
    it('muestra placeholder en campo de título', () => {
      renderCreateRecipe();
      
      const input = screen.getByPlaceholderText(/Pasta Carbonara Tradicional/i);
      expect(input).toBeInTheDocument();
    });

    it('muestra placeholder en campo de tiempo', () => {
      renderCreateRecipe();
      
      const input = screen.getByPlaceholderText(/30 minutos/i);
      expect(input).toBeInTheDocument();
    });

    it('muestra placeholder en campo de descripción', () => {
      renderCreateRecipe();
      
      const textarea = screen.getByPlaceholderText(/Describe brevemente/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Valor inicial de dificultad', () => {
    it('tiene "Fácil" como valor por defecto', () => {
      renderCreateRecipe();
      
      const select = screen.getByLabelText(/Dificultad/i);
      expect(select.value).toBe('Fácil');
    });
  });

  describe('Valor inicial de porciones', () => {
    it('tiene 4 como valor por defecto', () => {
      renderCreateRecipe();
      
      const input = screen.getByLabelText(/Porciones/i);
      expect(input.value).toBe('4');
    });
  });
});
