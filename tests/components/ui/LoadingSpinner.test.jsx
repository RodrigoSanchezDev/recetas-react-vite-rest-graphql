import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test-utils'
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renderiza con texto por defecto', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renderiza con texto personalizado', () => {
    render(<LoadingSpinner text="Cargando recetas..." />)
    
    expect(screen.getByText('Cargando recetas...')).toBeInTheDocument()
  })

  it('no muestra texto si text es null', () => {
    render(<LoadingSpinner text={null} />)
    
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  it('renderiza tamaño pequeño', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    
    const spinner = container.querySelector('.w-8.h-8')
    expect(spinner).toBeInTheDocument()
  })

  it('renderiza tamaño mediano por defecto', () => {
    const { container } = render(<LoadingSpinner />)
    
    const spinner = container.querySelector('.w-12.h-12')
    expect(spinner).toBeInTheDocument()
  })

  it('renderiza tamaño grande', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    
    const spinner = container.querySelector('.w-16.h-16')
    expect(spinner).toBeInTheDocument()
  })

  it('tiene animación de spin', () => {
    const { container } = render(<LoadingSpinner />)
    
    const animatedElement = container.querySelector('.animate-spin')
    expect(animatedElement).toBeInTheDocument()
  })
})
