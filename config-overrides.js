const path = require('path')

module.exports = function override(config) {
  const loaders = config.resolve

  loaders.alias = {
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@apis': path.resolve(__dirname, 'src/apis'),
    '@store': path.resolve(__dirname, 'src/store'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@models': path.resolve(__dirname, 'src/models'),
    '@layout': path.resolve(__dirname, 'src/layout'),
  }
  loaders.modules = [path.resolve(__dirname, 'src/assets'), 'node_modules']

  return config
}
