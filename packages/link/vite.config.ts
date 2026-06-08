import { defineConfig } from 'vite'

// Two outputs: the host-side loader (IIFE, single file) and the iframe app (index.html).
// NOTE: the loader's global name is a THROWAWAY ('__HedgeLink') on purpose — loader.ts already
// registers `window.Hedge = { create }` as a side-effect, and we must NOT let Vite's lib wrapper
// overwrite window.Hedge with the module's raw exports (which would expose `createLink`, not `create`).
export default defineConfig(({ mode }) => {
  if (mode === 'loader') {
    return {
      build: {
        outDir: 'dist/loader',
        lib: { entry: 'src/loader.ts', name: '__HedgeLink', formats: ['iife'], fileName: () => 'link.js' },
      },
      esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
    }
  }
  return {
    build: { outDir: 'dist/app' },
    esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
  }
})
