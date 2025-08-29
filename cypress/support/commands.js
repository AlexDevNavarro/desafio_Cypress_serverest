// Comandos customizados para reutilização nos testes

import { faker } from '@faker-js/faker'

// Gerar dados de usuário para testes
Cypress.Commands.add('generateUserData', () => {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: 'teste123',
    administrador: 'true'
  }
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

// Comando para cadastrar usuário via API
Cypress.Commands.add('createUserViaAPI', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
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

// Comando para limpar dados de teste via API
Cypress.Commands.add('cleanupTestData', (email, token) => {
  // Buscar usuário por email e deletar se existir
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    failOnStatusCode: false
  }).then((response) => {
    if (response.body.usuarios) {
      const user = response.body.usuarios.find(u => u.email === email)
      if (user) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiUrl')}/usuarios/${user._id}`,
          failOnStatusCode: false
        })
      }
    }
  })
})
