import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const dbUrl = env.Database_URL || env.DATABASE_URL || env.VITE_DATABASE_URL || ''

  return {
    plugins: [react()],
    server: {
      // Prevents directory traversal & serving files outside the project root
      fs: {
        strict: true,
      },
    },
    build: {
      // Prevents leaking original TypeScript source files (.ts, .tsx) in production
      sourcemap: false,
    },
    define: {
      'import.meta.env.VITE_DATABASE_URL': JSON.stringify(dbUrl),
      'process.env.DATABASE_URL': JSON.stringify(dbUrl),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react'],
    },
  }
})
