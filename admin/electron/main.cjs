const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const { simpleGit } = require('simple-git')

const isDev = !app.isPackaged
const repoRoot = path.resolve(__dirname, '../..')
const contentDir = path.join(repoRoot, 'content')
const imagesDir = path.join(contentDir, 'images')

function ensureDirs() {
  fs.mkdirSync(imagesDir, { recursive: true })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    title: 'Portfolio Admin',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5174')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

function readJson(fileName) {
  const filePath = path.join(contentDir, fileName)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(fileName, data) {
  const filePath = path.join(contentDir, fileName)
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

ipcMain.handle('content:getAll', async () => {
  ensureDirs()
  return {
    profile: readJson('profile.json'),
    projects: readJson('projects.json'),
    skills: readJson('skills.json'),
  }
})

ipcMain.handle('content:saveProfile', async (_event, profile) => {
  writeJson('profile.json', profile)
  return { ok: true }
})

ipcMain.handle('content:saveProjects', async (_event, projects) => {
  writeJson('projects.json', projects)
  return { ok: true }
})

ipcMain.handle('content:saveSkills', async (_event, skills) => {
  writeJson('skills.json', skills)
  return { ok: true }
})

ipcMain.handle('content:uploadImage', async (_event, { suggestedName } = {}) => {
  ensureDirs()
  const result = await dialog.showOpenDialog({
    title: 'Elegir imagen',
    properties: ['openFile'],
    filters: [{ name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'] }],
  })

  if (result.canceled || !result.filePaths.length) {
    return { ok: false, canceled: true }
  }

  const source = result.filePaths[0]
  const ext = path.extname(source).toLowerCase() || '.png'
  const base =
    (suggestedName || path.basename(source, path.extname(source)))
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `image-${Date.now()}`

  const fileName = `${base}${ext}`
  const dest = path.join(imagesDir, fileName)
  fs.copyFileSync(source, dest)

  return { ok: true, relativePath: `images/${fileName}` }
})

ipcMain.handle('content:uploadCv', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Elegir CV (PDF)',
    properties: ['openFile'],
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })

  if (result.canceled || !result.filePaths.length) {
    return { ok: false, canceled: true }
  }

  const source = result.filePaths[0]
  const fileName = path.basename(source)
  const dest = path.join(contentDir, fileName)
  fs.copyFileSync(source, dest)

  return { ok: true, fileName }
})

ipcMain.handle('git:publish', async (_event, message) => {
  const git = simpleGit(repoRoot)
  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    throw new Error('Esta carpeta no es un repositorio git. Inicializalo y conectalo a GitHub.')
  }

  await git.add(['content'])
  const status = await git.status()
  if (status.staged.length === 0) {
    return { ok: true, empty: true, message: 'No hay cambios en content/ para publicar.' }
  }

  const commitMessage = message?.trim() || `content: update portfolio ${new Date().toISOString().slice(0, 10)}`
  await git.commit(commitMessage)
  await git.push()

  return { ok: true, empty: false, message: 'Publicado. Netlify va a redeployar en unos minutos.' }
})

ipcMain.handle('app:openWebDev', async () => {
  await shell.openExternal('http://localhost:5173')
  return { ok: true }
})

ipcMain.handle('app:openExternal', async (_event, url) => {
  if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
    await shell.openExternal(url)
    return { ok: true }
  }
  throw new Error('URL inválida')
})

ipcMain.handle('app:getPaths', async () => ({
  repoRoot,
  contentDir,
}))

app.whenReady().then(() => {
  ensureDirs()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
