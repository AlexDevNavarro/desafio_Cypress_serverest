/// <reference types="cypress" />

describe('API - Gerenciamento de Usuários', () => {
  let userData
  let createdUserId
  const apiUrl = Cypress.env('apiUrl')

  beforeEach(() => {
    // Gerar dados únicos para cada teste
    cy.generateUserData().then((data) => {
      userData = data
    })
  })

  afterEach(() => {
    // Limpar usuário criado após cada teste
    if (createdUserId) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/usuarios/${createdUserId}`,
        failOnStatusCode: false
      })
    }
  })

  it('Deve criar um novo usuário via API', () => {
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: userData
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
      
      // Salvar ID para limpeza
      createdUserId = response.body._id
      
      // Verificar estrutura da resposta
      expect(response.body._id).to.be.a('string')
      expect(response.body._id).to.have.length.greaterThan(0)
    })
  })

  it('Deve listar usuários cadastrados', () => {
    // Arrange - Criar usuário primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: userData
    }).then((createResponse) => {
      createdUserId = createResponse.body._id
      
      // Act
      cy.request({
        method: 'GET',
        url: `${apiUrl}/usuarios`
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('usuarios')
        expect(response.body).to.have.property('quantidade')
        expect(response.body.usuarios).to.be.an('array')
        expect(response.body.quantidade).to.be.a('number')
        
        // Verificar se o usuário criado está na lista
        const foundUser = response.body.usuarios.find(user => user._id === createdUserId)
        expect(foundUser).to.exist
        expect(foundUser.nome).to.eq(userData.nome)
        expect(foundUser.email).to.eq(userData.email)
        expect(foundUser.administrador).to.eq(userData.administrador)
        // A API Serverest retorna a senha em texto plano (não recomendado em produção)
        expect(foundUser).to.have.property('password')
        expect(foundUser.password).to.be.a('string')
      })
    })
  })

  it('Deve buscar usuário específico por ID', () => {
    // Arrange - Criar usuário primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: userData
    }).then((createResponse) => {
      createdUserId = createResponse.body._id
      
      // Act
      cy.request({
        method: 'GET',
        url: `${apiUrl}/usuarios/${createdUserId}`
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body._id).to.eq(createdUserId)
        expect(response.body.nome).to.eq(userData.nome)
        expect(response.body.email).to.eq(userData.email)
        expect(response.body.administrador).to.eq(userData.administrador)
        // A API Serverest retorna a senha em texto plano (não recomendado em produção)
        expect(response.body).to.have.property('password')
        expect(response.body.password).to.be.a('string')
      })
    })
  })

  it('Deve atualizar dados do usuário', () => {
    // Arrange - Criar usuário primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: userData
    }).then((createResponse) => {
      createdUserId = createResponse.body._id
      
      // Dados atualizados
      const updatedData = {
        nome: 'Nome Atualizado',
        email: `updated_${userData.email}`,
        password: 'novasenha123',
        administrador: 'false'
      }
      
      // Act
      cy.request({
        method: 'PUT',
        url: `${apiUrl}/usuarios/${createdUserId}`,
        body: updatedData
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro alterado com sucesso')
        
        // Verificar se os dados foram realmente atualizados
        cy.request({
          method: 'GET',
          url: `${apiUrl}/usuarios/${createdUserId}`
        }).then((getResponse) => {
          expect(getResponse.body.nome).to.eq(updatedData.nome)
          expect(getResponse.body.email).to.eq(updatedData.email)
          expect(getResponse.body.administrador).to.eq(updatedData.administrador)
        })
      })
    })
  })

  it('Deve deletar usuário', () => {
    // Arrange - Criar usuário primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: userData
    }).then((createResponse) => {
      const userId = createResponse.body._id
      
      // Act
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/usuarios/${userId}`
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro excluído com sucesso')
        
        // Verificar se usuário foi realmente deletado
        cy.request({
          method: 'GET',
          url: `${apiUrl}/usuarios/${userId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(400)
          expect(getResponse.body).to.have.property('message', 'Usuário não encontrado')
        })
      })
      
      // Não precisar limpar pois já foi deletado
      createdUserId = null
    })
  })

  it('Deve validar dados obrigatórios ao criar usuário', () => {
    // Act - Tentar criar usuário sem dados obrigatórios
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('nome')
      expect(response.body).to.have.property('email')
      expect(response.body).to.have.property('password')
      expect(response.body).to.have.property('administrador')
    })
  })

  it('Não deve permitir criar usuário com email duplicado', () => {
    // Arrange - Criar primeiro usuário
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: userData
    }).then((firstResponse) => {
      createdUserId = firstResponse.body._id
      
      // Act - Tentar criar segundo usuário com mesmo email
      cy.request({
        method: 'POST',
        url: `${apiUrl}/usuarios`,
        body: userData,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('message', 'Este email já está sendo usado')
      })
    })
  })

  it('Deve validar formato de email inválido', () => {
    // Arrange
    const invalidUserData = {
      ...userData,
      email: 'email-invalido'
    }
    
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: invalidUserData,
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email')
      expect(response.body.email).to.contain('email deve ser um email válido')
    })
  })
})
