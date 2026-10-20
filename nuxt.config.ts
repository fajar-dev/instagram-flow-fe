// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    'nuxt-vue3-google-signin',
    '@vite-pwa/nuxt'
  ],
  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    componentName: 'ColorScheme',
    classSuffix: ''
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL || 'http://localhost:4000/api'
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'id', name: 'Bahasa Indonesia', file: 'id.json' }
    ],
    defaultLocale: 'id',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'id'
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: undefined
    },
    manifest: {
      name: 'IG Flow',
      short_name: 'Instagram Flow',
      description: 'Instagram Flow - Asset Monitoring Teknologi Indonesia',
      lang: 'en',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#2D4E6F',
      icons: [
        {
          src: '/icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/icons/icon_144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon_384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/icons/icon_512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
})
