// Constantes utilizadas nos testes

// URLs base
export const URLS = {
  BASE_FRONTEND: 'https://front.serverest.dev',
  BASE_API: 'https://serverest.dev',
  PATHS: {
    LOGIN: '/login',
    REGISTER: '/cadastrarusuarios',
    ADMIN_HOME: '/admin/home',
    ADMIN_PRODUCTS: '/admin/cadastrarprodutos',
    PRODUCTS: '/produtos',
    USERS: '/usuarios',
    CART: '/carrinho'
  }
}

// Seletores de elementos frequentemente utilizados
export const SELECTORS = {
  // Login
  LOGIN_EMAIL: '[data-testid="email"]',
  LOGIN_PASSWORD: '[data-testid="senha"]',
  LOGIN_BUTTON: '[data-testid="entrar"]',
  
  // Cadastro
  REGISTER_NAME: '[data-testid="nome"]',
  REGISTER_EMAIL: '[data-testid="email"]',
  REGISTER_PASSWORD: '[data-testid="password"]',
  REGISTER_ADMIN: '[data-testid="checkbox"]',
  REGISTER_BUTTON: '[data-testid="cadastrar"]',
  
  // Navegação
  LOGOUT_BUTTON: '[data-testid="logout"]',
  CART_ICON: '[data-testid="carrinho"]',
  ADMIN_PRODUCTS_LINK: '[data-testid="cadastrarProdutos"]',
  
  // Alertas e mensagens
  SUCCESS_ALERT: '.alert-success',
  ERROR_ALERT: '.alert-danger',
  DISMISSIBLE_ALERT: '.alert-dismissible'
}

// Mensagens de resposta da API
export const API_MESSAGES = {
  SUCCESS: {
    REGISTER: 'Cadastro realizado com sucesso',
    LOGIN: 'Login realizado com sucesso',
    UPDATE: 'Registro alterado com sucesso',
    DELETE: 'Registro excluído com sucesso'
  },
  ERROR: {
    DUPLICATE_EMAIL: 'Este email já está sendo usado',
    INVALID_CREDENTIALS: 'Email e/ou senha inválidos',
    INVALID_TOKEN: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    USER_NOT_FOUND: 'Usuário não encontrado',
    PRODUCT_NOT_FOUND: 'Produto não encontrado',
    DUPLICATE_PRODUCT: 'Já existe produto com esse nome'
  }
}

// Status codes HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

// Timeouts para diferentes tipos de operação
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  API_REQUEST: 10000,
  PAGE_LOAD: 30000
}

// Configurações de retry
export const RETRY_CONFIG = {
  RUN_MODE: 2,
  OPEN_MODE: 0
}

// Dados de teste padrão
export const DEFAULT_TEST_DATA = {
  USER: {
    PASSWORD: 'teste123',
    ADMIN_FLAG: 'true',
    COMMON_FLAG: 'false'
  },
  PRODUCT: {
    MIN_PRICE: 1,
    MAX_PRICE: 10000,
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 1000
  }
}

// Endpoints da API
export const API_ENDPOINTS = {
  USERS: '/usuarios',
  PRODUCTS: '/produtos',
  LOGIN: '/login',
  CARTS: '/carrinhos'
}

// Expressões regulares para validação
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MONGO_ID: /^[0-9a-fA-F]{24}$/,
  BEARER_TOKEN: /^Bearer\s[\w\-\.]+$/
}
