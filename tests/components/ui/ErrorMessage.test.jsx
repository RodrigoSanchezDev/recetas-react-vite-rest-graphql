import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import ErrorMessage from '../../../src/components/ui/ErrorMessage'

describe('ErrorMessage', () => {
  it('renderiza mensaje por defecto', () => {
    render(<ErrorMessage />)
    
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
    expect(screen.getByText(/No pudimos cargar la información/i)).toBeInTheDocument()
  })

  it('renderiza mensaje personalizado', () => {
    render(<ErrorMessage message="Error al cargar recetas" />)
    
    expect(screen.getByText('Error al cargar recetas')).toBeInTheDocument()
  })

  it('no muestra botón retry si no se proporciona', () => {
    render(<ErrorMessage message="Error" />)
    
    expect(screen.queryByRole('button', { name: /Reintentar/i })).not.toBeInTheDocument()
  })

  it('muestra botón retry cuando se proporciona función', () => {
    const handleRetry = vi.fn()
    render(<ErrorMessage retry={handleRetry} />)
    
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument()
  })

  it('ejecuta retry al hacer clic en el botón', () => {
    const handleRetry = vi.fn()
    render(<ErrorMessage retry={handleRetry} />)
    
    fireEvent.click(screen.getByRole('button', { name: /Reintentar/i }))
    
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renderiza el icono de error', () => {
    const { container } = render(<ErrorMessage />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('tiene estilos de error apropiados', () => {
    const { container } = render(<ErrorMessage />)
    
    const errorContainer = container.firstChild
    expect(errorContainer).toHaveClass('bg-red-50/80')
  })
})
