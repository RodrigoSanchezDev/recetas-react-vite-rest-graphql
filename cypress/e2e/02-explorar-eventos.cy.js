/// <reference types="cypress" />

/**
 * Test E2E #2: Explorar y filtrar eventos
 * Simula a un usuario buscando y filtrando eventos
 */
describe('Explorar y Filtrar Eventos', () => {
  beforeEach(() => {
    cy.visit('/eventos')
    // Esperar a que los eventos carguen
    cy.wait(2000)
  })

  it('debe mostrar la página de eventos', () => {
    // Verificar que la página existe
    cy.url().should('include', '/eventos')
  })

  it('debe mostrar controles de filtrado', () => {
    // Verificar que hay inputs o selects para filtrar
    cy.get('input, select').should('exist')
  })

  it('debe poder usar el buscador', () => {
    // Buscar el input de búsqueda y escribir
    cy.get('input[type="text"]').first().type('evento')
    cy.wait(500)
  })

  it('debe tener opciones de ordenamiento', () => {
    // Verificar que existe un select para ordenar
    cy.get('select').should('exist')
  })
})
