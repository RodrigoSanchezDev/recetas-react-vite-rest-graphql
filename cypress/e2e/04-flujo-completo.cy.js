/// <reference types="cypress" />

/**
 * Test E2E #4: Flujo completo de navegación
 * Simula el proceso completo de un usuario navegando por la app
 */
describe('Flujo Completo de Navegación', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('debe cargar la página principal con el hero', () => {
    cy.visit('/')
    cy.contains('Descubre recetas que').should('be.visible')
  })

  it('debe navegar desde Home a Recetas', () => {
    cy.visit('/')
    cy.wait(500)
    
    // Navegar a recetas
    cy.contains('Explorar Recetas').click()
    cy.url().should('include', '/recetas')
  })

  it('debe navegar a la página Acerca de', () => {
    cy.visit('/')
    
    // Navegar a Acerca de
    cy.contains('Acerca de').click()
    
    // Verificar contenido
    cy.url().should('include', '/acerca')
    cy.contains('RecetasHub').should('be.visible')
  })

  it('debe mostrar la misión y visión en Acerca de', () => {
    cy.visit('/acerca')
    cy.wait(500)
    
    cy.contains('Misión').should('be.visible')
    cy.contains('Visión').should('be.visible')
  })

  it('debe poder navegar a crear receta', () => {
    cy.visit('/')
    
    // Navegar a crear receta
    cy.contains('Crear Receta').click()
    
    // Verificar navegación
    cy.url().should('include', '/crear-receta')
  })

  it('debe completar un flujo de navegación completo', () => {
    // 1. Inicio
    cy.visit('/')
    cy.contains('Descubre recetas que').should('be.visible')
    
    // 2. Ir a Acerca de
    cy.contains('a', 'Acerca de').click()
    cy.contains('RecetasHub').should('be.visible')
    
    // 3. Ir a Recetas (usando el enlace específico del navbar)
    cy.get('nav').contains('a', 'Recetas').click()
    cy.url().should('include', '/recetas')
    
    // 4. Volver al inicio
    cy.contains('a', 'Inicio').click()
    cy.contains('Descubre recetas que').should('be.visible')
  })
})
