const About = () => {
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="backdrop-blur-xl bg-gradient-to-br from-amber-700 to-orange-600 
                        rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
            <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            <div className="relative text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                Acerca de <span className="text-gradient bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">RecetasHub</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Tu plataforma de confianza para descubrir y compartir las mejores recetas
              </p>
            </div>
          </div>
        </div>

        {/* Misión y Visión - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Misión */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 
                        rounded-3xl p-8 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 
                          flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Nuestra Misión</h2>
            <p className="text-lg text-amber-700 leading-relaxed">
              Democratizar el acceso a recetas de calidad y empoderar a cocineros de todos 
              los niveles para que puedan compartir sus creaciones culinarias. Creemos que cada receta, 
              simple o elaborada, merece las herramientas profesionales para ser compartida.
            </p>
          </div>

          {/* Visión */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 
                        rounded-3xl p-8 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 
                          flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Nuestra Visión</h2>
            <p className="text-lg text-amber-700 leading-relaxed">
              Ser la plataforma de recetas más confiable y utilizada en Latinoamérica, 
              conectando a millones de personas con la cocina y tradiciones culinarias 
              que fortalecen familias y comunidades.
            </p>
          </div>
        </div>

        {/* Stack Tecnológico - Bento Grid */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8 text-center">
            Stack Tecnológico
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {[
              { name: 'React 19', icon: '⚛️', color: 'from-cyan-500 to-blue-600' },
              { name: 'Vite', icon: '⚡', color: 'from-purple-500 to-pink-600' },
              { name: 'Tailwind CSS', icon: '🎨', color: 'from-sky-500 to-cyan-600' },
              { name: 'React Router', icon: '🔀', color: 'from-orange-500 to-red-600' },
              { name: 'GraphQL', icon: '📊', color: 'from-pink-500 to-rose-600' }
            ].map((tech, index) => (
              <div key={index} 
                   className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 border border-white/50 
                            shadow-lg hover:scale-110 transition-all duration-300 text-center group">
                <div className={`text-4xl mb-3 group-hover:scale-125 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <h3 className="font-bold text-amber-900 text-sm md:text-base">{tech.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Características - Bento Grid Asymmetric */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8 text-center">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Feature 1 - Grande */}
            <div className="md:col-span-2 backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 
                          rounded-3xl p-8 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 
                              flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">Búsqueda Inteligente</h3>
                  <p className="text-amber-700 leading-relaxed">
                    Encuentra exactamente lo que buscas con nuestro sistema avanzado de filtros 
                    por categoría, dificultad, ingredientes y tiempo de cocción.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 
                          rounded-3xl p-6 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 
                            flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Diseño Responsivo</h3>
              <p className="text-sm text-amber-700">
                Accede desde cualquier dispositivo con una experiencia perfecta.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 
                          rounded-3xl p-6 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 
                            flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Rendimiento</h3>
              <p className="text-sm text-amber-700">
                Carga ultrarrápida con arquitectura moderna optimizada.
              </p>
            </div>

            {/* Feature 4 - Grande */}
            <div className="md:col-span-2 backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 
                          rounded-3xl p-8 border border-white/50 shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 
                              flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">Recetas Detalladas</h3>
                  <p className="text-amber-700 leading-relaxed">
                    Cada receta incluye ingredientes detallados, método de preparación paso a paso,
                    tiempo de cocción y porciones para que nunca falle tu platillo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA de Contacto - Bento Style */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-amber-700 to-orange-600 
                      rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Tienes preguntas?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Nos encantaría escucharte. Contáctanos y te responderemos lo antes posible.
            </p>
            <a 
              href="mailto:contacto@recetashub.cl"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-900 
                       font-bold rounded-xl hover:scale-105 transition-all shadow-2xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contacto@recetashub.cl
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
