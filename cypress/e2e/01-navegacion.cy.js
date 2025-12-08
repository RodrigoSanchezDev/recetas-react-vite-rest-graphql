/// <reference types="cypress" />

/**
 * Test E2E #1: Navegación por la página principal
 * Simula a un usuario navegando por el Home y explorando la página
 */
describe('Navegación en la Página Principal', () => {
  beforeEach(() => {
    cy.visit('/')
    // Esperar a que la página cargue completamente
    cy.wait(1000)
  })

  it('debe cargar la página principal correctamente', () => {
    // Verificar que el hero section se muestra
    cy.contains('Descubre experiencias que').should('be.visible')
    cy.contains('inspiran').should('be.visible')
  })

  it('debe mostrar el botón de explorar eventos', () => {
    // Verificar que hay un botón para explorar eventos
    cy.contains('Explorar Eventos').should('be.visible')
  })

  it('debe poder navegar a la lista de eventos desde el botón del hero', () => {
    // Hacer clic en el botón "Explorar Eventos"
    cy.contains('Explorar Eventos').click()
    
    // Verificar que navegó a la página de eventos
    cy.url().should('include', '/eventos')
  })

  it('debe poder navegar usando el menú de navegación', () => {
    // Navegar a Acerca de
    cy.contains('Acerca de').click()
    cy.url().should('include', '/acerca')
    cy.contains('EventHub').should('be.visible')

    // Volver al inicio
    cy.contains('Inicio').click()
    cy.url().should('not.include', '/acerca')
  })
})
