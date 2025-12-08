// ***********************************************
// Comandos personalizados de Cypress
// Puedes crear comandos reutilizables aquí
// ***********************************************

// Ejemplo: Comando para agregar un evento al carrito
Cypress.Commands.add('addEventToCart', (eventName) => {
  cy.contains(eventName).parents('[data-testid="event-card"]').within(() => {
    cy.get('button').contains(/agregar|añadir|add/i).click()
  })
})

// Ejemplo: Comando para navegar al carrito
Cypress.Commands.add('goToCart', () => {
  cy.get('[data-testid="cart-button"], [href*="cart"], .cart-icon').first().click()
})

// Ejemplo: Comando para limpiar el localStorage
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('cart')
  })
})
