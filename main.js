import { app, BrowserWindow, shell, nativeImage } from 'electron'
import { autoUpdater } from 'electron-updater'
import electronLog from 'electron-log'
import path from 'path'
import Jimp from 'jimp'

import { setApplicationMenu } from './menu'

electronLog.transports.file.level = 'info'
autoUpdater.logger = electronLog
autoUpdater.checkForUpdatesAndNotify()
setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify()
}, 3600000) // check for updates every hour

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    title: 'WeGlipChat'
  })
  mainWindow.loadURL('https://tylerlong.github.io/wgc')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', async function (_, title) {
    const match = title.match(/\((\d+\+?)\) WeGlipChat/)
    if (match !== null) {
      switch (process.platform) {
        case 'darwin':
          app.dock.setBadge(match[1])
          break
        case 'win32':
          const jimp = await Jimp.read(path.join(__dirname, '..', 'red-dot.png'))
          const buffer = await jimp.getBufferAsync(Jimp.MIME_PNG)
          mainWindow.setOverlayIcon(nativeImage.createFromBuffer(buffer), `${match[1]} unread messages`)
          break
        default:
          break
      }
    } else {
      switch (process.platform) {
        case 'darwin':
          app.dock.setBadge('')
          break
        case 'win32':
          mainWindow.setOverlayIcon(null, '')
          break
        default:
          break
      }
    }
  })
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url) // new window in user's default browser
  })
}

app.on('ready', () => {
  setApplicationMenu()
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
