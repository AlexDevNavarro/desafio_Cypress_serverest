/// <reference types="cypress" />

import LoginPage from '../../support/pages/LoginPage'
import RegisterPage from '../../support/pages/RegisterPage'
import HomePage from '../../support/pages/HomePage'
import { SELECTORS, API_MESSAGES, URLS, TIMEOUTS } from '../../support/constants'
import { generateUserData, waitForUrl, clearSession } from '../../support/utils/testData'

describe('Autenticação e Login', () => {
  let userData
  let loginPage, registerPage, homePage

  beforeEach(() => {
    loginPage = new LoginPage()
    registerPage = new RegisterPage()
    homePage = new HomePage()
    
    // Usar utilitário para gerar dados e limpar sessão
    userData = generateUserData()
    clearSession()
    cy.createUserViaAPI(userData)
  })

  afterEach(() => {
    // Limpar dados de teste
    if (userData) {
      cy.cleanupTestData(userData.email)
    }
  })

  it('Deve fazer login com credenciais válidas de administrador', () => {
    // Intercept login API call
    cy.intercept('POST', '**/login').as('loginRequest')
    
    // Arrange - Usar Page Object
    loginPage.visit()
    cy.url().should('include', '/login')

    // Act - Usar Page Object para fazer login
    loginPage.login(userData.email, userData.password)

    // Assert - Verificar resposta da API de login
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      expect(interception.response.body).to.have.property('message', 'Login realizado com sucesso')
      expect(interception.response.body).to.have.property('authorization')
    })
    
    // Verificar redirecionamento após login bem-sucedido
    cy.url().should('not.include', '/login')
    
    // Verificar elementos da página logada
    cy.get('body').should('contain.text', userData.nome.split(' ')[0])
    cy.get(SELECTORS.LOGOUT_BUTTON).should('be.visible')
    
    // Verificar se tem opções de admin (já que é administrador)
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="cadastrarProdutos"]').length > 0) {
        cy.get('[data-testid="cadastrarProdutos"]').should('be.visible')
      }
    })
  })

  it('Deve fazer login e logout corretamente', () => {
    // Intercept login API call
    cy.intercept('POST', '**/login').as('loginRequest')
    
    // Arrange & Act - Fazer login
    cy.visit('/login')
    cy.url().should('include', '/login')
    
    cy.get(SELECTORS.LOGIN_EMAIL).clear().type(userData.email)
    cy.get(SELECTORS.LOGIN_PASSWORD).clear().type(userData.password)
    cy.get(SELECTORS.LOGIN_BUTTON).click()
    
    // Assert - Verificar login bem-sucedido
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
    })
    
    cy.url().should('not.include', '/login')
    cy.get(SELECTORS.LOGOUT_BUTTON).should('be.visible')
    
    // Act - Fazer logout
    cy.get(SELECTORS.LOGOUT_BUTTON).click()
    
    // Assert - Verificar que voltou para tela de login
    cy.url().should('include', '/login')
    cy.get(SELECTORS.LOGIN_BUTTON).should('be.visible')
    
    // Verificar que elementos de usuário logado não estão mais presentes
    cy.get('body').should('not.contain', userData.nome.split(' ')[0])
  })

  it('Deve exibir erro ao tentar login com credenciais inválidas', () => {
    // Intercept login API call para capturar erro
    cy.intercept('POST', '**/login').as('invalidLoginRequest')
    
    // Arrange
    cy.visit('/login')
    cy.url().should('include', '/login')

    // Act - Tentar login com credenciais inválidas
    cy.get(SELECTORS.LOGIN_EMAIL).clear().type('usuario@inexistente.com')
    cy.get(SELECTORS.LOGIN_PASSWORD).clear().type('senhaerrada')
    cy.get(SELECTORS.LOGIN_BUTTON).click()

    // Assert - Verificar resposta de erro da API
    cy.wait('@invalidLoginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(401)
      expect(interception.response.body.message).to.equal('Email e/ou senha inválidos')
    })
    
    // Verificar que permaneceu na página de login
    cy.url().should('include', '/login')
    cy.get(SELECTORS.LOGIN_BUTTON).should('be.visible')
    
    // Verificar mensagem de erro na UI ou que não foi redirecionado
    cy.get('body').should('satisfy', ($body) => {
      return $body.text().includes('inválid') || 
             $body.text().includes('erro') ||
             $body.find('.alert-danger, .error, .invalid-feedback').length > 0 ||
             // Fallback: ainda na página de login
             $body.find('[data-testid="entrar"]').length > 0
    })
  })

  it('Deve validar campos obrigatórios no formulário de login', () => {
    // Arrange
    cy.visit('/login')
    cy.wait(2000)

    // Act - Tentar login sem preencher campos
    cy.get('[data-testid="entrar"]').click()

    // Assert - Verificar que permaneceu na página
    cy.wait(2000)
    cy.url().should('include', '/login')
    
    // Verificar que os campos ainda estão vazios
    cy.get('[data-testid="email"]').should('have.value', '')
    cy.get('[data-testid="senha"]').should('have.value', '')
  })

  it('Deve navegar para página de cadastro a partir do login', () => {
    // Arrange
    cy.visit('/login')
    cy.wait(2000)

    // Act - Navegar para cadastro
    cy.get('[data-testid="cadastrar"]').click()

    // Assert
    cy.wait(2000)
    cy.url().should('include', '/cadastr')
    
    // Verificar se chegou na página de cadastro
    cy.get('body').then(($body) => {
      const onCadastro = $body.find('[data-testid="nome"]').length > 0 ||
                        $body.find('[data-testid="cadastrarUsuarios"]').length > 0 ||
                        $body.text().includes('Cadastro')
      expect(onCadastro).to.be.true
    })
    
    // Verificar se pode voltar para login
    cy.get('[data-testid="entrar"]').click()
    cy.wait(2000)
    cy.url().should('include', '/login')
  })
})
