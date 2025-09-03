const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    
    // Timeouts otimizados para estabilidade
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    taskTimeout: 60000,
    
    // Retry strategy otimizada
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Configurações de performance
    numTestsKeptInMemory: 5,
    experimentalMemoryManagement: true,
    
    setupNodeEvents(on, config) {
      // Task para logs customizados
      on('task', {
        log(message) {
          console.log(`[CYPRESS LOG] ${new Date().toISOString()}: ${message}`)
          return null
        },
        
        // Task para cleanup avançado
        cleanupDatabase() {
          // Implementar limpeza de dados se necessário
          return null
        }
      })
      
      // Event listener para captura de erros não tratados
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage')
          launchOptions.args.push('--no-sandbox')
          launchOptions.args.push('--disable-gpu')
        }
        return launchOptions
      })
      
      // Configurações condicionais baseadas no ambiente
      if (config.env.CI) {
        config.video = true
        config.screenshotOnRunFailure = true
        config.retries.runMode = 3
      }
      
      return config
    },
    
    env: {
      apiUrl: 'https://serverest.dev',
      // Feature flags para testes condicionais
      enableAccessibilityTests: true,
      enablePerformanceTests: true,
      enableSecurityTests: true
    },
    
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    
    // Configurações de relatórios
    reporter: 'spec',
    reporterOptions: {
      verbose: true
    }
  },
  
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html',
    supportFile: 'cypress/support/component.js'
  },
})
