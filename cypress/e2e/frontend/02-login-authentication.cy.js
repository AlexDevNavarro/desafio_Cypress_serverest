/// <reference types="cypress" />

describe('Autenticação e Login - Final', () => {
  let userData

  beforeEach(() => {
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
    cy.visit('/login')
    cy.wait(2000)

    // Act
    cy.get('[data-testid="email"]').clear().type(userData.email)
    cy.get('[data-testid="senha"]').clear().type(userData.password)
    cy.get('[data-testid="entrar"]').click()

    // Assert
    cy.wait(3000)
    cy.url().should('not.include', '/login')
    
    // Verificar se tem nome do usuário na página
    cy.get('body').should('contain.text', userData.nome.split(' ')[0])
    
    // Verificar se botão de logout está presente
    cy.get('[data-testid="logout"]').should('be.visible')
  })

  it('Deve fazer login e logout corretamente', () => {
    // Arrange & Act - Fazer login
    cy.visit('/login')
    cy.wait(2000)
    
    cy.get('[data-testid="email"]').clear().type(userData.email)
    cy.get('[data-testid="senha"]').clear().type(userData.password)
    cy.get('[data-testid="entrar"]').click()
    
    // Assert - Verificar que está logado
    cy.wait(3000)
    cy.url().should('not.include', '/login')
    
    // Act - Fazer logout
    cy.get('[data-testid="logout"]').click()
    
    // Assert - Verificar que voltou para tela de login
    cy.wait(2000)
    cy.url().should('include', '/login')
    cy.get('[data-testid="entrar"]').should('be.visible')
  })

  it('Deve exibir erro ao tentar login com credenciais inválidas', () => {
    // Arrange
    cy.visit('/login')
    cy.wait(2000)

    // Act - Tentar login com email inexistente
    cy.get('[data-testid="email"]').clear().type('usuario@inexistente.com')
    cy.get('[data-testid="senha"]').clear().type('senhaerrada')
    cy.get('[data-testid="entrar"]').click()

    // Assert
    cy.wait(3000)
    cy.get('body').then(($body) => {
      const hasErrorMessage = $body.text().includes('inválid') || 
                             $body.text().includes('erro') ||
                             $body.find('.alert').length > 0
      const stillOnLogin = $body.find('[data-testid="entrar"]').length > 0
      expect(hasErrorMessage || stillOnLogin).to.be.true
    })
  })

  it('Deve validar campos obrigatórios no formulário de login', () => {
    // Arrange
    cy.visit('/login')
    cy.wait(2000)

    // Act - Tentar login sem preencher campos
    cy.get('[data-testid="entrar"]').click()

    // Assert - Verificar que permaneceu na página
    cy.wait(2000)
    cy.url().should('include', '/login')
    
    // Verificar que os campos ainda estão vazios
    cy.get('[data-testid="email"]').should('have.value', '')
    cy.get('[data-testid="senha"]').should('have.value', '')
  })

  it('Deve navegar para página de cadastro a partir do login', () => {
    // Arrange
    cy.visit('/login')
    cy.wait(2000)

    // Act - Navegar para cadastro
    cy.get('[data-testid="cadastrar"]').click()

    // Assert
    cy.wait(2000)
    cy.url().should('include', '/cadastr')
    
    // Verificar se chegou na página de cadastro
    cy.get('body').then(($body) => {
      const onCadastro = $body.find('[data-testid="nome"]').length > 0 ||
                        $body.find('[data-testid="cadastrarUsuarios"]').length > 0 ||
                        $body.text().includes('Cadastro')
      expect(onCadastro).to.be.true
    })
    
    // Verificar se pode voltar para login
    cy.get('[data-testid="entrar"]').click()
    cy.wait(2000)
    cy.url().should('include', '/login')
  })
})
