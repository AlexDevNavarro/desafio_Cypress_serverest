# 🚀 Como Executar os Testes

Este guia explica como configurar e executar os testes de automação do projeto Serverest.

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** versão 16 ou superior
- **npm** ou **yarn**
- **Git** para clonar o repositório

### Verificar Instalações
```bash
node --version    # Deve retornar v16.x.x ou superior
npm --version     # Deve retornar uma versão válida
git --version     # Deve retornar uma versão válida
```

## 📦 Instalação

### 1. Clonar o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd cypress-serverest-automation
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Verificar Instalação
```bash
npx cypress verify
```

## 🎯 Executando os Testes

### Modo Interativo (Recomendado para Desenvolvimento)

Abre a interface gráfica do Cypress:
```bash
npm run test:open
# ou
npm run cy:open
```

**Vantagens:**
- Visualização em tempo real
- Debug facilitado
- Seleção específica de testes
- Análise de falhas

### Modo Headless (Linha de Comando)

#### Todos os Testes
```bash
npm test
```

#### Apenas Testes do Frontend
```bash
npm run test:frontend
```

#### Apenas Testes da API
```bash
npm run test:api
```

#### Com Browser Específico
```bash
npm run test:chrome
npm run test:firefox
```

#### Modo Headless Explícito
```bash
npm run test:headless
```

## 📊 Estrutura de Execução

### Frontend E2E (3 cenários)
```bash
✅ Cadastro de Usuários
├── Usuário administrador
├── Usuário comum
├── Validações de campos
└── Email duplicado

✅ Autenticação e Login
├── Login válido (admin)
├── Fluxo login/logout
├── Credenciais inválidas
├── Campos obrigatórios
└── Navegação entre páginas

✅ Gerenciamento de Produtos
├── Cadastro de produto
├── Visualização e pesquisa
├── Carrinho de compras
├── Controle de acesso
└── Listagem de produtos
```

### API (3 cenários)
```bash
✅ Gerenciamento de Usuários
├── CRUD completo
├── Validações de dados
├── Email duplicado
└── Busca por ID

✅ Autenticação
├── Login válido/inválido
├── Validação de token
├── Recursos protegidos
└── Persistência de sessão

✅ Gerenciamento de Produtos
├── CRUD completo
├── Validações de dados
├── Controle de acesso
└── Filtros e consultas
```

## 🔍 Análise de Resultados

### Durante a Execução
- **Verde:** Teste passou ✅
- **Vermelho:** Teste falhou ❌
- **Amarelo:** Teste foi ignorado ⚠️

### Após a Execução

#### Vídeos
- Local: `cypress/videos/`
- Gravação completa de cada teste

#### Screenshots
- Local: `cypress/screenshots/`
- Capturas em caso de falha

#### Logs
- Console do terminal
- Detalhes de cada comando executado

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Erro de Instalação
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 2. Testes Falhando por Timeout
```bash
# Verificar conectividade
curl -I https://front.serverest.dev
curl -I https://serverest.dev
```

#### 3. Problemas de Permissão
```bash
# No Linux/Mac
sudo npm install -g cypress
```

#### 4. Browser não Encontrado
```bash
# Instalar browsers suportados
npx cypress install
```

### Configurações de Debug

#### Verbose Output
```bash
DEBUG=cypress:* npm test
```

#### Modo de Debug no Código
```javascript
cy.debug()        // Pausa execução
cy.pause()        // Pausa interativa
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

Criar arquivo `cypress.env.json`:
```json
{
  "baseUrl": "https://front.serverest.dev",
  "apiUrl": "https://serverest.dev",
  "defaultCommandTimeout": 10000
}
```

### Executar Testes Específicos

#### Por Arquivo
```bash
npx cypress run --spec "cypress/e2e/frontend/01-user-registration.cy.js"
```

#### Por Padrão
```bash
npx cypress run --spec "cypress/e2e/api/**/*"
```

#### Por Tag
```bash
npx cypress run --env grep="@smoke"
```

### Configurações de Browser

#### Chrome com Opções
```bash
npx cypress run --browser chrome --config viewportWidth=1920,viewportHeight=1080
```

#### Firefox
```bash
npx cypress run --browser firefox
```

#### Electron (Padrão)
```bash
npx cypress run --browser electron
```

## 📈 Monitoramento

### Métricas de Execução

#### Tempo Esperado
- **Frontend:** ~3-5 minutos
- **API:** ~2-3 minutos
- **Total:** ~5-8 minutos

#### Taxa de Sucesso Esperada
- **Desenvolvimento:** > 90%
- **CI/CD:** > 95%
- **Produção:** > 98%

### Alertas de Falha

#### Causas Comuns
1. **Instabilidade da rede**
2. **Mudanças na aplicação**
3. **Dados de teste conflitantes**
4. **Timeout de elementos**

#### Soluções
1. **Re-executar teste**
2. **Verificar logs detalhados**
3. **Analisar screenshots**
4. **Ajustar seletores se necessário**

## 🚦 CI/CD

### GitHub Actions

O projeto inclui workflow automático que executa:
- Testes em paralelo
- Upload de evidências
- Notificações de status

#### Trigger Manual
```bash
# No GitHub, acessar Actions > Workflow > Run workflow
```

#### Monitorar Execução
- Acessar aba "Actions" no GitHub
- Visualizar logs em tempo real
- Download de artefatos (videos/screenshots)

## 📞 Suporte

### Logs Úteis

#### Habilitar Debug
```bash
export DEBUG=cypress:*
npm test
```

#### Salvar Logs
```bash
npm test > teste-logs.txt 2>&1
```

### Informações para Suporte

Ao reportar problemas, incluir:
1. **Versão do Node.js:** `node --version`
2. **Sistema operacional**
3. **Comando executado**
4. **Logs de erro completos**
5. **Screenshots da falha**

---

**Para dúvidas específicas, consulte o README.md ou abra uma issue no repositório**
