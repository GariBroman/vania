// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Interactive Greeting Card',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'color-scheme', content: 'light dark' },
      ],
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  },
  vite: {
    optimizeDeps: {
      include: ['@twa-dev/sdk']
    }
  },
  nitro: {
    preset: 'vercel-edge'
  }
}) 