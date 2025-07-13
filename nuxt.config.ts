// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
  ],
  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'headers' }
      },
    }
  },
  /*
  routeRules: {
    "/**": {
      cache: {
        maxAge: 60*60,
        swr: true
      }
    }
  },
  */
  css: ["~/assets/css/main.css"]
})
