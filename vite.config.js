import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env

  return {
    // base: VITE_APP_ENV === 'prod' ? '/reactServer/' : '/reactServer/',
    base: VITE_APP_ENV === 'prod' ? '/reactServer/' : './',
    plugins: [
      react(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ``
        }
      }
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      port: 8090,
      host: true,
      open: true,
      proxy: {
        '/dev-api': {
          target: 'http://192.168.21.66:8080',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        }
      }
    },
  }
})
