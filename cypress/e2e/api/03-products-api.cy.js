/// <reference types="cypress" />

describe('API - Gerenciamento de Produtos', () => {
  let userData, productData, authToken
  let createdUserId, createdProductId
  const apiUrl = Cypress.env('apiUrl')

  beforeEach(() => {
    // Configurar usuário administrador e obter token
    cy.generateUserData().then((user) => {
      userData = user
      cy.createUserViaAPI(userData).then((userResponse) => {
        createdUserId = userResponse.body._id
        cy.getAuthToken(userData).then((token) => {
          authToken = token
        })
      })
    })
    
    // Gerar dados de produto
    cy.generateProductData().then((product) => {
      productData = product
    })
  })

  afterEach(() => {
    // Limpar dados de teste
    if (createdProductId && authToken) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/produtos/${createdProductId}`,
        headers: { 'Authorization': authToken },
        failOnStatusCode: false
      })
    }
    
    if (createdUserId) {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/usuarios/${createdUserId}`,
        failOnStatusCode: false
      })
    }
  })

  it('Deve criar um novo produto com usuário autenticado', () => {
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: {
        'Authorization': authToken
      },
      body: productData
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso')
      expect(response.body).to.have.property('_id')
      
      // Salvar ID para limpeza
      createdProductId = response.body._id
      
      // Verificar estrutura da resposta
      expect(response.body._id).to.be.a('string')
      expect(response.body._id).to.have.length.greaterThan(0)
    })
  })

  it('Deve listar todos os produtos', () => {
    // Arrange - Criar produto primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: productData
    }).then((createResponse) => {
      createdProductId = createResponse.body._id
      
      // Act
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos`
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('produtos')
        expect(response.body).to.have.property('quantidade')
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.quantidade).to.be.a('number')
        
        // Verificar se o produto criado está na lista
        const foundProduct = response.body.produtos.find(product => product._id === createdProductId)
        expect(foundProduct).to.exist
        expect(foundProduct.nome).to.eq(productData.nome)
        expect(foundProduct.preco).to.eq(productData.preco)
        expect(foundProduct.descricao).to.eq(productData.descricao)
        expect(foundProduct.quantidade).to.eq(productData.quantidade)
      })
    })
  })

  it('Deve buscar produto específico por ID', () => {
    // Arrange - Criar produto primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: productData
    }).then((createResponse) => {
      createdProductId = createResponse.body._id
      
      // Act
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos/${createdProductId}`
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body._id).to.eq(createdProductId)
        expect(response.body.nome).to.eq(productData.nome)
        expect(response.body.preco).to.eq(productData.preco)
        expect(response.body.descricao).to.eq(productData.descricao)
        expect(response.body.quantidade).to.eq(productData.quantidade)
      })
    })
  })

  it('Deve atualizar dados do produto', () => {
    // Arrange - Criar produto primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: productData
    }).then((createResponse) => {
      createdProductId = createResponse.body._id
      
      // Dados atualizados
      const updatedProductData = {
        nome: 'Produto Atualizado',
        preco: 999,
        descricao: 'Descrição atualizada do produto',
        quantidade: 50
      }
      
      // Act
      cy.request({
        method: 'PUT',
        url: `${apiUrl}/produtos/${createdProductId}`,
        headers: { 'Authorization': authToken },
        body: updatedProductData
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro alterado com sucesso')
        
        // Verificar se os dados foram realmente atualizados
        cy.request({
          method: 'GET',
          url: `${apiUrl}/produtos/${createdProductId}`
        }).then((getResponse) => {
          expect(getResponse.body.nome).to.eq(updatedProductData.nome)
          expect(getResponse.body.preco).to.eq(updatedProductData.preco)
          expect(getResponse.body.descricao).to.eq(updatedProductData.descricao)
          expect(getResponse.body.quantidade).to.eq(updatedProductData.quantidade)
        })
      })
    })
  })

  it('Deve deletar produto', () => {
    // Arrange - Criar produto primeiro
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: productData
    }).then((createResponse) => {
      const productId = createResponse.body._id
      
      // Act
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/produtos/${productId}`,
        headers: { 'Authorization': authToken }
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Registro excluído com sucesso')
        
        // Verificar se produto foi realmente deletado
        cy.request({
          method: 'GET',
          url: `${apiUrl}/produtos/${productId}`,
          failOnStatusCode: false
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(400)
          expect(getResponse.body).to.have.property('message', 'Produto não encontrado')
        })
      })
      
      // Não precisar limpar pois já foi deletado
      createdProductId = null
    })
  })

  it('Deve validar dados obrigatórios ao criar produto', () => {
    // Act - Tentar criar produto sem dados obrigatórios
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('nome')
      expect(response.body).to.have.property('preco')
      expect(response.body).to.have.property('descricao')
      expect(response.body).to.have.property('quantidade')
    })
  })

  it('Não deve permitir criar produto com nome duplicado', () => {
    // Arrange - Criar primeiro produto
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: productData
    }).then((firstResponse) => {
      createdProductId = firstResponse.body._id
      
      // Act - Tentar criar segundo produto com mesmo nome
      cy.request({
        method: 'POST',
        url: `${apiUrl}/produtos`,
        headers: { 'Authorization': authToken },
        body: productData,
        failOnStatusCode: false
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('message', 'Já existe produto com esse nome')
      })
    })
  })

  it('Deve validar tipos de dados dos campos', () => {
    // Arrange
    const invalidProductData = {
      nome: productData.nome,
      preco: 'preco-invalido', // Deve ser número
      descricao: productData.descricao,
      quantidade: 'quantidade-invalida' // Deve ser número
    }
    
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: invalidProductData,
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('preco')
      expect(response.body).to.have.property('quantidade')
    })
  })

  it('Não deve permitir criar produto sem autenticação', () => {
    // Act
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

  it('Deve filtrar produtos por nome usando query parameters', () => {
    // Arrange - Criar produto com nome específico
    const specificProductData = {
      ...productData,
      nome: 'Produto Específico Para Busca'
    }
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: specificProductData
    }).then((createResponse) => {
      createdProductId = createResponse.body._id
      
      // Act - Buscar produto por nome
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos?nome=${encodeURIComponent(specificProductData.nome)}`
      }).then((response) => {
        // Assert
        expect(response.status).to.eq(200)
        expect(response.body.produtos).to.have.length(1)
        expect(response.body.produtos[0].nome).to.eq(specificProductData.nome)
        expect(response.body.produtos[0]._id).to.eq(createdProductId)
      })
    })
  })

  it('Deve validar valores mínimos para preço e quantidade', () => {
    // Arrange
    const invalidProductData = {
      nome: productData.nome + ' Invalid',
      preco: -10, // Preço negativo
      descricao: productData.descricao,
      quantidade: -5 // Quantidade negativa
    }
    
    // Act
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      headers: { 'Authorization': authToken },
      body: invalidProductData,
      failOnStatusCode: false
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(400)
      // A API pode retornar erros específicos sobre valores negativos
      expect(response.body).to.satisfy((body) => {
        return body.hasOwnProperty('preco') || body.hasOwnProperty('quantidade')
      })
    })
  })
})
