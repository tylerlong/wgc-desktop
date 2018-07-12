import { app, BrowserWindow } from 'electron'

let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadURL('https://tylerlong.github.io/wgc')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
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
