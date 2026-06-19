import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lyacloud.gitlawb.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
})
