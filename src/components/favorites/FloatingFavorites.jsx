import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { FiHeart, FiX, FiClock, FiTrash2, FiBook } from 'react-icons/fi';
import { BsStarFill } from 'react-icons/bs';

const FloatingFavorites = () => {
  const { favorites, favoritesCount, isDrawerOpen, toggleDrawer, removeFromFavorites, setIsDrawerOpen } = useFavorites();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleDrawer}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 
                   text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 
                   transition-all duration-300 flex items-center justify-center group"
        aria-label="Ver mi colección"
      >
        <FiHeart className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
        {favoritesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
                         w-6 h-6 rounded-full flex items-center justify-center font-bold
                         animate-pulse">
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 
                      transform transition-transform duration-300 ease-out
                      ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiHeart className="w-8 h-8 fill-white" />
              <div>
                <h2 className="text-xl font-bold">Mi Colección</h2>
                <p className="text-amber-100 text-sm">
                  {favoritesCount} {favoritesCount === 1 ? 'receta guardada' : 'recetas guardadas'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Cerrar"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <FiBook className="w-16 h-16 mx-auto text-amber-300 mb-4" />
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Tu colección está vacía
              </h3>
              <p className="text-amber-600 mb-6">
                ¡Explora recetas y guarda tus favoritas!
              </p>
              <Link
                to="/recetas"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg 
                         hover:bg-amber-600 transition-colors font-medium"
              >
                Explorar Recetas
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/recetas/${recipe.id}`}
                      onClick={() => setIsDrawerOpen(false)}
                      className="font-medium text-amber-900 hover:text-amber-700 block truncate"
                    >
                      {recipe.title}
                    </Link>
                    <p className="text-sm text-amber-600 truncate">{recipe.category}</p>
                    <div className="flex items-center gap-2 text-xs text-amber-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" /> {recipe.cookingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BsStarFill className="w-3 h-3 text-amber-400" /> {recipe.rating}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(recipe.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Quitar de favoritos"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-amber-100">
            <Link
              to="/mi-coleccion"
              onClick={() => setIsDrawerOpen(false)}
              className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 
                       text-white text-center rounded-xl font-bold hover:from-amber-600 
                       hover:to-orange-600 transition-all shadow-lg"
            >
              Ver toda mi colección
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingFavorites;
