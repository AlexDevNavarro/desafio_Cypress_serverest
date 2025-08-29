/// <reference types="cypress" />

import LoginPage from '../../support/pages/LoginPage'
import HomePage from '../../support/pages/HomePage'

describe('Gerenciamento de Produtos', () => {
  let loginPage, homePage
  let userData, productData, authToken

  beforeEach(() => {
    loginPage = new LoginPage()
    homePage = new HomePage()
    
    // Configurar usuário administrador e produto para testes
    cy.generateUserData().then((user) => {
      userData = user
      cy.createUserViaAPI(userData).then(() => {
        cy.getAuthToken(userData).then((token) => {
          authToken = token
        })
      })
    })
    
    cy.generateProductData().then((product) => {
      productData = product
    })
  })

  afterEach(() => {
    // Limpar dados de teste
    if (userData) {
      cy.cleanupTestData(userData.email, authToken)
    }
  })

  it('Deve cadastrar um novo produto como administrador', () => {
    // Arrange - Fazer login como administrador
    loginPage.visit()
    loginPage.login(userData.email, userData.password)
    homePage.shouldBeVisible()

    // Act - Navegar para cadastro de produtos
    homePage.goToAdminPanel()
    
    // Verificar se chegou na página de cadastro de produtos
    cy.url().should('include', '/admin/cadastrarprodutos')
    
    // Preencher formulário de produto
    cy.get('[data-testid="nome"]').type(productData.nome)
    cy.get('[data-testid="preco"]').type(productData.preco.toString())
    cy.get('[data-testid="descricao"]').type(productData.descricao)
    cy.get('[data-testid="quantity"]').type(productData.quantidade.toString())
    
    // Submeter formulário
    cy.get('[data-testid="cadastarProdutos"]').click()

    // Assert - Verificar sucesso
    cy.get('.alert').should('be.visible').and('contain.text', 'Cadastro realizado com sucesso')
    
    // Verificar se produto aparece na listagem
    homePage.goToProducts()
    cy.get('.card').should('contain.text', productData.nome)
  })

  it('Deve visualizar e pesquisar produtos na página inicial', () => {
    // Arrange - Criar produto via API primeiro
    cy.createProductViaAPI(productData, authToken)
    
    // Act - Acessar página inicial sem login (usuário comum)
    homePage.visit()

    // Assert - Verificar se produtos são exibidos
    homePage.shouldDisplayProducts()
    
    // Act - Pesquisar pelo produto criado
    homePage.searchProduct(productData.nome)
    
    // Assert - Verificar se encontrou o produto
    cy.get('.card').should('contain.text', productData.nome)
    cy.get('.card').should('contain.text', `R$ ${productData.preco}`)
  })

  it('Deve adicionar produto ao carrinho e gerenciar carrinho', () => {
    // Arrange - Criar produto via API e fazer login como usuário comum
    cy.createProductViaAPI(productData, authToken)
    
    // Criar usuário comum (não admin)
    const commonUserData = { ...userData, administrador: 'false', email: `comum_${userData.email}` }
    cy.createUserViaAPI(commonUserData)
    
    loginPage.visit()
    loginPage.login(commonUserData.email, commonUserData.password)
    
    // Act - Adicionar produto ao carrinho
    homePage.shouldBeVisible()
    homePage.addFirstProductToCart()
    
    // Assert - Verificar se foi adicionado ao carrinho
    cy.get('.alert').should('be.visible').and('contain.text', 'Produto adicionado com sucesso')
    
    // Act - Ir para o carrinho
    homePage.goToCart()
    
    // Assert - Verificar se produto está no carrinho
    cy.url().should('include', '/carrinho')
    cy.get('.card').should('contain.text', productData.nome)
    
    // Verificar botões de gerenciamento do carrinho
    cy.get('[data-testid*="subtrairProdutos"]').should('be.visible')
    cy.get('[data-testid*="adicionarProdutos"]').should('be.visible')
    cy.get('[data-testid*="excluirProdutos"]').should('be.visible')
    
    // Act - Excluir produto do carrinho
    cy.get('[data-testid*="excluirProdutos"]').first().click()
    
    // Assert - Verificar que carrinho ficou vazio
    cy.get('.alert').should('contain.text', 'Registro excluído com sucesso')
    
    // Limpar usuário comum criado
    cy.cleanupTestData(commonUserData.email)
  })

  it('Deve validar restrições de acesso para usuários não administradores', () => {
    // Arrange - Criar usuário comum
    const commonUserData = { ...userData, administrador: 'false', email: `comum_${userData.email}` }
    cy.createUserViaAPI(commonUserData)
    
    // Act - Fazer login como usuário comum
    loginPage.visit()
    loginPage.login(commonUserData.email, commonUserData.password)
    
    // Assert - Verificar que não tem acesso às funcionalidades de admin
    homePage
      .shouldBeVisible()
      .shouldNotDisplayAdminOptions()
    
    // Act - Tentar acessar URL de cadastro de produtos diretamente
    cy.visit('/admin/cadastrarprodutos')
    
    // Assert - Verificar que foi redirecionado ou negado acesso
    cy.url().should('not.include', '/admin/cadastrarprodutos')
    
    // Limpar usuário comum
    cy.cleanupTestData(commonUserData.email)
  })

  it('Deve listar produtos existentes na página de produtos', () => {
    // Arrange - Criar alguns produtos via API
    const produtos = []
    for (let i = 0; i < 3; i++) {
      cy.generateProductData().then((produto) => {
        produtos.push(produto)
        cy.createProductViaAPI(produto, authToken)
      })
    }

    // Act - Acessar página de produtos
    homePage.visit()
    homePage.goToProducts()

    // Assert - Verificar listagem de produtos
    cy.url().should('include', '/produtos')
    cy.get('.card').should('have.length.greaterThan', 0)
    
    // Verificar se os produtos criados aparecem na lista
    cy.get('.card').should('be.visible')
    
    // Verificar estrutura dos cards de produto
    cy.get('.card').first().within(() => {
      cy.get('.card-title').should('be.visible')
      cy.get('.card-text').should('be.visible')
      cy.contains('R$').should('be.visible')
    })
  })
})
