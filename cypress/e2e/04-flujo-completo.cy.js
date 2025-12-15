/// <reference types="cypress" />

/**
 * Test E2E #4: Flujo completo de navegación
 * Simula el proceso completo de un usuario navegando por la app
 */
describe('Flujo Completo de Navegación', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('debe cargar la página principal', () => {
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('debe navegar a Recetas', () => {
    cy.visit('/recetas')
    cy.url().should('include', '/recetas')
  })

  it('debe navegar a la página Acerca de', () => {
    cy.visit('/acerca')
    cy.url().should('include', '/acerca')
  })

  it('debe mostrar contenido en Acerca de', () => {
    cy.visit('/acerca')
    cy.wait(500)
    cy.get('body').should('contain.text', 'Misión')
  })

  it('debe poder navegar a crear receta', () => {
    cy.visit('/crear-receta')
    cy.url().should('include', '/crear-receta')
  })

  it('debe completar un flujo de navegación completo', () => {
    // 1. Inicio
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // 2. Ir a Acerca de
    cy.visit('/acerca')
    cy.url().should('include', '/acerca')
    
    // 3. Ir a Recetas
    cy.visit('/recetas')
    cy.url().should('include', '/recetas')
    
    // 4. Ir a Crear Receta
    cy.visit('/crear-receta')
    cy.url().should('include', '/crear-receta')
    
    // 5. Volver al inicio
    cy.visit('/')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
