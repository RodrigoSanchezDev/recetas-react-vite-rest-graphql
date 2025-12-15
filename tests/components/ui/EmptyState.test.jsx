import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import EmptyState from '../../../src/components/ui/EmptyState'

describe('EmptyState', () => {
  it('renderiza con valores por defecto', () => {
    render(<EmptyState />)
    
    expect(screen.getByText('No hay resultados')).toBeInTheDocument()
    expect(screen.getByText('No encontramos lo que estás buscando.')).toBeInTheDocument()
  })

  it('renderiza con título personalizado', () => {
    render(<EmptyState title="Sin recetas" />)
    
    expect(screen.getByText('Sin recetas')).toBeInTheDocument()
  })

  it('renderiza con descripción personalizada', () => {
    render(<EmptyState description="Prueba agregar una receta nueva." />)
    
    expect(screen.getByText('Prueba agregar una receta nueva.')).toBeInTheDocument()
  })

  it('no muestra botón de acción si no se proporciona', () => {
    render(<EmptyState />)
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('muestra botón de acción cuando se proporciona action y actionLabel', () => {
    const handleAction = vi.fn()
    render(<EmptyState action={handleAction} actionLabel="Crear receta" />)
    
    expect(screen.getByRole('button', { name: /Crear receta/i })).toBeInTheDocument()
  })

  it('ejecuta la acción al hacer clic en el botón', () => {
    const handleAction = vi.fn()
    render(<EmptyState action={handleAction} actionLabel="Agregar" />)
    
    fireEvent.click(screen.getByRole('button', { name: /Agregar/i }))
    
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('renderiza el icono SVG', () => {
    const { container } = render(<EmptyState />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('no muestra botón si solo se proporciona action sin actionLabel', () => {
    const handleAction = vi.fn()
    render(<EmptyState action={handleAction} />)
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
