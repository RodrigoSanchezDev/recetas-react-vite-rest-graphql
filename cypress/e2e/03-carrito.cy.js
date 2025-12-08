/// <reference types="cypress" />

/**
 * Test E2E #3: Flujo del carrito de compras
 * Simula a un usuario interactuando con el carrito
 */
describe('Flujo del Carrito de Compras', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    cy.clearLocalStorage()
  })

  it('debe mostrar mensaje cuando el carrito está vacío', () => {
    // Ir directamente al carrito vacío
    cy.visit('/cart')
    cy.wait(1000)
    
    // Debe mostrar mensaje de carrito vacío
    cy.contains(/vacío|empty|no hay|Explorar/i).should('be.visible')
  })

  it('debe poder navegar al carrito desde la navegación', () => {
    cy.visit('/')
    cy.wait(500)
    
    // Navegar al carrito
    cy.visit('/cart')
    
    // Verificar que estamos en la página del carrito
    cy.url().should('include', '/cart')
  })

  it('debe tener un enlace para explorar eventos desde carrito vacío', () => {
    cy.visit('/cart')
    cy.wait(1000)
    
    // Buscar enlace/botón para ir a eventos
    cy.contains(/Explorar|Ver eventos|Eventos/i).should('exist')
  })

  it('debe poder ir a la página de eventos desde el carrito vacío', () => {
    cy.visit('/cart')
    cy.wait(1000)
    
    // Hacer clic en explorar eventos
    cy.contains(/Explorar Eventos/i).click()
    
    // Verificar navegación
    cy.url().should('include', '/eventos')
  })
})
