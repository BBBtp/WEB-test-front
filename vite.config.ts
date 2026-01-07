import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'
import { resolve } from 'path'

// Проверяем, находимся ли мы в Tauri проекте (есть папка src-tauri)
const isTauriProject = existsSync(resolve(__dirname, 'src-tauri'))

// https://vite.dev/config/
export default defineConfig({
  // Для Tauri (dev и production) не нужен base path, для web используем base path
  base: (process.env.TAURI_PLATFORM || process.env.TAURI_DEV || isTauriProject) ? '/' : '/WEB-test-front/',
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    // Для доступа с телефона через ZeroTier нужно слушать на всех интерфейсах
    host: '0.0.0.0', // Позволяет доступ с других устройств в сети
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    proxy: {
      '/api': {
        target: 'http://10.174.203.183:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 443,
    host: '0.0.0.0', // Для доступа с телефона через ZeroTier
    // HTTPS настройки (раскомментируйте если есть сертификаты)
    // https: {
    //   cert: './cert.pem',
    //   key: './key.pem',
    // },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
