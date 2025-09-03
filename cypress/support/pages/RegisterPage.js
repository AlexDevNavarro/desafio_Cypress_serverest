import { SELECTORS, URLS } from '../constants'

class RegisterPage {
  // Seletores da página de cadastro usando constantes
  elements = {
    nameInput: () => cy.get(SELECTORS.REGISTER_NAME, { timeout: 15000 }),
    emailInput: () => cy.get(SELECTORS.REGISTER_EMAIL),
    passwordInput: () => cy.get(SELECTORS.REGISTER_PASSWORD),
    adminCheckbox: () => cy.get(SELECTORS.REGISTER_ADMIN),
    registerButton: () => cy.get(SELECTORS.REGISTER_BUTTON),
    loginLink: () => cy.get(SELECTORS.LOGIN_BUTTON),
    successMessage: () => cy.get(SELECTORS.SUCCESS_ALERT).filter(':visible'),
    errorMessage: () => cy.get(SELECTORS.ERROR_ALERT).filter(':visible'),
    nameError: () => cy.get('.invalid-feedback, .text-danger, .error').filter(':visible'),
    emailError: () => cy.get('.invalid-feedback, .text-danger, .error').filter(':visible'),
    passwordError: () => cy.get('.invalid-feedback, .text-danger, .error').filter(':visible')
  }

  // Ações da página
  visit() {
    cy.visit(URLS.PATHS.REGISTER)
    return this
  }

  fillName(name) {
    this.elements.nameInput().clear().type(name)
    return this
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email)
    return this
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password)
    return this
  }

  checkAdmin() {
    this.elements.adminCheckbox().check()
    return this
  }

  uncheckAdmin() {
    this.elements.adminCheckbox().uncheck()
    return this
  }

  clickRegister() {
    this.elements.registerButton().click()
    return this
  }

  clickLogin() {
    this.elements.loginLink().click()
    return this
  }

  fillForm(userData) {
    this.fillName(userData.nome)
    this.fillEmail(userData.email)
    this.fillPassword(userData.password)
    if (userData.administrador === 'true') {
      this.checkAdmin()
    }
    return this
  }

  // Verificações
  shouldDisplaySuccessMessage() {
    this.elements.successMessage().should('be.visible')
    return this
  }

  shouldDisplayErrorMessage(message) {
    this.elements.errorMessage().should('be.visible').and('contain.text', message)
    return this
  }

  shouldDisplayValidationErrors() {
    this.elements.nameError().should('be.visible')
    this.elements.emailError().should('be.visible')
    this.elements.passwordError().should('be.visible')
    return this
  }
}

export default RegisterPage
