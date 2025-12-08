// ***********************************************************
// Este archivo se ejecuta antes de cada archivo de prueba E2E
// Puedes poner configuraciones globales y comandos personalizados
// ***********************************************************

// Importar comandos personalizados
import './commands'

// Ocultar errores de fetch/XHR en la consola de Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false previene que Cypress falle el test
  return false
})
