import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultCommandTimeout: 10000

  },

  env: {
    BASE_URL: 'http://localhost:5173/'
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
