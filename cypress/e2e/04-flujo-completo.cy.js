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
    cy.contains('Descubre experiencias').should('be.visible')
  })

  it('debe navegar desde Home a Eventos', () => {
    cy.visit('/')
    cy.wait(500)
    
    // Navegar a eventos
    cy.contains('Explorar Eventos').click()
    cy.url().should('include', '/eventos')
  })

  it('debe navegar a la página Acerca de', () => {
    cy.visit('/')
    
    // Navegar a Acerca de
    cy.contains('Acerca de').click()
    
    // Verificar contenido
    cy.url().should('include', '/acerca')
    cy.contains('EventHub').should('be.visible')
  })

  it('debe mostrar la misión y visión en Acerca de', () => {
    cy.visit('/acerca')
    cy.wait(500)
    
    cy.contains('Misión').should('be.visible')
    cy.contains('Visión').should('be.visible')
  })

  it('debe poder navegar a crear evento', () => {
    cy.visit('/')
    
    // Navegar a crear evento
    cy.contains('Crear Evento').click()
    
    // Verificar navegación
    cy.url().should('include', '/crear-evento')
  })

  it('debe completar un flujo de navegación completo', () => {
    // 1. Inicio
    cy.visit('/')
    cy.contains('Descubre experiencias').should('be.visible')
    
    // 2. Ir a Acerca de
    cy.contains('Acerca de').click()
    cy.contains('EventHub').should('be.visible')
    
    // 3. Ir a Eventos
    cy.contains('Eventos').click()
    cy.url().should('include', '/eventos')
    
    // 4. Volver al inicio
    cy.contains('Inicio').click()
    cy.contains('Descubre experiencias').should('be.visible')
  })
})
