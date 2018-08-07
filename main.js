import { app, BrowserWindow, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import electronLog from 'electron-log'
import BadgeIcon from 'badge-icon'

import { setApplicationMenu } from './menu'

electronLog.transports.file.level = 'info'
autoUpdater.logger = electronLog
autoUpdater.checkForUpdatesAndNotify()
setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify()
}, 3600000) // check for updates every hour

let mainWindow
let invisibleWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    title: 'WeGlipChat'
  })
  if (process.platform === 'win32') {
    invisibleWindow = new BrowserWindow({
      width: 512,
      height: 512,
      show: false
    })
  }
  mainWindow.loadURL('https://tylerlong.github.io/wgc')
  mainWindow.on('closed', function () {
    mainWindow = null
    if (process.platform === 'win32') {
      invisibleWindow.close()
      invisibleWindow = null
    }
  })
  mainWindow.on('page-title-updated', function (_, title) {
    const match = title.match(/\((\d+\+?)\) WeGlipChat/)
    if (match !== null) {
      switch (process.platform) {
        case 'darwin':
          app.dock.setBadge(match[1])
          break
        case 'win32':
          const badgeIcon = new BadgeIcon({
            badgeWidth: 128, // badge width
            badgeHeight: 128, // badge height
            text: '8', // badge text
            fontSize: 96, // font size
            color: 'white', // text color
            bgColor: 'red' // background color
          })
          invisibleWindow.loadURL(`data:image/svg+xml;charset=UTF-8,${encodeURI(badgeIcon.svg())}`)
          invisibleWindow.capturePage(image => {
            mainWindow.setOverlayIcon(image, `${match[1]} unread messages`)
          })
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
