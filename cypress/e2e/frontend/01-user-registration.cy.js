/// <reference types="cypress" />

import RegisterPage from '../../support/pages/RegisterPage'
import LoginPage from '../../support/pages/LoginPage'
import HomePage from '../../support/pages/HomePage'

describe('Cadastro de Usuários', () => {
  let registerPage, loginPage, homePage
  let userData

  beforeEach(() => {
    registerPage = new RegisterPage()
    loginPage = new LoginPage()
    homePage = new HomePage()
    
    // Preparar dados de usuário únicos para cada teste
    cy.generateUserData().then((data) => {
      userData = data
    })
  })

  afterEach(() => {
    // Limpar dados de teste após cada teste
    if (userData) {
      cy.cleanupTestData(userData.email)
    }
  })

  it('Deve cadastrar um novo usuário administrador com sucesso', () => {
    // Arrange
    registerPage.visit()

    // Act
    registerPage
      .fillForm(userData)
      .clickRegister()

    // Assert
    registerPage.shouldDisplaySuccessMessage()
    
    // Verificar se foi redirecionado para login
    cy.url().should('include', '/login')
    
    // Verificar se consegue fazer login com os dados cadastrados
    loginPage.login(userData.email, userData.password)
    
    // Verificar se logou e tem privilégios de admin
    homePage
      .shouldBeVisible()
      .shouldDisplayWelcomeMessage(userData.nome)
      .shouldDisplayAdminOptions()
  })

  it('Deve cadastrar um novo usuário comum (não administrador) com sucesso', () => {
    // Arrange
    userData.administrador = 'false'
    registerPage.visit()

    // Act
    registerPage
      .fillName(userData.nome)
      .fillEmail(userData.email)
      .fillPassword(userData.password)
      // Não marcar checkbox de administrador
      .clickRegister()

    // Assert
    registerPage.shouldDisplaySuccessMessage()
    
    // Verificar login e permissões
    cy.url().should('include', '/login')
    loginPage.login(userData.email, userData.password)
    
    homePage
      .shouldBeVisible()
      .shouldDisplayWelcomeMessage(userData.nome)
      .shouldNotDisplayAdminOptions()
  })

  it('Deve exibir erros de validação ao tentar cadastrar com dados inválidos', () => {
    // Arrange
    registerPage.visit()

    // Act - Tentar cadastrar sem preencher nenhum campo
    registerPage.clickRegister()

    // Assert - Verificar erros de validação
    registerPage.shouldDisplayValidationErrors()
    
    // Act - Tentar cadastrar com email inválido
    registerPage
      .fillName(userData.nome)
      .fillEmail('email-invalido')
      .fillPassword('123') // senha muito curta
      .clickRegister()

    // Assert - Verificar que permaneceu na página de cadastro
    cy.url().should('include', '/cadastrarusuarios')
  })

  it('Não deve permitir cadastrar usuário com email já existente', () => {
    // Arrange - Cadastrar usuário via API primeiro
    cy.createUserViaAPI(userData).then((response) => {
      expect(response.status).to.eq(201)
    })

    registerPage.visit()

    // Act - Tentar cadastrar com mesmo email
    registerPage
      .fillForm(userData)
      .clickRegister()

    // Assert - Verificar mensagem de erro
    registerPage.shouldDisplayErrorMessage('Este email já está sendo usado')
  })
})
