import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars from the project root AND the careerpilot_final directory.
  // envDir defaults to the vite root (careerpilot_final/), but we also
  // explicitly load from one level up so the root .env is picked up too.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    // Expose any VITE_* variable to import.meta.env in the browser.
    // Also manually bridge GEMINI_API_KEY → VITE_GEMINI_API_KEY in case
    // the user only has the unprefixed key in their .env.
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''
      ),
    },
  }
})
