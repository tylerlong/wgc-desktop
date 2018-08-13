import electron from 'electron'

process.once('loaded', () => {
  global.electron = electron.remote
})
