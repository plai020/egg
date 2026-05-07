import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
// 這裡的 'egg-price-tracker' 請改成你 GitHub 儲存庫（Repository）的名稱
  base: '/egg/', 
})