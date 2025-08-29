class HomePage {
  // Seletores da página inicial
  elements = {
    welcomeMessage: () => cy.get('h1, .welcome, .title').first(),
    logoutButton: () => cy.contains('button, a', /sair|logout/i),
    userMenu: () => cy.get('.navbar, .menu, .nav'),
    adminPanel: () => cy.contains('a, button', /cadastr.*produto/i),
    productsLink: () => cy.contains('a', /produto/i),
    usersLink: () => cy.contains('a', /usuário/i),
    cartIcon: () => cy.contains('a', /carrinho/i).or(cy.get('[class*="cart"]')),
    searchInput: () => cy.get('input[type="search"], input[placeholder*="pesquis"], input[name="search"]'),
    productCards: () => cy.get('.card, .product, .item'),
    addToCartButtons: () => cy.contains('button', /adicionar|carrinho/i)
  }

  // Ações da página
  visit() {
    cy.visit('/')
    return this
  }

  logout() {
    this.elements.logoutButton().click()
    return this
  }

  goToAdminPanel() {
    this.elements.adminPanel().click()
    return this
  }

  goToProducts() {
    this.elements.productsLink().click()
    return this
  }

  goToUsers() {
    this.elements.usersLink().click()
    return this
  }

  goToCart() {
    this.elements.cartIcon().click()
    return this
  }

  searchProduct(productName) {
    this.elements.searchInput().type(productName).type('{enter}')
    return this
  }

  addFirstProductToCart() {
    this.elements.addToCartButtons().first().click()
    return this
  }

  // Verificações
  shouldBeVisible() {
    this.elements.welcomeMessage().should('be.visible')
    return this
  }

  shouldDisplayWelcomeMessage(userName) {
    this.elements.welcomeMessage().should('contain.text', `Bem Vindo ${userName}`)
    return this
  }

  shouldDisplayAdminOptions() {
    this.elements.adminPanel().should('be.visible')
    this.elements.usersLink().should('be.visible')
    return this
  }

  shouldDisplayProducts() {
    this.elements.productCards().should('have.length.greaterThan', 0)
    return this
  }

  shouldNotDisplayAdminOptions() {
    this.elements.adminPanel().should('not.exist')
    this.elements.usersLink().should('not.exist')
    return this
  }
}

export default HomePage
