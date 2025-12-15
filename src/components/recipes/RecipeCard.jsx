import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

const RecipeCard = ({ recipe }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isInFavorites = isFavorite(recipe.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alta':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/recetas/${recipe.id}`} className="block group">
      <div className="relative overflow-hidden h-full rounded-2xl backdrop-blur-sm bg-white/80 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-3 right-3">
            <span className={`inline-block px-3 py-1.5 backdrop-blur-md 
                         text-xs font-semibold rounded-full shadow-lg
                         border border-white/50 group-hover:scale-110 transition-transform duration-300
                         ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1.5 backdrop-blur-md bg-white/90 
                         text-xs font-semibold text-amber-900 rounded-full shadow-lg
                         border border-white/50">
              {recipe.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3 line-clamp-2 
                       group-hover:text-orange-700 transition-all duration-300">
            {recipe.title}
          </h3>

          <p className="text-sm text-amber-700 mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="space-y-2 mb-4">
            {/* Cooking Time */}
            <div className="flex items-center text-sm text-amber-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{recipe.cookingTime}</span>
            </div>

            {/* Servings */}
            <div className="flex items-center text-sm text-amber-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{recipe.servings} porciones</span>
            </div>

            {/* Rating */}
            <div className="flex items-center text-sm text-amber-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{recipe.rating} / 5</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-amber-100/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-700 group-hover:text-amber-900 
                           flex items-center transition-all duration-300 group-hover:gap-2 gap-1">
                Ver receta
                <svg className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            
            <button
              onClick={handleToggleFavorite}
              className={`w-full py-2 backdrop-blur-xl rounded-xl font-semibold text-sm
                       hover:scale-105 hover:shadow-lg transition-all duration-300
                       flex items-center justify-center gap-2
                       ${isInFavorites 
                         ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                         : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'}`}
            >
              <svg className="w-4 h-4" fill={isInFavorites ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isInFavorites ? 'En mi colección' : 'Guardar Receta'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
