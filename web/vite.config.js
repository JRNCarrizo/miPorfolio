import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.resolve(__dirname, '../content')

function syncContentPlugin() {
  const sync = () => {
    const dest = path.resolve(__dirname, 'public/content')
    fs.cpSync(contentDir, dest, { recursive: true })
  }

  const isContentFile = (file) => {
    const normalizedFile = path.normalize(file)
    const normalizedRoot = path.normalize(contentDir)
    return normalizedFile === normalizedRoot || normalizedFile.startsWith(normalizedRoot + path.sep)
  }

  return {
    name: 'sync-content',
    buildStart() {
      sync()
    },
    configureServer(server) {
      sync()
      server.watcher.add(contentDir)

      const onContentChange = (file) => {
        if (!isContentFile(file)) return
        sync()
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('change', onContentChange)
      server.watcher.on('add', onContentChange)
      server.watcher.on('unlink', onContentChange)
    },
  }
}

export default defineConfig({
  plugins: [react(), syncContentPlugin()],
  resolve: {
    alias: {
      '@content': contentDir,
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
