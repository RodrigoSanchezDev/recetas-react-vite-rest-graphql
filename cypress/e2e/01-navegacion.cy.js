/// <reference types="cypress" />

/**
 * Test E2E #1: Navegación por la página principal
 * Simula a un usuario navegando por el Home y explorando la página
 */
describe('Navegación en la Página Principal', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1500)
  })

  it('debe cargar la página principal correctamente', () => {
    // Verificar que la URL es correcta
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('debe mostrar el navbar', () => {
    // Verificar que existe el nav
    cy.get('nav').should('exist')
  })

  it('debe poder navegar a la lista de recetas', () => {
    // Navegar directamente
    cy.visit('/recetas')
    cy.url().should('include', '/recetas')
  })

  it('debe poder navegar a Acerca de', () => {
    // Navegar a Acerca de
    cy.visit('/acerca')
    cy.url().should('include', '/acerca')
  })
})
