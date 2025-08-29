// Utilitários para dados de teste

/**
 * Cria um email único baseado em timestamp
 * @param {string} prefix - Prefixo para o email
 * @returns {string} Email único
 */
export const generateUniqueEmail = (prefix = 'teste') => {
  const timestamp = Date.now()
  return `${prefix}_${timestamp}@exemplo.com`
}

/**
 * Cria dados de usuário com valores padrão
 * @param {object} overrides - Valores para sobrescrever os padrões
 * @returns {object} Dados do usuário
 */
export const generateUserData = (overrides = {}) => {
  return {
    nome: 'Usuário de Teste',
    email: generateUniqueEmail(),
    password: 'senha123',
    administrador: 'true',
    ...overrides
  }
}

/**
 * Cria dados de produto com valores padrão
 * @param {object} overrides - Valores para sobrescrever os padrões
 * @returns {object} Dados do produto
 */
export const generateProductData = (overrides = {}) => {
  const timestamp = Date.now()
  return {
    nome: `Produto Teste ${timestamp}`,
    preco: 100,
    descricao: 'Descrição do produto de teste',
    quantidade: 10,
    ...overrides
  }
}

/**
 * Aguarda elemento estar visível com timeout customizado
 * @param {string} selector - Seletor do elemento
 * @param {number} timeout - Timeout em millisegundos
 */
export const waitForElement = (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible')
}

/**
 * Aguarda URL conter determinado texto
 * @param {string} urlPart - Parte da URL esperada
 * @param {number} timeout - Timeout em millisegundos
 */
export const waitForUrl = (urlPart, timeout = 10000) => {
  cy.url({ timeout }).should('include', urlPart)
}

/**
 * Limpa dados de sessão
 */
export const clearSession = () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
}

/**
 * Intercepta requisições de API específicas
 * @param {string} method - Método HTTP
 * @param {string} url - URL da API
 * @param {string} alias - Alias para a interceptação
 */
export const interceptApiCall = (method, url, alias) => {
  cy.intercept(method, url).as(alias)
}

/**
 * Aguarda e valida resposta de API interceptada
 * @param {string} alias - Alias da interceptação
 * @param {number} expectedStatus - Status HTTP esperado
 */
export const waitForApiResponse = (alias, expectedStatus = 200) => {
  cy.wait(`@${alias}`).then((interception) => {
    expect(interception.response.statusCode).to.eq(expectedStatus)
  })
}
