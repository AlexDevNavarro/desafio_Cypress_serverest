# 🚀 Projeto de Automação com Cypress - Serverest

Este projeto implementa testes automatizados E2E e de API usando Cypress para a aplicação [Serverest](https://serverest.dev/), conforme especificado no desafio de automação.

## 📋 Sobre o Projeto

O projeto foi desenvolvido como resposta ao desafio de automação que solicita:
- ✅ 3 cenários de testes E2E automatizados para o frontend
- ✅ 3 cenários de testes automatizados para a API
- ✅ Utilização do framework Cypress e JavaScript
- ✅ Aplicação de boas práticas e padrões de projeto

## 🎯 Aplicações Testadas

- **Frontend:** https://front.serverest.dev/
- **API:** https://serverest.dev/

## 🏗️ Estrutura do Projeto

```
cypress-serverest-automation/
├── cypress/
│   ├── e2e/
│   │   ├── frontend/           # Testes E2E do Frontend
│   │   │   ├── 01-user-registration.cy.js
│   │   │   ├── 02-login-authentication.cy.js
│   │   │   └── 03-product-management.cy.js
│   │   └── api/               # Testes de API
│   │       ├── 01-users-api.cy.js
│   │       ├── 02-authentication-api.cy.js
│   │       └── 03-products-api.cy.js
│   └── support/
│       ├── pages/             # Page Objects
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   └── HomePage.js
│       ├── commands.js        # Comandos customizados
│       └── e2e.js            # Configurações globais
├── cypress.config.js          # Configuração do Cypress
├── package.json
└── README.md
```

## 🧪 Cenários de Teste Implementados

### Frontend (E2E)

#### 1. Cadastro de Usuários (`01-user-registration.cy.js`)
- ✅ Cadastro de usuário administrador com sucesso
- ✅ Cadastro de usuário comum (não administrador) com sucesso
- ✅ Validação de campos obrigatórios e dados inválidos
- ✅ Verificação de email duplicado

#### 2. Autenticação e Login (`02-login-authentication.cy.js`)
- ✅ Login com credenciais válidas de administrador
- ✅ Fluxo de login e logout completo
- ✅ Validação de credenciais inválidas
- ✅ Validação de campos obrigatórios
- ✅ Navegação entre páginas de login e cadastro

#### 3. Gerenciamento de Produtos (`03-product-management.cy.js`)
- ✅ Cadastro de produto como administrador
- ✅ Visualização e pesquisa de produtos
- ✅ Gerenciamento de carrinho de compras
- ✅ Validação de restrições de acesso por perfil
- ✅ Listagem de produtos existentes

### API

#### 1. Gerenciamento de Usuários (`01-users-api.cy.js`)
- ✅ Criação de usuário via API
- ✅ Listagem de usuários cadastrados
- ✅ Busca de usuário específico por ID
- ✅ Atualização de dados do usuário
- ✅ Exclusão de usuário
- ✅ Validação de dados obrigatórios
- ✅ Verificação de email duplicado
- ✅ Validação de formato de email

#### 2. Autenticação (`02-authentication-api.cy.js`)
- ✅ Login com credenciais válidas
- ✅ Validação de credenciais inválidas
- ✅ Validação de campos obrigatórios
- ✅ Uso de token para recursos protegidos
- ✅ Rejeição de acesso sem token
- ✅ Validação de token inválido
- ✅ Persistência do token entre requisições

#### 3. Gerenciamento de Produtos (`03-products-api.cy.js`)
- ✅ Criação de produto com autenticação
- ✅ Listagem de todos os produtos
- ✅ Busca de produto específico por ID
- ✅ Atualização de dados do produto
- ✅ Exclusão de produto
- ✅ Validação de dados obrigatórios
- ✅ Verificação de nome duplicado
- ✅ Validação de tipos de dados
- ✅ Filtros e query parameters
- ✅ Validação de valores mínimos

## 🛠️ Tecnologias e Ferramentas

- **Cypress 13.6.0** - Framework de testes E2E
- **JavaScript ES6+** - Linguagem de programação
- **Faker.js** - Geração de dados de teste
- **Page Object Model** - Padrão de design para organização
- **Custom Commands** - Comandos reutilizáveis

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd cypress-serverest-automation
```

2. Instale as dependências:
```bash
npm install
```

## 🚀 Executando os Testes

### Modo Interativo (Cypress UI)
```bash
npm run test:open
# ou
npm run cy:open
```

### Modo Headless (linha de comando)
```bash
# Todos os testes
npm test

# Apenas testes do frontend
npm run test:frontend

# Apenas testes da API
npm run test:api

# Modo headless
npm run test:headless
```

## 🏆 Boas Práticas Implementadas

### 1. **Organização e Estrutura**
- Separação clara entre testes de frontend e API
- Uso do padrão Page Object Model para testes E2E
- Estrutura de pastas bem definida

### 2. **Reutilização de Código**
- Comandos customizados para ações comuns
- Page Objects para encapsular elementos e ações
- Funções auxiliares para geração de dados

### 3. **Gerenciamento de Dados**
- Uso do Faker.js para dados dinâmicos
- Limpeza automática de dados após cada teste
- Dados únicos para evitar conflitos entre testes

### 4. **Configurações**
- Configuração centralizada no `cypress.config.js`
- Timeouts apropriados para diferentes tipos de teste
- Configuração de retry para testes flaky

### 5. **Assertivas Claras**
- Verificações específicas e descritivas
- Validação de estrutura de resposta da API
- Verificação de estados da aplicação

### 6. **Tratamento de Erros**
- Uso de `failOnStatusCode: false` quando apropriado
- Validação de cenários negativos
- Verificação de mensagens de erro específicas

## 📊 Relatórios e Screenshots

O Cypress está configurado para:
- 📹 Gravar vídeos dos testes executados
- 📸 Capturar screenshots em caso de falha
- 📋 Gerar relatórios detalhados de execução

## 🔧 Configurações Importantes

### Timeouts
- **defaultCommandTimeout:** 10s
- **requestTimeout:** 10s
- **responseTimeout:** 10s
- **pageLoadTimeout:** 30s

### Retry Strategy
- **runMode:** 2 tentativas
- **openMode:** 0 tentativas (para debug)

### Viewport
- **Largura:** 1280px
- **Altura:** 720px

## 🎯 Cobertura de Testes

### Funcionalidades Testadas

#### Frontend
- [x] Cadastro de usuários (admin e comum)
- [x] Login e logout
- [x] Navegação entre páginas
- [x] Cadastro de produtos
- [x] Listagem e pesquisa de produtos
- [x] Carrinho de compras
- [x] Validações de formulário
- [x] Controle de acesso por perfil

#### API
- [x] CRUD completo de usuários
- [x] CRUD completo de produtos
- [x] Autenticação e autorização
- [x] Validações de entrada
- [x] Tratamento de erros
- [x] Filtros e consultas
- [x] Segurança de endpoints

## 🔍 Estratégias de Teste

### 1. **Testes de Caminho Feliz**
- Fluxos principais funcionando corretamente
- Operações CRUD básicas
- Autenticação válida

### 2. **Testes de Validação**
- Campos obrigatórios
- Formatos de dados
- Valores mínimos e máximos

### 3. **Testes de Segurança**
- Controle de acesso
- Validação de tokens
- Proteção de endpoints

### 4. **Testes de Integração**
- Comunicação entre frontend e API
- Fluxos completos de usuário
- Sincronização de dados

## 📝 Commits e Versionamento

O projeto segue boas práticas de versionamento:
- Commits descritivos e claros
- Separação lógica de funcionalidades
- Histórico limpo e organizado

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Projeto desenvolvido como solução de automação de testes**
