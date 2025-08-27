// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui', 
    '@nuxt/image', 
    ['nuxt-viewport', {
      defaultBreakpoints: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
      },
      defaultViewport: 'sm',
      throttle: 200
    }]
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