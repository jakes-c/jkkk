const path = require('path');

module.exports = {
  mode: 'development',
  entry: './lib/game.js',
  output: {
    path: path.resolve(__dirname, 'assets/javascripts'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '*']
  }
};