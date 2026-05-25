import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import NuxtUI from '@nuxt/ui/vite'
import { resolve } from 'node:path'

export default defineConfig({
	base: '/ginko-payment-management/',
	plugins: [
		vue(),
		tailwindcss(),
		NuxtUI({
			autoImport: false,
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
})
