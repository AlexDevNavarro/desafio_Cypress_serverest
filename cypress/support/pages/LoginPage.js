import { SELECTORS, URLS, TIMEOUTS } from '../constants'

class LoginPage {
  // Seletores da página de login usando constantes
  elements = {
    emailInput: () => cy.get(SELECTORS.LOGIN_EMAIL, { timeout: TIMEOUTS.MEDIUM }),
    passwordInput: () => cy.get(SELECTORS.LOGIN_PASSWORD, { timeout: TIMEOUTS.MEDIUM }),
    loginButton: () => cy.get(SELECTORS.LOGIN_BUTTON, { timeout: TIMEOUTS.MEDIUM }),
    registerLink: () => cy.get('[data-testid="cadastrar"]', { timeout: TIMEOUTS.MEDIUM }),
    errorMessage: () => cy.get(SELECTORS.ERROR_ALERT, { timeout: TIMEOUTS.MEDIUM }).filter(':visible'),
    emailError: () => cy.get('.invalid-feedback, .text-danger, .error', { timeout: TIMEOUTS.SHORT }).filter(':visible'),
    passwordError: () => cy.get('.invalid-feedback, .text-danger, .error', { timeout: TIMEOUTS.SHORT }).filter(':visible'),
    loadingIndicator: () => cy.get('.loading, .spinner', { timeout: TIMEOUTS.SHORT }),
    pageTitle: () => cy.get('h1, .page-title', { timeout: TIMEOUTS.MEDIUM })
  }

  // Ações da página
  visit() {
    cy.visit(URLS.PATHS.LOGIN)
    this.waitForPageLoad()
    return this
  }

  waitForPageLoad() {
    // Aguardar elementos principais carregarem
    this.elements.emailInput().should('be.visible')
    this.elements.passwordInput().should('be.visible')
    this.elements.loginButton().should('be.visible').and('not.be.disabled')
    return this
  }

  fillEmail(email) {
    this.elements.emailInput()
      .should('be.visible')
      .clear()
      .type(email)
      .should('have.value', email)
    return this
  }

  fillPassword(password) {
    this.elements.passwordInput()
      .should('be.visible')
      .clear()
      .type(password)
      .should('have.value', password)
    return this
  }

  clickLogin() {
    this.elements.loginButton()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
    return this
  }

  clickRegister() {
    this.elements.registerLink()
      .should('be.visible')
      .click()
    return this
  }

  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.clickLogin()
    return this
  }

  waitForRedirect() {
    // Aguardar redirecionamento após login bem-sucedido
    cy.url({ timeout: TIMEOUTS.MEDIUM }).should('not.include', '/login')
    return this
  }

  // Verificações
  shouldDisplayErrorMessage(message) {
    this.elements.errorMessage()
      .should('be.visible')
      .and('contain.text', message)
    return this
  }

  shouldDisplayEmailError() {
    this.elements.emailError().should('be.visible')
    return this
  }

  shouldDisplayPasswordError() {
    this.elements.passwordError().should('be.visible')
    return this
  }

  shouldBeOnLoginPage() {
    cy.url().should('include', '/login')
    this.elements.loginButton().should('be.visible')
    return this
  }

  shouldNotShowLoadingIndicator() {
    this.elements.loadingIndicator().should('not.exist')
    return this
  }

  shouldHaveEmptyFields() {
    this.elements.emailInput().should('have.value', '')
    this.elements.passwordInput().should('have.value', '')
    return this
  }
}

export default LoginPage
