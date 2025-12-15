import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restApi } from '../services/restApi';
import RecipeCard from '../components/recipes/RecipeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { BsStarFill } from 'react-icons/bs';

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [recipesResponse, statsResponse] = await Promise.all([
        restApi.getRecipes(),
        restApi.getStats()
      ]);

      if (recipesResponse.success) {
        setFeaturedRecipes(recipesResponse.data.slice(0, 6));
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando recetas destacadas..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={loadHomeData} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop" 
            alt="Cocina"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-orange-900/85 to-green-900/90"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Descubre recetas que <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">inspiran</span>
            </h1>
            <p className="text-xl md:text-2xl text-amber-100/90 mb-8 leading-relaxed backdrop-blur-sm">
              Explora deliciosas recetas: postres, platos principales, ensaladas y más. 
              Tu próxima creación culinaria está a un clic de distancia.
            </p>
            <div className="flex flex-row gap-3 sm:gap-4">
              <Link to="/recetas" className="group relative flex-1 sm:flex-initial px-6 sm:px-8 py-4 bg-white text-amber-900 font-semibold rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden text-center">
                <span className="relative z-10">Explorar Recetas</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/crear-receta" className="group relative flex-1 sm:flex-initial px-6 sm:px-8 py-4 backdrop-blur-sm bg-white/10 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 text-center">
                <span className="relative z-10">Crear Receta</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="relative py-20 overflow-hidden bg-gradient-to-b from-amber-50 to-white">
          <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              
              {/* Total Recetas */}
              <div className="col-span-2 row-span-2 group">
                <div className="relative h-full min-h-[280px] md:min-h-[360px] backdrop-blur-xl bg-gradient-to-br from-orange-500/90 to-amber-600/90 
                              rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  </div>
                  
                  <div className="relative h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="text-6xl md:text-7xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-500">
                        {stats.totalRecipes}<span className="text-3xl">+</span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-white/90">Recetas Disponibles</div>
                  </div>
                </div>
              </div>

              {/* Categorías */}
              <div className="col-span-1 row-span-1 group">
                <div className="relative h-full min-h-[140px] md:min-h-[170px] backdrop-blur-xl bg-gradient-to-br from-green-500/90 to-emerald-600/90 
                              rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] hover:rotate-1 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-transform duration-500">
                      {stats.categories}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-white/90">Categorías</div>
                  </div>
                </div>
              </div>

              {/* Rating Promedio */}
              <div className="col-span-1 row-span-1 group">
                <div className="relative h-full min-h-[140px] md:min-h-[170px] backdrop-blur-xl bg-gradient-to-br from-yellow-500/90 to-amber-600/90 
                              rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] hover:-rotate-1 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-500 flex items-center gap-2">
                      <BsStarFill className="w-7 h-7 text-yellow-200" /> {stats.averageRating}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-white/90">Rating Promedio</div>
                  </div>
                </div>
              </div>

              {/* Porciones Totales */}
              <div className="col-span-2 row-span-1 group">
                <div className="relative h-full min-h-[140px] md:min-h-[170px] backdrop-blur-xl bg-gradient-to-br from-red-500/90 to-rose-600/90 
                              rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-5 right-5 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"></div>
                  </div>
                  <div className="relative h-full flex items-center justify-between">
                    <div>
                      <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-500">
                        {stats.totalServings}<span className="text-2xl">+</span>
                      </div>
                      <div className="text-base md:text-lg font-semibold text-white/90">Porciones Totales</div>
                    </div>
                    <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl
                                  group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Featured Recipes Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-amber-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-amber-900 mb-3">
                Recetas Destacadas
              </h2>
              <p className="text-lg text-amber-700 font-medium">
                Las mejores recetas seleccionadas para ti
              </p>
            </div>
            <Link 
              to="/recetas" 
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-amber-900/90 
                       text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                       hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Ver todas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/recetas" className="inline-flex items-center gap-2 text-lg px-8 py-4 bg-amber-900 text-white font-semibold rounded-xl hover:bg-amber-800 transition-all">
              Ver todas las recetas
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-green-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-amber-900 mb-4">
              ¿Por qué elegir RecetasHub?
            </h2>
            <p className="text-xl text-amber-700 font-medium max-w-2xl mx-auto">
              La plataforma más completa para descubrir y compartir recetas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 
                          rounded-3xl p-8 shadow-lg border border-white/50 
                          hover:scale-[1.02] transition-all duration-500">
              <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-orange-500 to-amber-600 
                            rounded-2xl flex items-center justify-center shadow-lg mb-6
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-amber-900 mb-4">Búsqueda por Ingredientes</h3>
              <p className="text-amber-700 font-medium">
                Encuentra recetas según los ingredientes que tengas disponibles en tu cocina.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 
                          rounded-3xl p-8 shadow-lg border border-white/50 
                          hover:scale-[1.02] transition-all duration-500">
              <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-green-500 to-emerald-600 
                            rounded-2xl flex items-center justify-center shadow-lg mb-6
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-amber-900 mb-4">Tiempo de Cocción</h3>
              <p className="text-amber-700 font-medium">
                Información clara sobre el tiempo necesario para preparar cada receta.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 
                          rounded-3xl p-8 shadow-lg border border-white/50 
                          hover:scale-[1.02] transition-all duration-500">
              <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-red-500 to-rose-600 
                            rounded-2xl flex items-center justify-center shadow-lg mb-6
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-amber-900 mb-4">Nivel de Dificultad</h3>
              <p className="text-amber-700 font-medium">
                Recetas clasificadas por dificultad para todos los niveles de experiencia.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-green-900"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            ¿Tienes una receta <span className="text-yellow-400">especial</span>?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Comparte tus creaciones culinarias con nuestra comunidad. 
            Inspira a otros con tus recetas favoritas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/crear-receta" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-amber-900 
                       font-bold rounded-xl shadow-2xl hover:scale-105 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Compartir mi Receta
            </Link>
            <Link 
              to="/acerca" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-sm bg-white/10 
                       border-2 border-white/30 text-white font-bold rounded-xl 
                       hover:bg-white/20 transition-all duration-300">
              Saber más
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
