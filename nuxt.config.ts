import { cp } from 'node:fs/promises';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  devServer: {
    port: 3002,
  },

  // SPA for now. The API is cookie-authenticated, so SSR can be enabled later.
  ssr: false,

  modules: ['@pinia/nuxt', 'nuxt-auth-utils', '@nuxt/icon', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Zeithub',
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { class: 'bg-gray-200' },
      link: [{ rel: 'icon', href: '/favicon.ico' }],
      meta: [{ name: 'theme-color', content: '#26af5f' }],
    },
  },

  runtimeConfig: {
    session: {
      // 7 days
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        sameSite: 'lax',
        // Override with NUXT_SESSION_COOKIE_SECURE=false only when serving
        // over plain HTTP on something other than localhost.
        secure: true,
      },
    },
  },

  icon: {
    // Bundle only the icons we use; no runtime requests to the Iconify API.
    clientBundle: { scan: true },
    serverBundle: 'local',
  },

  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle up front so the dev server doesn't reload mid-session when
    // a page first imports one of these.
    optimizeDeps: {
      include: ['luxon', 'slugify', 'vue-imask', 'zod'],
    },
  },

  nitro: {
    hooks: {
      // Ship the SQL migrations next to the server bundle so the built app
      // can migrate itself on startup (see server/plugins/migrate.ts).
      async compiled(nitro) {
        await cp(
          'server/db/migrations',
          `${nitro.options.output.serverDir}/migrations`,
          { recursive: true }
        );
      },
    },
  },

  eslint: {
    config: { stylistic: false },
  },

  typescript: {
    // Type-check the import script and the tests with `npm run typecheck`.
    nodeTsConfig: {
      include: ['../scripts/**/*', '../test/**/*'],
    },
  },
});
