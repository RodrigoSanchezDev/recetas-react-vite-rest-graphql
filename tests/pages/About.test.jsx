import { describe, it, expect } from 'vitest'
import { render, screen } from '../test-utils'
import About from '../../src/pages/About'

describe('About', () => {
  it('renderiza el título principal con RecetasHub', () => {
    render(<About />)
    
    const elements = screen.getAllByText(/RecetasHub/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('muestra la sección Acerca de', () => {
    render(<About />)
    
    expect(screen.getByText(/Acerca de/i)).toBeInTheDocument()
  })

  it('muestra la descripción de la plataforma', () => {
    render(<About />)
    
    expect(screen.getByText(/plataforma de confianza/i)).toBeInTheDocument()
  })

  it('muestra la sección de Misión', () => {
    render(<About />)
    
    expect(screen.getByText(/Nuestra Misión/i)).toBeInTheDocument()
  })

  it('muestra el contenido de la misión', () => {
    render(<About />)
    
    expect(screen.getByText(/Democratizar el acceso a recetas/i)).toBeInTheDocument()
  })

  it('muestra la sección de Visión', () => {
    render(<About />)
    
    expect(screen.getByText(/Nuestra Visión/i)).toBeInTheDocument()
  })

  it('contiene iconos SVG', () => {
    const { container } = render(<About />)
    
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('tiene estructura de grid para misión y visión', () => {
    const { container } = render(<About />)
    
    const gridElement = container.querySelector('.grid')
    expect(gridElement).toBeInTheDocument()
  })
})
