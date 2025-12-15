import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { restApi } from '../services/restApi';
import { graphqlApi } from '../services/graphqlApi';
import { useFavorites } from '../context/FavoritesContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import RecipePDF from '../components/recipes/RecipePDF';
import { FiHeart, FiFileText, FiArrowLeft } from 'react-icons/fi';
import { BsStarFill } from 'react-icons/bs';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [recipeBasic, setRecipeBasic] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    loadRecipeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRecipeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos básicos con REST API
      const restResponse = await restApi.getRecipeById(id);
      
      if (!restResponse.success) {
        setError('Receta no encontrada');
        return;
      }

      setRecipeBasic(restResponse.data);

      // Cargar detalles extendidos con GraphQL API
      const graphqlResponse = await graphqlApi.getRecipeDetails(id);
      
      if (graphqlResponse.data?.recipe) {
        setRecipeDetails(graphqlResponse.data.recipe);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
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

  if (loading) {
    return <LoadingSpinner text="Cargando detalles de la receta..." />;
  }

  if (error || !recipeBasic) {
    return (
      <ErrorMessage 
        message={error || 'Receta no encontrada'} 
        retry={() => navigate('/recetas')} 
      />
    );
  }

  const recipe = recipeDetails || recipeBasic;

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link to="/" className="text-amber-600 hover:text-amber-900 transition-colors">
            Inicio
          </Link>
          <span className="text-amber-400">/</span>
          <Link to="/recetas" className="text-amber-600 hover:text-amber-900 transition-colors">
            Recetas
          </Link>
          <span className="text-amber-400">/</span>
          <span className="text-amber-900 font-medium">{recipe.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Title and Category */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 
                                 text-sm font-medium rounded-full">
                      {recipe.category}
                    </span>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                    {recipe.title}
                  </h1>
                  {recipe.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(recipe.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-amber-600">
                        {recipe.rating} / 5
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-amber-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-600 mb-1">Tiempo de cocción</p>
                    <p className="font-medium text-amber-900">{recipe.cookingTime}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-amber-700 flex-shrink-0 mt-1" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-600 mb-1">Porciones</p>
                    <p className="font-medium text-amber-900">{recipe.servings} personas</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-amber-200">
                <h2 className="text-xl font-semibold text-amber-900 mb-3">
                  Descripción
                </h2>
                <p className="text-amber-700 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Ingredients */}
              {recipe.ingredients && (
                <div className="pt-6 border-t border-amber-200">
                  <h2 className="text-xl font-semibold text-amber-900 mb-4">
                    🥗 Ingredientes
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-amber-700"
                      >
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preparation */}
              {recipe.preparation && (
                <div className="pt-6 border-t border-amber-200">
                  <h2 className="text-xl font-semibold text-amber-900 mb-4">
                    👨‍🍳 Método de Preparación
                  </h2>
                  <p className="text-amber-700 leading-relaxed whitespace-pre-line">
                    {recipe.preparation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Save Recipe Card */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 shadow-lg text-white sticky top-24">
              <h2 className="text-2xl font-bold mb-4">
                ¿Te gusta esta receta?
              </h2>
              <p className="text-amber-100 mb-6">
                Guárdala en tu colección para prepararla después.
              </p>
              <button
                onClick={handleToggleFavorite}
                className={`w-full py-3 rounded-xl font-bold
                         hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2
                         ${isFavorite(recipe.id) ? 'bg-red-500 text-white' : 'bg-white text-amber-900'}`}
              >
                <FiHeart className={`w-5 h-5 ${isFavorite(recipe.id) ? 'fill-current' : ''}`} />
                {isFavorite(recipe.id) ? 'En mi colección' : 'Guardar en Favoritos'}
              </button>
              <button
                onClick={() => setShowPDF(true)}
                className="w-full py-3 mt-3 bg-white/20 text-white rounded-xl font-bold
                         hover:bg-white/30 transition-all flex items-center justify-center gap-2"
              >
                <FiFileText className="w-5 h-5" />
                Descargar PDF
              </button>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Información Rápida</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-600">Dificultad</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-600">Tiempo</span>
                  <span className="font-medium text-amber-900">{recipe.cookingTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-600">Porciones</span>
                  <span className="font-medium text-amber-900">{recipe.servings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-600">Rating</span>
                  <span className="font-medium text-amber-900 flex items-center gap-1">
                    <BsStarFill className="w-4 h-4 text-amber-400" /> {recipe.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <Link
              to="/recetas"
              className="flex items-center justify-center gap-2 w-full py-3 bg-amber-100 text-amber-900 rounded-xl font-semibold text-center
                       hover:bg-amber-200 transition-all"
            >
              <FiArrowLeft className="w-5 h-5" /> Volver a Recetas
            </Link>
          </div>
        </div>
      </div>

      {/* Modal PDF */}
      {showPDF && recipe && (
        <RecipePDF
          recipe={recipe}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
};

export default RecipeDetail;
