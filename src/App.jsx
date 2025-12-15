import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingFavorites from './components/favorites/FloatingFavorites';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import About from './pages/About';
import MyCollection from './pages/MyCollection';

function App() {
  const basename = import.meta.env.PROD ? '/recetas-react-vite-rest-graphql' : '/';
  
  return (
    <Router basename={basename}>
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recetas" element={<RecipeList />} />
              <Route path="/recetas/:id" element={<RecipeDetail />} />
              <Route path="/crear-receta" element={<CreateRecipe />} />
              <Route path="/acerca" element={<About />} />
              <Route path="/mi-coleccion" element={<MyCollection />} />
            </Routes>
          </main>
          <Footer />
          <FloatingFavorites />
        </div>
      </FavoritesProvider>
    </Router>
  );
}

export default App;
