import path from 'path'

const electronConfig = {
  target: 'electron-main',
  entry: {
    electron: ['babel-polyfill', './src/electron/index.js'],
    preload: ['babel-polyfill', './src/electron/preload.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'build')
  },
  node: {
    __dirname: false // https://github.com/webpack/webpack/issues/2010#issuecomment-181256611
  },
  devtool: 'source-map'
}

export default [electronConfig]
