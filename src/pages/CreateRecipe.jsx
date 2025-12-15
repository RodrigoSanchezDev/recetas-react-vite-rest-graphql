import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restApi } from '../services/restApi';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Fácil',
    cookingTime: '',
    servings: 4,
    image: '',
    ingredients: '',
    preparation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Postres',
    'Platos Principales',
    'Ensaladas',
    'Sopas',
    'Vegetariano',
    'Desayunos',
    'Bebidas',
    'Snacks'
  ];

  const difficulties = ['Fácil', 'Media', 'Alta'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir ingredientes de texto a array
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const recipeData = {
        ...formData,
        ingredients: ingredientsArray,
        servings: parseInt(formData.servings, 10),
        rating: 0,
      };

      const response = await restApi.createRecipe(recipeData);
      
      if (response.success) {
        navigate(`/recetas/${response.data.id}`);
      } else {
        setError('Error al crear la receta');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Crear Nueva Receta
          </h1>
          <p className="text-amber-700">
            Comparte tu receta favorita con la comunidad
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📝</span> Información Básica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-amber-900 mb-2">
                  Nombre de la Receta *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Pasta Carbonara Tradicional"
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-amber-900 mb-2">
                  Categoría *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-amber-900 mb-2">
                  Dificultad *
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              {/* Cooking Time */}
              <div>
                <label htmlFor="cookingTime" className="block text-sm font-medium text-amber-900 mb-2">
                  Tiempo de Cocción *
                </label>
                <input
                  type="text"
                  id="cookingTime"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 30 minutos"
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Servings */}
              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-amber-900 mb-2">
                  Porciones *
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  required
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-amber-900 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-amber-900 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe brevemente tu receta..."
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                           focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Ingredients Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🥗</span> Ingredientes
            </h2>

            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-amber-900 mb-2">
                Lista de Ingredientes * (uno por línea)
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                rows={6}
                placeholder={"200g de pasta\n100g de tocino\n2 huevos\n50g de queso parmesano\nSal y pimienta al gusto"}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                         focus:ring-amber-500 focus:border-amber-500 transition-all resize-none font-mono"
              />
              <p className="mt-2 text-sm text-amber-600">
                Escribe cada ingrediente en una línea separada
              </p>
            </div>
          </div>

          {/* Preparation Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">👨‍🍳</span> Método de Preparación
            </h2>

            <div>
              <label htmlFor="preparation" className="block text-sm font-medium text-amber-900 mb-2">
                Pasos de Preparación *
              </label>
              <textarea
                id="preparation"
                name="preparation"
                value={formData.preparation}
                onChange={handleChange}
                required
                rows={8}
                placeholder={"1. Cocina la pasta en agua con sal hasta que esté al dente.\n2. Mientras tanto, corta el tocino en cubos y fríelo hasta que esté crujiente.\n3. Bate los huevos con el queso parmesano rallado.\n4. Escurre la pasta y mézclala con el tocino.\n5. Retira del fuego y añade la mezcla de huevo, revolviendo rápidamente.\n6. Sirve inmediatamente con más queso y pimienta."}
                className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 
                         focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/recetas')}
              className="flex-1 py-4 px-6 bg-amber-100 text-amber-900 rounded-xl font-semibold
                       hover:bg-amber-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-600 to-orange-600 
                       text-white rounded-xl font-semibold hover:scale-105 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Receta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
