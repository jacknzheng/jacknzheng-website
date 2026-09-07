import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        // Linked figures are static files, not pages to render as HTML.
        filter: ({ path }) => !path.startsWith('/images/'),
        autoSubfolderIndex: true,
        failOnError: true,
      },
    }),
    viteReact(),
  ],
})

export default config
