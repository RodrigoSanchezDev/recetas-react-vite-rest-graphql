/// <reference types="cypress" />

/**
 * Test E2E #2: Explorar y filtrar recetas
 * Simula a un usuario buscando y filtrando recetas
 */
describe('Explorar y Filtrar Recetas', () => {
  beforeEach(() => {
    cy.visit('/recetas')
    // Esperar a que las recetas carguen
    cy.wait(2000)
  })

  it('debe mostrar la página de recetas', () => {
    // Verificar que la página existe
    cy.url().should('include', '/recetas')
  })

  it('debe mostrar controles de filtrado', () => {
    // Verificar que hay inputs o selects para filtrar
    cy.get('input, select').should('exist')
  })

  it('debe poder usar el buscador', () => {
    // Buscar el input de búsqueda y escribir
    cy.get('input[type="text"]').first().type('receta')
    cy.wait(500)
  })

  it('debe tener opciones de ordenamiento', () => {
    // Verificar que existe un select para ordenar
    cy.get('select').should('exist')
  })
})
