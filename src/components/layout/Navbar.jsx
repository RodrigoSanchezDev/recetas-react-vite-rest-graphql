import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BsStarFill } from 'react-icons/bs';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Inicio', path: '/' },
    { name: 'Recetas', path: '/recetas' },
    { name: 'Crear Receta', path: '/crear-receta' },
    { name: 'Acerca de', path: '/acerca' },
  ];

  const categories = [
    'Todas',
    'Postres',
    'Platos Principales',
    'Ensaladas',
    'Sopas',
    'Vegetariano',
    'Desayunos',
    'Bebidas'
  ];

  // Fetch recipes from API
  const fetchRecipes = async () => {
    try {
      const response = await fetch('/src/data/recipes.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  };

  // Search and filter recipes
  const handleSearch = async (query, category) => {
    const recipes = await fetchRecipes();
    
    let filtered = recipes;

    // Filter by category
    if (category && category !== 'Todas') {
      filtered = filtered.filter(recipe => recipe.category === category);
    }

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients?.some(ing => ing.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setSearchResults(filtered);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleSearch(searchQuery, category);
  };

  // Handle search input change
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query, selectedCategory);
  };

  // Handle recipe click
  const handleRecipeClick = (recipeId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCategory('');
    setIsMobileMenuOpen(false);
    navigate(`/recetas/${recipeId}`);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Difficulty color helper
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
    <nav className="fixed top-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:w-auto z-50 backdrop-blur-xl bg-white border border-white/40 rounded-2xl shadow-2xl shadow-amber-900/10">
      <div className="px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-amber-900">RecetasHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-5 py-2 text-sm font-medium text-amber-700 hover:text-amber-900 
                         hover:bg-amber-50 backdrop-blur-sm rounded-lg transition-all duration-300
                         hover:shadow-md relative group whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 
                       rounded-lg transition-all duration-300 hover:scale-110"
              aria-label="Buscar recetas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block">
            <Link to="/crear-receta" className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
              Nueva Receta
            </Link>
          </div>

          {/* Mobile Search & Menu buttons */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Search Button Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 
                       rounded-lg transition-all duration-300"
              aria-label="Buscar recetas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-amber-700 hover:bg-amber-50"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-amber-200 backdrop-blur-xl bg-white/50">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-amber-700 hover:text-amber-900 
                           hover:bg-amber-50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/crear-receta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mx-4 mt-2 py-3 px-6 text-center text-white bg-gradient-to-r from-amber-600 to-orange-500 rounded-lg font-medium"
              >
                Nueva Receta
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Smart Search Panel */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-amber-900/20 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          
          {/* Search Panel */}
          <div 
            ref={searchRef}
            className="relative w-full max-w-3xl backdrop-blur-xl bg-white/95 rounded-2xl 
                     shadow-2xl border border-amber-200 animate-fade-in"
          >
            {/* Search Header */}
            <div className="p-4 md:p-6 border-b border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Buscar recetas por nombre, ingrediente o descripción..."
                  className="flex-1 text-lg font-medium text-amber-900 placeholder-amber-400 
                           bg-transparent border-none outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                              ${selectedCategory === category || (category === 'Todas' && !selectedCategory)
                                ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg scale-105'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6">
              {searchQuery || selectedCategory ? (
                searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleRecipeClick(recipe.id)}
                        className="w-full flex items-start gap-4 p-4 rounded-xl 
                                 bg-gradient-to-br from-amber-50/50 to-white
                                 hover:from-amber-50 hover:to-amber-50/50
                                 border border-amber-100 hover:border-amber-300
                                 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                 text-left group"
                      >
                        {/* Recipe Image */}
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0 
                                   shadow-md group-hover:shadow-xl transition-shadow"
                        />
                        
                        {/* Recipe Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-amber-900 mb-1 
                                       group-hover:text-orange-600 transition-colors truncate">
                            {recipe.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium bg-amber-100 
                                         text-amber-900 rounded-full">
                              {recipe.category}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                              {recipe.difficulty}
                            </span>
                          </div>
                          
                          <p className="text-sm text-amber-700 line-clamp-2 mb-2">
                            {recipe.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-amber-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {recipe.cookingTime}
                            </span>
                            <span className="text-base md:text-lg font-bold text-orange-600 flex items-center gap-1">
                              <BsStarFill className="w-4 h-4 text-amber-400" /> {recipe.rating}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-amber-300 mb-4" fill="none" 
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-amber-600 mb-2">
                      No se encontraron recetas
                    </p>
                    <p className="text-sm text-amber-500">
                      Intenta con otros términos de búsqueda o categorías
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-amber-400 mb-4" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-amber-700 mb-2">
                    Busca recetas deliciosas
                  </p>
                  <p className="text-sm text-amber-500">
                    Escribe algo o selecciona una categoría para comenzar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
