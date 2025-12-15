import { Link } from 'react-router-dom';

const EmptyState = ({ 
  title = 'No hay resultados', 
  description,
  message, // alias para description
  action,
  actionLabel,
  actionText, // alias para actionLabel
  actionLink, // para enlaces en lugar de botones
  icon // emoji o componente de icono
}) => {
  // Usar aliases si están definidos
  const displayDescription = description || message || 'No encontramos lo que estás buscando.';
  const displayActionLabel = actionLabel || actionText;

  return (
    <div className="max-w-md mx-auto my-12 p-8 text-center">
      {/* Icon with glassmorphic background */}
      <div className="relative inline-flex items-center justify-center mb-8">
        {/* Gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 
                      opacity-10 blur-3xl w-32 h-32 -translate-x-6 -translate-y-6"></div>
        
        {/* Glassmorphic container */}
        <div className="relative backdrop-blur-sm bg-white/60 border border-white/50 
                      rounded-3xl p-6 shadow-xl">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 
                        rounded-2xl flex items-center justify-center">
            {icon ? (
              <span className="text-4xl">{icon}</span>
            ) : (
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-amber-900 to-orange-700 
                   bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-amber-600 font-medium mb-8 leading-relaxed">
        {displayDescription}
      </p>
      
      {/* Render como Link si hay actionLink, sino como button */}
      {actionLink && displayActionLabel && (
        <Link 
          to={actionLink}
          className="px-6 py-3 backdrop-blur-md bg-amber-600/90 hover:bg-amber-700 
                   text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                   transition-all duration-300 hover:scale-105 active:scale-95
                   border border-amber-500/50 inline-flex items-center gap-2 group">
          {displayActionLabel}
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      )}
      
      {action && displayActionLabel && !actionLink && (
        <button 
          onClick={action} 
          className="px-6 py-3 backdrop-blur-md bg-amber-600/90 hover:bg-amber-700 
                   text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                   transition-all duration-300 hover:scale-105 active:scale-95
                   border border-amber-500/50 inline-flex items-center gap-2 group">
          {displayActionLabel}
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
