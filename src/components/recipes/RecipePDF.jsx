import { useRef } from 'react';
import { 
  FiClock, 
  FiUsers, 
  FiBarChart2, 
  FiDownload, 
  FiX,
  FiFileText,
  FiStar,
  FiCheck,
  FiHeart
} from 'react-icons/fi';
import { 
  GiCookingPot, 
  GiKnifeFork,
  GiChefToque
} from 'react-icons/gi';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

// Componente para generar PDF bonito de una receta
const RecipePDF = ({ recipe, onClose }) => {
  const printRef = useRef();

  const handleDownload = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;
    
    // Crear estilos para impresión con márgenes corregidos
    const printStyles = `
      <style>
        @page { 
          size: A4; 
          margin: 15mm 20mm 15mm 20mm;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
          }
          .pdf-container {
            width: 100%;
            max-width: 100%;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
          }
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Georgia', serif;
        }
        .pdf-container {
          width: 100%;
          padding: 25px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
        }
        .pdf-header {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 18px;
          border-bottom: 3px solid #92400e;
        }
        .pdf-title {
          font-size: 28px;
          font-weight: bold;
          color: #92400e;
          margin: 0 0 8px 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .pdf-category {
          font-size: 12px;
          color: #b45309;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .pdf-meta {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .pdf-meta-item {
          text-align: center;
          padding: 12px 20px;
          background: rgba(255,255,255,0.8);
          border-radius: 12px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          min-width: 100px;
        }
        .pdf-meta-label {
          font-size: 10px;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .pdf-meta-value {
          font-size: 16px;
          font-weight: bold;
          color: #78350f;
          margin-top: 5px;
        }
        .pdf-description {
          font-size: 14px;
          line-height: 1.7;
          color: #78350f;
          text-align: center;
          font-style: italic;
          margin: 20px 0;
          padding: 15px 20px;
          background: rgba(255,255,255,0.6);
          border-radius: 12px;
        }
        .pdf-section {
          margin: 25px 0;
        }
        .pdf-section-title {
          font-size: 18px;
          font-weight: bold;
          color: #92400e;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px dashed #d97706;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pdf-ingredients-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .pdf-ingredient {
          padding: 10px 14px;
          background: rgba(255,255,255,0.85);
          border-radius: 8px;
          font-size: 13px;
          color: #78350f;
          border-left: 4px solid #f59e0b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pdf-instructions {
          counter-reset: step;
        }
        .pdf-step {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          align-items: flex-start;
        }
        .pdf-step-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .pdf-step-text {
          flex: 1;
          font-size: 13px;
          line-height: 1.6;
          color: #78350f;
          padding: 10px 12px;
          background: rgba(255,255,255,0.7);
          border-radius: 8px;
        }
        .pdf-footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid #d97706;
          text-align: center;
        }
        .pdf-rating {
          font-size: 20px;
          color: #f59e0b;
        }
        .pdf-brand {
          font-size: 11px;
          color: #92400e;
          margin-top: 10px;
          letter-spacing: 2px;
        }
        .pdf-decorative {
          font-size: 24px;
          margin: 0 8px;
          display: flex;
          justify-content: center;
          gap: 15px;
          color: #d97706;
        }
        .icon-inline {
          display: inline-flex;
          vertical-align: middle;
          margin-right: 5px;
        }
      </style>
    `;

    document.body.innerHTML = printStyles + printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Convertir la preparación en pasos individuales
  const getPreparationSteps = (preparation) => {
    if (!preparation) return [];
    // Dividir por puntos seguidos de espacio y mayúscula, o por saltos de línea
    const steps = preparation
      .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])|(?:\d+[.)]\s*)/)
      .filter(step => step && step.trim().length > 0)
      .map(step => step.trim());
    return steps;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalf = (rating % 1) >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<BsStarFill key={i} className="text-amber-400 inline" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<BsStarHalf key={i} className="text-amber-400 inline" />);
      } else {
        stars.push(<BsStar key={i} className="text-amber-300 inline" />);
      }
    }
    return stars;
  };

  const getDifficultyStars = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'fácil': return 1;
      case 'media': return 2;
      case 'alta': 
      case 'difícil': return 3;
      default: return 1;
    }
  };

  const preparationSteps = recipe.instructions || getPreparationSteps(recipe.preparation);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="pdf-modal-overlay"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <FiFileText className="w-6 h-6" />
            Vista Previa del PDF
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-5 h-5" />
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-100 transition-colors p-1"
              aria-label="Cerrar"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview del PDF */}
        <div className="overflow-auto max-h-[calc(90vh-80px)] p-4 bg-gray-100">
          <div ref={printRef} className="pdf-container bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 p-8 rounded-lg shadow-lg mx-auto" style={{maxWidth: '210mm'}}>
            
            {/* Header */}
            <div className="pdf-header text-center mb-8 pb-6 border-b-4 border-amber-700">
              <p className="pdf-category text-amber-600 text-sm uppercase tracking-widest mb-2">
                {recipe.category}
              </p>
              <h1 className="pdf-title text-4xl font-bold text-amber-800 mb-2">
                {recipe.title}
              </h1>
              <div className="pdf-rating text-2xl text-amber-500 mt-3 flex items-center justify-center gap-1">
                {renderStars(recipe.rating)} 
                <span className="text-lg text-amber-700 ml-2">({recipe.rating}/5)</span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="pdf-meta flex justify-center gap-8 my-6 flex-wrap">
              <div className="pdf-meta-item text-center p-4 bg-white/70 rounded-xl shadow">
                <div className="pdf-meta-label text-xs text-amber-600 uppercase tracking-wide flex items-center justify-center gap-1">
                  <FiClock className="w-4 h-4" /> Tiempo
                </div>
                <div className="pdf-meta-value text-lg font-bold text-amber-800">{recipe.cookingTime}</div>
              </div>
              <div className="pdf-meta-item text-center p-4 bg-white/70 rounded-xl shadow">
                <div className="pdf-meta-label text-xs text-amber-600 uppercase tracking-wide flex items-center justify-center gap-1">
                  <FiUsers className="w-4 h-4" /> Porciones
                </div>
                <div className="pdf-meta-value text-lg font-bold text-amber-800">{recipe.servings}</div>
              </div>
              <div className="pdf-meta-item text-center p-4 bg-white/70 rounded-xl shadow">
                <div className="pdf-meta-label text-xs text-amber-600 uppercase tracking-wide flex items-center justify-center gap-1">
                  <FiBarChart2 className="w-4 h-4" /> Dificultad
                </div>
                <div className="pdf-meta-value text-lg font-bold text-amber-800 flex items-center justify-center gap-1">
                  {recipe.difficulty}
                  <span className="ml-1 flex">
                    {[...Array(getDifficultyStars(recipe.difficulty))].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-amber-500 fill-amber-400" />
                    ))}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="pdf-description text-center italic text-amber-700 p-5 bg-white/50 rounded-xl my-6 text-lg leading-relaxed">
              &ldquo;{recipe.description}&rdquo;
            </div>

            {/* Ingredientes */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="pdf-section my-8">
                <h2 className="pdf-section-title text-2xl font-bold text-amber-800 mb-5 pb-3 border-b-2 border-dashed border-amber-400 flex items-center gap-2">
                  <GiKnifeFork className="w-6 h-6 text-amber-600" />
                  Ingredientes
                </h2>
                <div className="pdf-ingredients-grid grid grid-cols-2 gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div 
                      key={index}
                      className="pdf-ingredient p-3 bg-white/80 rounded-lg text-amber-800 border-l-4 border-amber-500 flex items-center gap-2"
                    >
                      <FiCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {ingredient}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparación */}
            {preparationSteps && preparationSteps.length > 0 && (
              <div className="pdf-section my-8">
                <h2 className="pdf-section-title text-2xl font-bold text-amber-800 mb-5 pb-3 border-b-2 border-dashed border-amber-400 flex items-center gap-2">
                  <GiChefToque className="w-6 h-6 text-amber-600" />
                  Método de Preparación
                </h2>
                <div className="pdf-instructions">
                  {preparationSteps.map((step, index) => (
                    <div key={index} className="pdf-step flex gap-5 mb-4 items-start">
                      <div className="pdf-step-number w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="pdf-step-text flex-1 text-amber-800 p-4 bg-white/60 rounded-lg leading-relaxed">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pdf-footer mt-10 pt-6 border-t-2 border-amber-400 text-center">
              <div className="pdf-decorative text-3xl mb-3 flex justify-center items-center gap-4 text-amber-600">
                <GiCookingPot className="w-8 h-8" />
                <FiHeart className="w-7 h-7 text-red-500 fill-red-500" />
                <GiKnifeFork className="w-8 h-8" />
              </div>
              <p className="pdf-brand text-sm text-amber-700 tracking-widest uppercase">
                Generado con RecetasHub • ¡Buen Provecho!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePDF;
