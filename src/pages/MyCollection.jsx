import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import RecipePDF from '../components/recipes/RecipePDF';
import EmptyState from '../components/ui/EmptyState';
import { FiHeart, FiClock, FiUsers, FiArrowLeft, FiTrash2, FiFileText, FiInfo } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';

const MyCollection = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showPDF, setShowPDF] = useState(false);

  const handleDownloadPDF = (recipe) => {
    setSelectedRecipe(recipe);
    setShowPDF(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
        return 'bg-green-100 text-green-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'difícil':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < fullStars 
          ? <BsStarFill key={i} className="w-4 h-4 text-amber-400" />
          : <BsStar key={i} className="w-4 h-4 text-gray-300" />
      );
    }
    return stars;
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            title="Tu colección está vacía"
            message="Aún no has guardado ninguna receta en tu colección. ¡Explora nuestras recetas y guarda tus favoritas!"
            actionText="Explorar Recetas"
            actionLink="/recetas"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-800 mb-4 flex items-center justify-center gap-3">
            <FiHeart className="w-10 h-10 text-red-500 fill-red-500" />
            Mi Colección de Recetas
          </h1>
          <p className="text-amber-600 text-lg">
            {favorites.length} {favorites.length === 1 ? 'receta guardada' : 'recetas guardadas'}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <Link
            to="/recetas"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" /> Explorar más recetas
          </Link>
          <button
            onClick={clearFavorites}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-5 h-5" /> Limpiar colección
          </button>
        </div>

        {/* Grid de recetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/40 hover:shadow-2xl transition-all duration-300"
            >
              {/* Imagen */}
              {recipe.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              )}

              {/* Contenido */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-amber-600 uppercase tracking-wide">
                    {recipe.category}
                  </span>
                  <div className="flex">{renderStars(recipe.rating)}</div>
                </div>

                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  {recipe.title}
                </h3>

                <p className="text-amber-600 text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-amber-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" /> {recipe.cookingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers className="w-4 h-4" /> {recipe.servings} porciones
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link
                    to={`/recetas/${recipe.id}`}
                    className="flex-1 text-center py-2 px-4 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium"
                  >
                    Ver Receta
                  </Link>
                  <button
                    onClick={() => handleDownloadPDF(recipe)}
                    className="py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors flex items-center justify-center"
                    title="Descargar PDF"
                  >
                    <FiFileText className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => removeFromFavorites(recipe.id)}
                    className="py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    title="Quitar de favoritos"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <FiInfo className="w-6 h-6 text-amber-500" />
            <p className="text-amber-700">
              <strong>Tip:</strong> Descarga tus recetas en PDF para tenerlas siempre a mano, ¡incluso sin internet!
            </p>
          </div>
        </div>
      </div>

      {/* Modal PDF */}
      {showPDF && selectedRecipe && (
        <RecipePDF
          recipe={selectedRecipe}
          onClose={() => {
            setShowPDF(false);
            setSelectedRecipe(null);
          }}
        />
      )}
    </div>
  );
};

export default MyCollection;
