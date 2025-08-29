/// <reference types="cypress" />

import LoginPage from '../../support/pages/LoginPage'
import RegisterPage from '../../support/pages/RegisterPage'
import HomePage from '../../support/pages/HomePage'

describe('Autenticação e Login', () => {
  let loginPage, registerPage, homePage
  let userData

  beforeEach(() => {
    loginPage = new LoginPage()
    registerPage = new RegisterPage()
    homePage = new HomePage()
    
    // Preparar e cadastrar usuário para os testes
    cy.generateUserData().then((data) => {
      userData = data
      cy.createUserViaAPI(userData)
    })
  })

  afterEach(() => {
    // Limpar dados de teste
    if (userData) {
      cy.cleanupTestData(userData.email)
    }
  })

  it('Deve fazer login com credenciais válidas de administrador', () => {
    // Arrange
    loginPage.visit()

    // Act
    loginPage.login(userData.email, userData.password)

    // Assert
    homePage
      .shouldBeVisible()
      .shouldDisplayWelcomeMessage(userData.nome)
      .shouldDisplayAdminOptions()
    
    // Verificar URL após login
    cy.url().should('include', '/admin/home')
    
    // Verificar se botão de logout está presente
    homePage.elements.logoutButton().should('be.visible')
  })

  it('Deve fazer login e logout corretamente', () => {
    // Arrange & Act - Fazer login
    loginPage.visit()
    loginPage.login(userData.email, userData.password)
    
    // Assert - Verificar que está logado
    homePage.shouldBeVisible()
    
    // Act - Fazer logout
    homePage.logout()
    
    // Assert - Verificar que voltou para tela de login
    cy.url().should('include', '/login')
    loginPage.elements.loginButton().should('be.visible')
  })

  it('Deve exibir erro ao tentar login com credenciais inválidas', () => {
    // Arrange
    loginPage.visit()

    // Act - Tentar login com email inexistente
    loginPage.login('usuario@inexistente.com', 'senhaerrada')

    // Assert
    loginPage.shouldDisplayErrorMessage('Email e/ou senha inválidos')
    
    // Verificar que permaneceu na página de login
    cy.url().should('include', '/login')
    
    // Act - Tentar login com senha errada
    loginPage.login(userData.email, 'senhaerrada')
    
    // Assert
    loginPage.shouldDisplayErrorMessage('Email e/ou senha inválidos')
  })

  it('Deve validar campos obrigatórios no formulário de login', () => {
    // Arrange
    loginPage.visit()

    // Act - Tentar login sem preencher campos
    loginPage.clickLogin()

    // Assert - Verificar erros de validação
    loginPage.shouldDisplayEmailError()
    loginPage.shouldDisplayPasswordError()
    
    // Act - Preencher apenas email
    loginPage.fillEmail(userData.email).clickLogin()
    
    // Assert - Verificar que ainda há erro de senha
    loginPage.shouldDisplayPasswordError()
    
    // Act - Limpar email e preencher apenas senha
    loginPage.fillEmail('').fillPassword(userData.password).clickLogin()
    
    // Assert - Verificar que há erro de email
    loginPage.shouldDisplayEmailError()
  })

  it('Deve navegar para página de cadastro a partir do login', () => {
    // Arrange
    loginPage.visit()

    // Act
    loginPage.clickRegister()

    // Assert
    cy.url().should('include', '/cadastrarusuarios')
    registerPage.elements.nameInput().should('be.visible')
    registerPage.elements.registerButton().should('be.visible')
    
    // Verificar se pode voltar para login
    registerPage.clickLogin()
    cy.url().should('include', '/login')
  })
})
