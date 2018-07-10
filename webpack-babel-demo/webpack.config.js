var uglify = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'development',

  entry: {
    // demo: './src/demo.js',
    index: './src/index.js'
  },

  output: {
    path: __dirname + '/out/',
    filename: '[name].bundle.js',
    publicPath: '/out/'
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
      { test: /.css$/, use: ['style-loader', 'css-loader'] },
      { test: /.jpg|.png$/, use: ['url-loader?limit=10&name=[name].[ext]'] }
    ]
  },

  plugins: [
    // new uglify()
  ]
}