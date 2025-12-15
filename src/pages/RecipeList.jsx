import { useState, useEffect } from 'react';
import { restApi } from '../services/restApi';
import RecipeCard from '../components/recipes/RecipeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, cookingTime, title

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [recipesResponse, categoriesResponse] = await Promise.all([
        restApi.getRecipes(),
        restApi.getCategories()
      ]);

      if (recipesResponse.success) {
        setRecipes(recipesResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(query)))
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'cookingTime':
          return parseInt(a.cookingTime) - parseInt(b.cookingTime);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredRecipes(filtered);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, selectedCategory, searchQuery, sortBy]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await restApi.searchRecipes(searchQuery);
      if (response.success) {
        setRecipes(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('rating');
    loadData();
  };

  if (loading && recipes.length === 0) {
    return <LoadingSpinner text="Cargando recetas..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={loadData} />;
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
            Todas las Recetas
          </h1>
          <p className="text-lg text-amber-700">
            Explora {recipes.length} recetas disponibles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar recetas por nombre, ingredientes o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-24 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-600 
                         text-white text-sm font-medium rounded-lg hover:bg-amber-700 
                         transition-colors duration-200"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="rating">Rating</option>
                <option value="cookingTime">Tiempo de cocción</option>
                <option value="title">Nombre</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-amber-300 text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Active Filters Info */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-amber-600">Filtros activos:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-900 
                               text-sm font-medium rounded-full">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 hover:text-amber-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-900 
                               text-sm font-medium rounded-full">
                    &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-amber-700"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredRecipes.length === 0 ? (
          <EmptyState
            title="No se encontraron recetas"
            description="Intenta cambiar los filtros o términos de búsqueda"
            action={resetFilters}
            actionText="Limpiar filtros"
          />
        ) : (
          <>
            <p className="text-sm text-amber-600 mb-6">
              Mostrando {filteredRecipes.length} de {recipes.length} recetas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
