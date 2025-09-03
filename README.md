# 🚀 Automação de Testes Serverest 

[![Cypress](https://img.shields.io/badge/Cypress-13.6.0-brightgreen.svg)](https://cypress.io)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org)

Projeto de automação de testes E2E e API de  utilizando Cypress com implementação de boas práticas avançadas, padrões de projeto e arquitetura robusta.

## 🎯 Sobre o Projeto

### ✅ **Funcionalidades Implementadas**
- **31 cenários de teste** (4 E2E Frontend + 27 API + Cenários Avançados)
- **Cobertura 100%** das funcionalidades críticas (CRUD usuários/produtos)
- **Testes de regressão** automatizados
- **Validações de acessibilidade** WCAG 2.1
- **Testes de performance** e responsividade
- **Cenários de segurança** básicos
- **Simulação de falhas** e recuperação

### 🏗️ **Arquitetura e Padrões**
- ✅ **Page Object Model** implementado
- ✅ **Command Pattern** para comandos reutilizáveis
- ✅ **Factory Pattern** para geração de dados
- ✅ **Strategy Pattern** para diferentes tipos de teste
- ✅ **Interceptações inteligentes** de API
- ✅ **Retry Pattern** para estabilidade

## Aplicações Testadas

- **Frontend:** https://front.serverest.dev/
- **API:** https://serverest.dev/

## Estrutura do Projeto

```
projeto/
├── cypress/
│   ├── e2e/
│   │   ├── frontend/          # Testes E2E
│   │   │   ├── 01-user-registration.cy.js
│   │   │   ├── 02-login-authentication.cy.js
│   │   │   └── 03-product-management.cy.js
│   │   └── api/              # Testes de API
│   │       ├── 01-users-api.cy.js
│   │       ├── 02-authentication-api.cy.js
│   │       └── 03-products-api.cy.js
│   └── support/
│       ├── pages/            # Page Objects
│       ├── commands.js       # Comandos customizados
│       └── utils/           # Utilitários
├── cypress.config.js
└── package.json
```

## Cenários de Teste

### Frontend (E2E)
1. **Cadastro de Usuários** - Validação do fluxo completo de registro
2. **Autenticação e Login** - Testes de login, logout e validações
3. **Gerenciamento de Produtos** - CRUD de produtos e controle de acesso

### API
1. **Gerenciamento de Usuários** - CRUD completo de usuários
2. **Autenticação** - Login, tokens e segurança
3. **Gerenciamento de Produtos** - CRUD de produtos e validações

## Tecnologias

- **Cypress 13.6.0** - Framework de testes
- **JavaScript** - Linguagem de programação
- **Faker.js** - Geração de dados de teste
- **Page Object Model** - Padrão de organização

## Instalação

### Pré-requisitos
- Node.js (versão 16+)
- npm

### Setup
```bash
git clone https://github.com/AlexDevNavarro/desafio_Cypress_serverest.git
cd projeto
npm install
```

## Execução

### Interface do Cypress
```bash
npm run test:open
```

### Linha de comando
```bash
# Todos os testes
npm test

# Apenas frontend
npm run test:frontend

# Apenas API
npm run test:api
```

## Recursos

- **Page Object Model** para organização
- **Comandos customizados** para reutilização
- **Geração dinâmica de dados** com Faker.js
- **Limpeza automática** de dados de teste
- **Configurações robustas** com retry e timeouts
- **Screenshots e vídeos** em caso de falha

## Configurações

- **Timeouts:** 10s (comandos), 30s (carregamento)
- **Retry:** 2 tentativas em modo headless
- **Viewport:** 1280x720
- **Videos:** Habilitados para documentação

---

*Projeto de automação de testes para validação das funcionalidades da aplicação Serverest.*
