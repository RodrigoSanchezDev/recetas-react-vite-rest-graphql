import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import Footer from '../../../src/components/layout/Footer'

describe('Footer', () => {
  it('renderiza el logo de RecetasHub', () => {
    render(<Footer />)
    
    expect(screen.getByText('RecetasHub')).toBeInTheDocument()
  })

  it('muestra la descripción de la plataforma', () => {
    render(<Footer />)
    
    expect(screen.getByText(/plataforma de confianza/i)).toBeInTheDocument()
  })

  it('muestra enlaces de Recetas', () => {
    render(<Footer />)
    
    expect(screen.getByText('Explorar Recetas')).toBeInTheDocument()
    expect(screen.getByText('Crear Receta')).toBeInTheDocument()
    expect(screen.getByText('Categorías')).toBeInTheDocument()
  })

  it('muestra enlaces de Compañía', () => {
    render(<Footer />)
    
    expect(screen.getByText('Acerca de')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('muestra enlaces legales', () => {
    render(<Footer />)
    
    expect(screen.getByText('Privacidad')).toBeInTheDocument()
    expect(screen.getByText('Términos')).toBeInTheDocument()
    expect(screen.getByText('Cookies')).toBeInTheDocument()
  })

  it('el enlace Explorar Recetas navega a /recetas', () => {
    render(<Footer />)
    
    const link = screen.getByText('Explorar Recetas').closest('a')
    expect(link).toHaveAttribute('href', '/recetas')
  })

  it('el enlace Acerca de navega a /acerca', () => {
    render(<Footer />)
    
    const link = screen.getByText('Acerca de').closest('a')
    expect(link).toHaveAttribute('href', '/acerca')
  })

  it('muestra el año actual en el copyright', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  it('tiene iconos de redes sociales', () => {
    const { container } = render(<Footer />)
    
    // Debe haber al menos 3 SVGs para redes sociales
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(3)
  })

  it('los enlaces de redes sociales son accesibles', () => {
    const { container } = render(<Footer />)
    
    const socialLinks = container.querySelectorAll('a[href="#"]')
    expect(socialLinks.length).toBeGreaterThanOrEqual(3)
  })
})
