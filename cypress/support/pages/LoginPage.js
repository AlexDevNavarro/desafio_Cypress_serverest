class LoginPage {
  // Seletores da página de login
  elements = {
    emailInput: () => cy.get('input[type="email"], input[name="email"], #email'),
    passwordInput: () => cy.get('input[type="password"], input[name="password"], #password'),
    loginButton: () => cy.contains('button', /entrar|login/i).or(cy.get('button[type="submit"]')),
    registerLink: () => cy.contains('a', /cadastr|registr/i),
    errorMessage: () => cy.get('.alert, .error, .message').filter(':visible'),
    emailError: () => cy.get('.invalid-feedback, .error').filter(':visible'),
    passwordError: () => cy.get('.invalid-feedback, .error').filter(':visible')
  }

  // Ações da página
  visit() {
    cy.visit('/login')
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

  clickLogin() {
    this.elements.loginButton().click()
    return this
  }

  clickRegister() {
    this.elements.registerLink().click()
    return this
  }

  login(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
    this.clickLogin()
    return this
  }

  // Verificações
  shouldDisplayErrorMessage(message) {
    this.elements.errorMessage().should('be.visible').and('contain.text', message)
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
}

export default LoginPage
