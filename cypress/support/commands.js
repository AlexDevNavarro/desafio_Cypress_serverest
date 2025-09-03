// Comandos customizados avançados para reutilização nos testes

import { faker } from '@faker-js/faker'
import { generateUserData } from './utils/testData'
import { API_ENDPOINTS, URLS, HTTP_STATUS, TIMEOUTS } from './constants'

// Gerar dados de usuário para testes usando utilitário
Cypress.Commands.add('generateUserData', () => {
  return generateUserData()
})

// Gerar dados de produto para testes
Cypress.Commands.add('generateProductData', () => {
  return {
    nome: faker.commerce.productName(),
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 })
  }
})

// Comando para login via API e obter token
Cypress.Commands.add('getAuthToken', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: {
      email: userData.email,
      password: userData.password
    }
  }).then((response) => {
    return response.body.authorization
  })
})

// Comando para cadastrar usuário via API usando constantes
Cypress.Commands.add('createUserViaAPI', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${URLS.BASE_API}${API_ENDPOINTS.USERS}`,
    body: userData,
    failOnStatusCode: false
  })
})

// Comando para criar produto via API
Cypress.Commands.add('createProductViaAPI', (productData, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/produtos`,
    headers: {
      'Authorization': token
    },
    body: productData,
    failOnStatusCode: false
  })
})

// Comando para fazer login no frontend
Cypress.Commands.add('loginFrontend', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(password)
  cy.get('[data-testid="entrar"]').click()
})

// Comando avançado para limpar dados de teste via API
Cypress.Commands.add('cleanupTestData', (email, token) => {
  if (!email) return
  
  // Buscar usuário por email e deletar se existir
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    timeout: TIMEOUTS.API_REQUEST,
    failOnStatusCode: false
  }).then((response) => {
    if (response.body && response.body.usuarios) {
      const user = response.body.usuarios.find(u => u.email === email)
      if (user) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/usuarios/${user._id}`,
          timeout: TIMEOUTS.API_REQUEST,
          failOnStatusCode: false
        })
      }
    }
  })
})

// Comando para aguardar elemento estar pronto para interação
Cypress.Commands.add('waitForElement', (selector, options = {}) => {
  const defaultOptions = {
    timeout: TIMEOUTS.MEDIUM,
    visible: true,
    enabled: true
  }
  const opts = { ...defaultOptions, ...options }
  
  let element = cy.get(selector, { timeout: opts.timeout })
  
  if (opts.visible) {
    element = element.should('be.visible')
  }
  
  if (opts.enabled) {
    element = element.should('not.be.disabled')
  }
  
  return element
})

// Comando para interceptar e aguardar requisições API específicas
Cypress.Commands.add('interceptAndWait', (method, url, alias, expectedStatus = [200, 201]) => {
  cy.intercept(method, url).as(alias)
  return cy.wait(`@${alias}`, { timeout: TIMEOUTS.API_REQUEST }).then((interception) => {
    const statusArray = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus]
    expect(interception.response.statusCode).to.be.oneOf(statusArray)
    return interception
  })
})

// Comando para login completo com validações
Cypress.Commands.add('performLogin', (email, password, shouldSucceed = true) => {
  cy.intercept('POST', '**/login').as('loginAttempt')
  
  cy.visit('/login')
  cy.url().should('include', '/login')
  
  cy.get('[data-testid="email"]')
    .should('be.visible')
    .clear()
    .type(email)
    .should('have.value', email)
    
  cy.get('[data-testid="senha"]')
    .should('be.visible')
    .clear()
    .type(password)
    .should('have.value', password)
    
  cy.get('[data-testid="entrar"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click()
  
  if (shouldSucceed) {
    cy.wait('@loginAttempt').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      expect(interception.response.body).to.have.property('authorization')
      return interception.response.body.authorization
    })
    cy.url().should('not.include', '/login')
  } else {
    cy.wait('@loginAttempt').then((interception) => {
      expect(interception.response.statusCode).to.equal(401)
    })
    cy.url().should('include', '/login')
  }
})

// Comando para verificar acessibilidade básica
Cypress.Commands.add('checkAccessibility', () => {
  // Verificar se elementos interativos têm labels apropriados
  cy.get('input, button, select, textarea').each(($el) => {
    const element = $el[0]
    const hasLabel = element.labels && element.labels.length > 0
    const hasAriaLabel = element.hasAttribute('aria-label')
    const hasPlaceholder = element.hasAttribute('placeholder')
    const hasTitle = element.hasAttribute('title')
    const hasDataTestId = element.hasAttribute('data-testid')
    
    expect(hasLabel || hasAriaLabel || hasPlaceholder || hasTitle || hasDataTestId).to.be.true
  })
})

// Comando para validar performance básica
Cypress.Commands.add('checkPagePerformance', () => {
  cy.window().then((win) => {
    const perfData = win.performance.timing
    const loadTime = perfData.loadEventEnd - perfData.navigationStart
    
    // Verificar se a página carregou em menos de 5 segundos
    expect(loadTime).to.be.lessThan(5000)
    
    // Verificar se não há muitos recursos lentos
    const resources = win.performance.getEntriesByType('resource')
    const slowResources = resources.filter(resource => resource.duration > 1000)
    expect(slowResources.length).to.be.lessThan(3)
  })
})
