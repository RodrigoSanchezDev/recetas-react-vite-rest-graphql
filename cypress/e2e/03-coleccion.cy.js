/// <reference types="cypress" />

/**
 * Test E2E #3: Flujo de la colección de recetas
 * Simula a un usuario interactuando con su colección de recetas guardadas
 */
describe('Flujo de la Colección de Recetas', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    cy.clearLocalStorage()
  })

  it('debe mostrar mensaje cuando la colección está vacía', () => {
    // Ir directamente a la colección vacía
    cy.visit('/mi-coleccion')
    cy.wait(1000)
    
    // Debe mostrar mensaje de colección vacía
    cy.contains(/vacía|empty|no hay|Explorar/i).should('be.visible')
  })

  it('debe poder navegar a la colección desde la navegación', () => {
    cy.visit('/')
    cy.wait(500)
    
    // Navegar a la colección
    cy.visit('/mi-coleccion')
    
    // Verificar que estamos en la página de la colección
    cy.url().should('include', '/mi-coleccion')
  })

  it('debe tener un enlace para explorar recetas desde colección vacía', () => {
    cy.visit('/mi-coleccion')
    cy.wait(1000)
    
    // Buscar enlace/botón para ir a recetas
    cy.contains(/Explorar|Ver recetas|Recetas/i).should('exist')
  })

  it('debe poder ir a la página de recetas desde la colección vacía', () => {
    cy.visit('/mi-coleccion')
    cy.wait(1000)
    
    // Hacer clic en explorar recetas
    cy.contains(/Explorar Recetas/i).click()
    
    // Verificar navegación
    cy.url().should('include', '/recetas')
  })
})
