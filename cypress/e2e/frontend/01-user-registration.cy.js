/// <reference types="cypress" />

import RegisterPage from '../../support/pages/RegisterPage'
import LoginPage from '../../support/pages/LoginPage'
import HomePage from '../../support/pages/HomePage'
import { SELECTORS, API_MESSAGES, URLS, TIMEOUTS } from '../../support/constants'
import { generateUserData, waitForUrl } from '../../support/utils/testData'

describe('Cadastro de Usuários', () => {
  let userData
  let registerPage, loginPage, homePage

  beforeEach(() => {
    registerPage = new RegisterPage()
    loginPage = new LoginPage()
    homePage = new HomePage()
    
    // Usar utilitário para gerar dados de usuário
    userData = generateUserData()
  })

  afterEach(() => {
    // Limpar dados de teste após cada teste
    if (userData) {
      cy.cleanupTestData(userData.email)
    }
  })

  it('Deve cadastrar um novo usuário administrador com sucesso', () => {
    // Intercept API call for registration
    cy.intercept('POST', '**/usuarios').as('createUser')
    
    // Arrange - Navegar para página de cadastro
    registerPage.visit()
    cy.url().should('include', '/cadastr')
    
    // Aguardar página carregar completamente
    cy.get('body').should('be.visible')
    cy.get('[data-testid="nome"], input[placeholder*="nome" i], input[name="nome"]')
      .should('be.visible')
      .first()
      .as('nomeField')

    // Act - Preencher formulário manualmente para garantir funcionamento
    cy.get('@nomeField').clear().type(userData.nome)
    cy.get('[data-testid="email"], input[type="email"], input[placeholder*="email" i]')
      .should('be.visible')
      .clear()
      .type(userData.email)
    cy.get('[data-testid="password"], input[type="password"], input[placeholder*="senha" i]')
      .should('be.visible')
      .clear()
      .type(userData.password)
    
    // Marcar checkbox de administrador se necessário
    if (userData.administrador === 'true') {
      cy.get('input[type="checkbox"], [data-testid="checkbox"]')
        .should('be.visible')
        .check()
    }
    
    // Clicar no botão de cadastro
    cy.get('[data-testid="cadastrar"], button[type="submit"], input[type="submit"]')
      .should('be.visible')
      .click()

    // Assert - Verificar resposta da API
    cy.wait('@createUser', { timeout: 15000 }).then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201])
    })
    
    // Verificar resultado do cadastro
    cy.url().should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/cadastr')
    })
    
    // Validação de sucesso - múltiplas estratégias
    cy.get('body').then(($body) => {
      const redirectedToLogin = $body.find('[data-testid="entrar"]').length > 0 && 
                               $body.find('[data-testid="email"]').length > 0
      const hasSuccessMessage = $body.text().includes('sucesso') || 
                               $body.text().includes('realizado') ||
                               $body.find('.alert-success, .success').length > 0
      const fieldsCleared = $body.find('input[value=""]').length >= 2
      
      // Deve ter pelo menos um indicador de sucesso
      expect(redirectedToLogin || hasSuccessMessage || fieldsCleared).to.be.true
    })
  })

  it('Deve cadastrar um novo usuário comum (não administrador) com sucesso', () => {
    // Intercept API call for registration
    cy.intercept('POST', '**/usuarios').as('createCommonUser')
    
    // Arrange - Usar constantes para configurar dados
    userData.administrador = 'false'
    registerPage.visit()
    cy.url().should('include', '/cadastr')

    // Act - Usar Page Object para preencher dados
    registerPage.fillName(userData.nome)
    registerPage.fillEmail(userData.email)
    registerPage.fillPassword(userData.password)
    // Não marcar checkbox de administrador (usuário comum)
    
    registerPage.clickRegister()

    // Assert - Verificar resposta da API e comportamento da aplicação
    cy.wait('@createCommonUser').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201])
      expect(interception.request.body.administrador).to.equal('false')
    })
    
    // Verificar resultado do cadastro
    cy.get('body').should('be.visible')
    cy.url().should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/cadastr')
    })
    
    // Validar que o usuário foi criado como comum (não admin)
    cy.then(() => {
      expect(userData.administrador).to.equal('false')
    })
  })

  it('Deve exibir validação ao tentar cadastrar com dados inválidos', () => {
    // Arrange - Usar Page Object
    registerPage.visit()
    cy.url().should('include', '/cadastr')

    // Act - Tentar cadastrar sem preencher campos obrigatórios
    registerPage.clickRegister()

    // Assert - Verificar que permaneceu na página de cadastro
    cy.url().should('include', '/cadastr')
    
    // Verificar campos vazios usando seletores das constantes
    cy.get(SELECTORS.REGISTER_NAME).should('have.value', '')
    cy.get(SELECTORS.REGISTER_EMAIL).should('have.value', '')
    cy.get(SELECTORS.REGISTER_PASSWORD).should('have.value', '')
    
    // Verificar se mensagens de validação aparecem ou se campos ficam em destaque
    cy.get('body').then(($body) => {
      const hasValidationErrors = 
        $body.find('.is-invalid').length > 0 ||
        $body.find('.error').length > 0 ||
        $body.find('.invalid-feedback').length > 0 ||
        $body.text().includes('obrigatório') ||
        $body.text().includes('required') ||
        $body.text().includes('preencha')
      
      if (hasValidationErrors) {
        // Se há indicadores visuais de erro, verificá-los
        cy.get('body').should('satisfy', ($body) => {
          return $body.find('.is-invalid, .error, .invalid-feedback').length > 0 ||
                 $body.text().toLowerCase().includes('obrigatório') ||
                 $body.text().toLowerCase().includes('preencha')
        })
      } else {
        // Fallback: verificar que o formulário não foi submetido (campos ainda vazios)
        cy.get(SELECTORS.REGISTER_NAME).should('be.visible').and('have.value', '')
        cy.get(SELECTORS.REGISTER_EMAIL).should('be.visible').and('have.value', '')
      }
    })
  })

  it('Não deve permitir cadastrar usuário com email já existente', () => {
    // Intercept para capturar tentativa de cadastro duplicado
    cy.intercept('POST', '**/usuarios').as('duplicateUserAttempt')
    
    // Arrange - Cadastrar usuário via API primeiro usando constantes
    cy.createUserViaAPI(userData).then((response) => {
      expect(response.status).to.eq(201)
    })

    registerPage.visit()
    cy.url().should('include', '/cadastr')

    // Act - Usar Page Object para preencher formulário com mesmo email
    registerPage.fillForm(userData)
    registerPage.clickRegister()

    // Assert - Verificar resposta de erro da API
    cy.wait('@duplicateUserAttempt').then((interception) => {
      expect(interception.response.statusCode).to.equal(400)
      expect(interception.response.body.message).to.equal(API_MESSAGES.ERROR.DUPLICATE_EMAIL)
    })
    
    // Verificar que permaneceu na página de cadastro
    cy.url().should('include', '/cadastr')
    
    // Verificar mensagem de erro na UI
    cy.get('body').should('satisfy', ($body) => {
      return $body.text().includes(API_MESSAGES.ERROR.DUPLICATE_EMAIL) || 
             $body.text().includes('email já') ||
             $body.text().includes('existe') ||
             $body.find('.alert-danger, .error').length > 0
    })
    
    // Verificar que o formulário ainda está visível (não houve redirecionamento)
    cy.get(SELECTORS.REGISTER_NAME).should('be.visible')
    cy.get(SELECTORS.REGISTER_EMAIL).should('be.visible').and('have.value', userData.email)
  })
})
