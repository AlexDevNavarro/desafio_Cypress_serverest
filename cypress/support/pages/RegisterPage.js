class RegisterPage {
  // Seletores da página de cadastro
  elements = {
    nameInput: () => cy.get('[data-testid="nome"]'),
    emailInput: () => cy.get('[data-testid="email"]'),
    passwordInput: () => cy.get('[data-testid="password"]'),
    adminCheckbox: () => cy.get('[data-testid="checkbox"]'),
    registerButton: () => cy.get('[data-testid="cadastrarUsuarios"]'),
    loginLink: () => cy.get('[data-testid="entrar"]'),
    successMessage: () => cy.get('.alert-success, .alert-dismissible, [role="alert"]').filter(':visible'),
    errorMessage: () => cy.get('.alert, .alert-danger, [role="alert"]').filter(':visible'),
    nameError: () => cy.get('.invalid-feedback, .text-danger, .error').filter(':visible'),
    emailError: () => cy.get('.invalid-feedback, .text-danger, .error').filter(':visible'),
    passwordError: () => cy.get('.invalid-feedback, .text-danger, .error').filter(':visible')
  }

  // Ações da página
  visit() {
    cy.visit('/cadastrarusuarios')
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
