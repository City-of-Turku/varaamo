const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    env: {
      TZ: 'Europe/Helsinki'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
