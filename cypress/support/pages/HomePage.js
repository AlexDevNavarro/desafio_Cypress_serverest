class HomePage {
  // Seletores da página inicial
  elements = {
    welcomeMessage: () => cy.get('h1').first(),
    logoutButton: () => cy.get('[data-testid="logout"]'),
    userMenu: () => cy.get('.navbar'),
    adminPanel: () => cy.get('[data-testid="cadastrarProdutos"]'),
    productsLink: () => cy.get('[data-testid="listarProdutos"]'),
    usersLink: () => cy.get('[data-testid="listarUsuarios"]'),
    cartIcon: () => cy.get('[data-testid="carrinho"]'),
    searchInput: () => cy.get('[data-testid="pesquisar"]'),
    productCards: () => cy.get('[data-testid="card-product"]'),
    addToCartButtons: () => cy.get('[data-testid="adicionarNaLista"]')
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
    // Aceitar variações de espaçamento e formatação
    this.elements.welcomeMessage().should('be.visible')
    this.elements.welcomeMessage().invoke('text').should('match', new RegExp(`Bem.?Vindo.+${userName.split(' ')[0]}`, 'i'))
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
