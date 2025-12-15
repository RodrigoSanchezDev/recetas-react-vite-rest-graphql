import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

// Mock de los componentes para aislar el test de App
vi.mock('../src/components/layout/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));

vi.mock('../src/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>
}));

vi.mock('../src/components/favorites/FloatingFavorites', () => ({
  default: () => <div data-testid="floating-favorites">FloatingFavorites</div>
}));

vi.mock('../src/pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../src/pages/RecipeList', () => ({
  default: () => <div data-testid="recipe-list-page">Recipe List</div>
}));

vi.mock('../src/pages/RecipeDetail', () => ({
  default: () => <div data-testid="recipe-detail-page">Recipe Detail</div>
}));

vi.mock('../src/pages/CreateRecipe', () => ({
  default: () => <div data-testid="create-recipe-page">Create Recipe</div>
}));

vi.mock('../src/pages/About', () => ({
  default: () => <div data-testid="about-page">About Page</div>
}));

vi.mock('../src/pages/MyCollection', () => ({
  default: () => <div data-testid="my-collection-page">My Collection</div>
}));

describe('App', () => {
  it('renderiza el componente App correctamente', () => {
    render(<App />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('floating-favorites')).toBeInTheDocument();
  });

  it('renderiza la página Home en la ruta raíz', () => {
    render(<App />);
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('tiene la estructura correcta con flex layout', () => {
    const { container } = render(<App />);
    
    const flexDiv = container.querySelector('.flex.flex-col.min-h-screen');
    expect(flexDiv).toBeInTheDocument();
  });

  it('contiene el elemento main con flex-grow', () => {
    const { container } = render(<App />);
    
    const mainElement = container.querySelector('main.flex-grow');
    expect(mainElement).toBeInTheDocument();
  });

  it('renderiza todos los componentes de layout', () => {
    render(<App />);
    
    // Navbar
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    // Footer
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // FloatingFavorites
    expect(screen.getByTestId('floating-favorites')).toBeInTheDocument();
  });

  it('usa FavoritesProvider para el contexto', () => {
    // App debe renderizar sin errores gracias al FavoritesProvider
    expect(() => render(<App />)).not.toThrow();
  });

  it('usa BrowserRouter para la navegación', () => {
    // App debe renderizar rutas sin errores
    const { container } = render(<App />);
    
    // Verificar que hay un contenedor principal
    expect(container.firstChild).toBeTruthy();
  });
});
