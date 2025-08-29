// ***********************************************************
// Arquivo de suporte principal para testes E2E
// Aqui você pode importar comandos customizados, plugins, etc.
// ***********************************************************

// Importar comandos customizados
import './commands'

// Importar Page Objects
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'

// Disponibilizar Page Objects globalmente
Cypress.on('window:before:load', (win) => {
  win.LoginPage = LoginPage
  win.RegisterPage = RegisterPage
  win.HomePage = HomePage
})

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevenir que erros JS não relacionados aos testes quebrem a execução
  return false
})

// Hook global para configurações antes de cada teste
beforeEach(() => {
  // Configurações que devem ser aplicadas antes de cada teste
  cy.clearCookies()
  cy.clearLocalStorage()
})
