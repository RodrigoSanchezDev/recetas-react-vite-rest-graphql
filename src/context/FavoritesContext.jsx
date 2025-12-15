import { createContext, useContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext();

// Hook personalizado para usar favoritos
// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Cargar del localStorage al iniciar
    const saved = localStorage.getItem('recetashub-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('recetashub-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (recipe) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === recipe.id);
      if (exists) return prev;
      return [...prev, recipe];
    });
    setIsDrawerOpen(true);
  };

  const removeFromFavorites = (recipeId) => {
    setFavorites(prev => prev.filter(item => item.id !== recipeId));
  };

  const isFavorite = (recipeId) => {
    return favorites.some(item => item.id === recipeId);
  };

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  const value = {
    favorites,
    favoritesCount: favorites.length,
    isDrawerOpen,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    toggleDrawer,
    setIsDrawerOpen
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
