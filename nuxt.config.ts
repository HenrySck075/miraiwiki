// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
  ],
  experimental: {
    asyncContext: true
  },
  /*
  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'optimus_prime' }
      },
    }
  },
  */
  css: ["~/assets/css/main.css"]
})
