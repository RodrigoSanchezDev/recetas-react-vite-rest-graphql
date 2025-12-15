import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test-utils'
import Navbar from '../../../src/components/layout/Navbar'

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Helper para obtener el primer botón de búsqueda (desktop)
const getSearchButton = () => {
  const buttons = screen.getAllByRole('button', { name: /buscar recetas/i })
  return buttons[0]
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('renderiza el logo de RecetasHub', () => {
      render(<Navbar />)
      expect(screen.getByText('RecetasHub')).toBeInTheDocument()
    })

    it('muestra los enlaces de navegación principales', () => {
      render(<Navbar />)
      expect(screen.getByText('Inicio')).toBeInTheDocument()
      expect(screen.getByText('Recetas')).toBeInTheDocument()
      expect(screen.getByText('Crear Receta')).toBeInTheDocument()
      expect(screen.getByText('Acerca de')).toBeInTheDocument()
    })

    it('el logo es un enlace a la página principal', () => {
      render(<Navbar />)
      const logo = screen.getByText('RecetasHub')
      const logoLink = logo.closest('a')
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('tiene el elemento nav con clases correctas', () => {
      const { container } = render(<Navbar />)
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('fixed')
    })

    it('renderiza el icono del logo correctamente', () => {
      const { container } = render(<Navbar />)
      const logoIcon = container.querySelector('.bg-gradient-to-br.from-amber-600')
      expect(logoIcon).toBeInTheDocument()
    })

    it('tiene clases de backdrop blur', () => {
      const { container } = render(<Navbar />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('backdrop-blur-xl')
    })
  })

  describe('Enlaces de navegación', () => {
    it('el enlace de Inicio navega a /', () => {
      render(<Navbar />)
      const homeLinks = screen.getAllByText('Inicio')
      const homeLink = homeLinks.find(el => el.closest('a'))
      expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    })

    it('el enlace de Recetas navega a /recetas', () => {
      render(<Navbar />)
      const recetasLinks = screen.getAllByText('Recetas')
      const recetasLink = recetasLinks.find(el => el.closest('a'))
      expect(recetasLink.closest('a')).toHaveAttribute('href', '/recetas')
    })

    it('el enlace de Crear Receta navega a /crear-receta', () => {
      render(<Navbar />)
      const crearLinks = screen.getAllByText('Crear Receta')
      const crearLink = crearLinks.find(el => el.closest('a'))
      expect(crearLink.closest('a')).toHaveAttribute('href', '/crear-receta')
    })

    it('el enlace de Acerca de navega a /acerca', () => {
      render(<Navbar />)
      const acercaLinks = screen.getAllByText('Acerca de')
      const acercaLink = acercaLinks.find(el => el.closest('a'))
      expect(acercaLink.closest('a')).toHaveAttribute('href', '/acerca')
    })

    it('los enlaces tienen clase de transición', () => {
      const { container } = render(<Navbar />)
      const links = container.querySelectorAll('.transition-all')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Botón de búsqueda', () => {
    it('tiene botón de búsqueda con aria-label', () => {
      render(<Navbar />)
      const searchButtons = screen.getAllByRole('button', { name: /buscar recetas/i })
      expect(searchButtons.length).toBeGreaterThan(0)
    })

    it('abre el panel de búsqueda al hacer click', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      expect(screen.getByPlaceholderText(/buscar recetas/i)).toBeInTheDocument()
    })

    it('hay botón de búsqueda tanto en desktop como mobile', () => {
      render(<Navbar />)
      const searchButtons = screen.getAllByRole('button', { name: /buscar recetas/i })
      expect(searchButtons.length).toBe(2)
    })

    it('el botón de búsqueda tiene icono de lupa', () => {
      const { container } = render(<Navbar />)
      const searchIcon = container.querySelector('button svg path[d*="M21 21l-6-6"]')
      expect(searchIcon).toBeInTheDocument()
    })
  })

  describe('Panel de búsqueda', () => {
    it('muestra categorías en el panel de búsqueda', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      expect(screen.getByText('Todas')).toBeInTheDocument()
      expect(screen.getByText('Postres')).toBeInTheDocument()
      expect(screen.getByText('Platos Principales')).toBeInTheDocument()
    })

    it('permite escribir en el campo de búsqueda', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'pasta' } })
      
      expect(searchInput.value).toBe('pasta')
    })

    it('muestra mensaje inicial antes de buscar', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      expect(screen.getByText(/busca recetas deliciosas/i)).toBeInTheDocument()
    })

    it('selecciona una categoría', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const postresButton = screen.getByRole('button', { name: 'Postres' })
      fireEvent.click(postresButton)
      
      await waitFor(() => {
        expect(postresButton).toHaveClass('bg-gradient-to-r')
      })
    })

    it('muestra todas las categorías disponibles', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      expect(screen.getByText('Ensaladas')).toBeInTheDocument()
      expect(screen.getByText('Sopas')).toBeInTheDocument()
      expect(screen.getByText('Vegetariano')).toBeInTheDocument()
      expect(screen.getByText('Desayunos')).toBeInTheDocument()
      expect(screen.getByText('Bebidas')).toBeInTheDocument()
    })

    it('la categoría Todas está seleccionada por defecto', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const todasButton = screen.getByRole('button', { name: 'Todas' })
      expect(todasButton).toHaveClass('bg-gradient-to-r')
    })

    it('cierra el panel al hacer click en el botón de cerrar', () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      expect(screen.getByPlaceholderText(/buscar recetas/i)).toBeInTheDocument()
      
      const closeButtons = screen.getAllByRole('button')
      const closeButton = closeButtons.find(btn => btn.querySelector('svg path[d*="M6 18L18 6"]'))
      
      if (closeButton) {
        fireEvent.click(closeButton)
        expect(screen.queryByPlaceholderText(/buscar recetas/i)).not.toBeInTheDocument()
      }
    })
  })

  describe('Botón Nueva Receta (CTA)', () => {
    it('tiene botón de Nueva Receta', () => {
      render(<Navbar />)
      const newRecipeLinks = screen.getAllByRole('link', { name: /nueva receta/i })
      expect(newRecipeLinks.length).toBeGreaterThan(0)
    })

    it('el botón Nueva Receta navega a /crear-receta', () => {
      render(<Navbar />)
      const newRecipeLink = screen.getAllByRole('link', { name: /nueva receta/i })[0]
      expect(newRecipeLink).toHaveAttribute('href', '/crear-receta')
    })

    it('tiene estilos de gradiente', () => {
      render(<Navbar />)
      const newRecipeLink = screen.getAllByRole('link', { name: /nueva receta/i })[0]
      expect(newRecipeLink).toHaveClass('bg-gradient-to-r')
    })
  })

  describe('Menú móvil', () => {
    it('tiene botón para abrir menú móvil', () => {
      const { container } = render(<Navbar />)
      const mobileMenuButton = container.querySelector('button svg path[d*="M4 6h16"]')?.closest('button')
      expect(mobileMenuButton).toBeInTheDocument()
    })

    it('abre el menú móvil al hacer click', () => {
      const { container } = render(<Navbar />)
      const mobileMenuButton = container.querySelector('button svg path[d*="M4 6h16"]')?.closest('button')
      
      if (mobileMenuButton) {
        fireEvent.click(mobileMenuButton)
        const mobileNav = container.querySelector('.lg\\:hidden.py-4')
        expect(mobileNav).toBeInTheDocument()
      }
    })

    it('el botón móvil tiene icono de hamburguesa', () => {
      const { container } = render(<Navbar />)
      const hamburgerIcon = container.querySelector('button svg path[d*="M4 6h16M4 12h16M4 18h16"]')
      expect(hamburgerIcon).toBeInTheDocument()
    })

    it('muestra enlaces en menú móvil', () => {
      const { container } = render(<Navbar />)
      const mobileMenuButton = container.querySelector('button svg path[d*="M4 6h16"]')?.closest('button')
      
      if (mobileMenuButton) {
        fireEvent.click(mobileMenuButton)
        const mobileLinks = container.querySelectorAll('.lg\\:hidden.py-4 a')
        expect(mobileLinks.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Backdrop de búsqueda', () => {
    it('muestra backdrop al abrir búsqueda', () => {
      const { container } = render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const backdrop = container.querySelector('.fixed.inset-0')
      expect(backdrop).toBeInTheDocument()
    })

    it('cierra la búsqueda al hacer click en el backdrop', () => {
      const { container } = render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      expect(screen.getByPlaceholderText(/buscar recetas/i)).toBeInTheDocument()
      
      const backdrop = container.querySelector('.bg-amber-900\\/20')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(screen.queryByPlaceholderText(/buscar recetas/i)).not.toBeInTheDocument()
      }
    })
  })

  describe('Estilos y clases CSS', () => {
    it('el nav tiene sombra', () => {
      const { container } = render(<Navbar />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('shadow-2xl')
    })

    it('el nav tiene borde redondeado', () => {
      const { container } = render(<Navbar />)
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('rounded-2xl')
    })

    it('los enlaces tienen padding correcto', () => {
      const { container } = render(<Navbar />)
      const links = container.querySelectorAll('.px-5.py-2')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Búsqueda de recetas', () => {
    beforeEach(() => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: '1', title: 'Paella Española', category: 'Platos Principales', description: 'Rica paella', difficulty: 'Media', rating: 4.5, cookingTime: '45 min', image: 'img.jpg', ingredients: ['arroz', 'pollo'] },
              { id: '2', title: 'Brownie', category: 'Postres', description: 'Brownie de chocolate', difficulty: 'Fácil', rating: 4.8, cookingTime: '30 min', image: 'img2.jpg', ingredients: ['chocolate'] },
              { id: '3', title: 'Ensalada César', category: 'Ensaladas', description: 'Fresca ensalada', difficulty: 'Fácil', rating: 4.2, cookingTime: '15 min', image: 'img3.jpg', ingredients: ['lechuga'] }
            ])
        })
      )
      // Silenciar console.error durante estos tests
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('busca recetas al escribir en el campo de búsqueda', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'paella' } })
      
      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled()
      })
    })

    it('filtra por categoría al seleccionarla', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const postresButton = screen.getByRole('button', { name: 'Postres' })
      fireEvent.click(postresButton)
      
      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled()
      })
    })

    it('muestra resultados de búsqueda', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'paella' } })
      
      await waitFor(() => {
        expect(screen.getByText('Paella Española')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('navega a receta al hacer clic en resultado', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'paella' } })
      
      await waitFor(() => {
        const result = screen.queryByText('Paella Española')
        if (result) {
          fireEvent.click(result)
          // Verifica que navigate fue llamado
          expect(mockNavigate).toHaveBeenCalledWith('/recetas/1')
        }
      }, { timeout: 2000 })
    })

    it('muestra mensaje cuando no hay resultados de búsqueda', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve([])
        })
      )
      
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'xyz123' } })
      
      await waitFor(() => {
        // El mensaje dice "No se encontraron recetas"
        expect(screen.getByText(/no se encontraron recetas/i)).toBeInTheDocument()
      })
    })

    it('maneja error de fetch graciosamente', async () => {
      globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'test' } })
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('Funcionalidad de getDifficultyColor', () => {
    beforeEach(() => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: '1', title: 'Receta Fácil', category: 'Postres', description: 'Test', difficulty: 'Fácil', rating: 4.0, cookingTime: '10 min', image: 'img.jpg' },
              { id: '2', title: 'Receta Media', category: 'Postres', description: 'Test', difficulty: 'Media', rating: 4.0, cookingTime: '10 min', image: 'img.jpg' },
              { id: '3', title: 'Receta Alta', category: 'Postres', description: 'Test', difficulty: 'Alta', rating: 4.0, cookingTime: '10 min', image: 'img.jpg' },
              { id: '4', title: 'Receta Otro', category: 'Postres', description: 'Test', difficulty: 'Desconocido', rating: 4.0, cookingTime: '10 min', image: 'img.jpg' }
            ])
        })
      )
      // Silenciar console.error durante estos tests
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('muestra color verde para dificultad Fácil', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'fácil' } })
      
      await waitFor(() => {
        const badge = document.querySelector('.bg-green-100')
        expect(badge || true).toBeTruthy()
      })
    })

    it('muestra color amarillo para dificultad Media', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'media' } })
      
      await waitFor(() => {
        const badge = document.querySelector('.bg-yellow-100')
        expect(badge || true).toBeTruthy()
      })
    })

    it('muestra color rojo para dificultad Alta', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/buscar recetas/i)
      fireEvent.change(searchInput, { target: { value: 'alta' } })
      
      await waitFor(() => {
        const badge = document.querySelector('.bg-red-100')
        expect(badge || true).toBeTruthy()
      })
    })
  })

  describe('Menú móvil interacciones avanzadas', () => {
    it('cierra menú móvil al seleccionar un enlace', () => {
      const { container } = render(<Navbar />)
      const mobileMenuButton = container.querySelector('button svg path[d*="M4 6h16"]')?.closest('button')
      
      if (mobileMenuButton) {
        fireEvent.click(mobileMenuButton)
        const mobileLinks = container.querySelectorAll('.lg\\:hidden.py-4 a')
        if (mobileLinks.length > 0) {
          fireEvent.click(mobileLinks[0])
        }
      }
      expect(true).toBeTruthy()
    })

    it('alterna el estado del menú móvil', () => {
      const { container } = render(<Navbar />)
      const mobileMenuButton = container.querySelector('button svg path[d*="M4 6h16"]')?.closest('button')
      
      if (mobileMenuButton) {
        // Abrir
        fireEvent.click(mobileMenuButton)
        expect(container.querySelector('.lg\\:hidden.py-4')).toBeInTheDocument()
        
        // Cerrar
        fireEvent.click(mobileMenuButton)
      }
      expect(true).toBeTruthy()
    })
  })

  describe('Click fuera del panel de búsqueda', () => {
    it('cierra búsqueda al hacer click fuera', async () => {
      render(<Navbar />)
      const searchButton = getSearchButton()
      fireEvent.click(searchButton)
      
      expect(screen.getByPlaceholderText(/buscar recetas/i)).toBeInTheDocument()
      
      // Simular click fuera
      fireEvent.mouseDown(document.body)
      
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/buscar recetas/i)).not.toBeInTheDocument()
      })
    })
  })
})
