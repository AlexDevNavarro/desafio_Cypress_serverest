/// <reference types="cypress" />

describe('API - Autenticação e Login', () => {
  let userData
  let createdUserId
  const apiUrl = Cypress.env('apiUrl')

  beforeEach(() => {
    // Gerar e criar usuário para testes de autenticação
    cy.generateUserData().then((data) => {
      userData = data
      cy.createUserViaAPI(userData).then((response) => {
        createdUserId = response.body._id
      })
    })
  })

  afterEach(() => {
    // Limpar usuário criado
    if (createdUserId) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/usuarios/${createdUserId}`,
        failOnStatusCode: false
      })
    }
  })

  it('Deve fazer login com credenciais válidas', () => {
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: userData.email,
        password: userData.password
      }
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('message', 'Login realizado com sucesso')
      expect(response.body).to.have.property('authorization')
      
      // Verificar formato do token
      expect(response.body.authorization).to.be.a('string')
      expect(response.body.authorization).to.have.length.greaterThan(0)
      expect(response.body.authorization).to.include('Bearer')
    })
  })

  it('Deve retornar erro para credenciais inválidas', () => {
    // Act - Email inexistente
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'usuario@inexistente.com',
        password: userData.password
      },
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
    })
    
    // Act - Senha incorreta
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: userData.email,
        password: 'senhaerrada'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
    })
  })

  it('Deve validar campos obrigatórios no login', () => {
    // Act - Login sem email
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        password: userData.password
      },
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email')
    })
    
    // Act - Login sem senha
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: userData.email
      },
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('password')
    })
    
    // Act - Login sem dados
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email')
      expect(response.body).to.have.property('password')
    })
  })

  it('Deve usar token de autenticação para acessar recursos protegidos', () => {
    // Arrange - Fazer login para obter token
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: userData.email,
        password: userData.password
      }
    }).then((loginResponse) => {
      const token = loginResponse.body.authorization
      
      // Act - Criar produto usando token (recurso que requer autenticação)
      cy.generateProductData().then((productData) => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/produtos`,
          headers: {
            'Authorization': token
          },
          body: productData
        }).then((response) => {
          // Assert
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
          expect(response.body).to.have.property('_id')
          
          // Limpar produto criado
          cy.request({
            method: 'DELETE',
            url: `${apiUrl}/produtos/${response.body._id}`,
            headers: {
              'Authorization': token
            },
            failOnStatusCode: false
          })
        })
      })
    })
  })

  it('Deve rejeitar acesso a recursos protegidos sem token', () => {
    // Act - Tentar criar produto sem token
    cy.generateProductData().then((productData) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/produtos`,
        body: productData,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message', 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
      })
    })
  })

  it('Deve rejeitar token inválido', () => {
    // Act - Tentar usar token inválido
    const invalidToken = 'Bearer token-invalido-12345'
    
    cy.generateProductData().then((productData) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/produtos`,
        headers: {
          'Authorization': invalidToken
        },
        body: productData,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message', 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
      })
    })
  })

  it('Deve validar formato de email no login', () => {
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'email-sem-formato-valido',
        password: userData.password
      },
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('email')
      expect(response.body.email).to.contain('email deve ser um email válido')
    })
  })

  it('Deve verificar persistência do token entre requisições', () => {
    // Arrange - Fazer login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: userData.email,
        password: userData.password
      }
    }).then((loginResponse) => {
      const token = loginResponse.body.authorization
      
      // Act - Usar o mesmo token em múltiplas requisições
      cy.request({
        method: 'GET',
        url: `${apiUrl}/usuarios`,
        headers: {
          'Authorization': token
        }
      }).then((firstResponse) => {
        expect(firstResponse.status).to.eq(200)
        
        // Segunda requisição com o mesmo token
        cy.request({
          method: 'GET',
          url: `${apiUrl}/produtos`,
          headers: {
            'Authorization': token
          }
        }).then((secondResponse) => {
          // Assert
          expect(secondResponse.status).to.eq(200)
          expect(secondResponse.body).to.have.property('produtos')
        })
      })
    })
  })
})
