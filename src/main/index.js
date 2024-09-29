import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// require('dotenv').config()
process.env.platform = process.env.platform || 'lite'
console.log('lite', process.env.platform)
function createServer() {
  require(resolve(__dirname, '../../src/server/app'))
}
createServer()

function createWindow() {
  // Create the browser window.
  console.log('port', process.env.PORT)
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
      preload: resolve(__dirname, '../preload/index.js'),
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
    mainWindow.loadFile(resolve(__dirname, '../renderer/index.html'))
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
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})
