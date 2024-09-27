import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const { spawn } = require('child_process')

function createServer() {
  const expressServer = spawn('node', [join(__dirname, '../../src/server/app.js')], {
    stdio: 'inherit'
  })
  // expressServer.stdout.on('data', (data) => {
  //   console.log(`Node server output: ${data}`)
  // })

  // expressServer.stderr.on('data', (data) => {
  //   console.error(`Node server error: ${data}`)
  // })
  return expressServer
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: 50,
    y: 50,
    width: 1000,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  ipcMain.on('window-handler', (event, data) => {
    if (data === 'close') mainWindow.close()
    if (data === 'minimize') mainWindow.minimize()
    if (data === 'maximize') mainWindow.maximize()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.aosika.kugoumusic')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  createWindow()
  const server = createServer()
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      server.kill()
      app.quit()
    }
  })
})
