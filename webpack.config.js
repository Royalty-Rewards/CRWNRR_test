const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/components/app.js',
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'app/js'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    // new CopyWebpackPlugin([
    //   { from: './app/index.html', to: "index.html" }
    // ])
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015"],
          plugins: ['transform-runtime']
        }
      },
      {
          test: /\.(html)$/,
          loader: 'html-loader'
      },
      {
          test: /\.css$/,
          use: [
          "style-loader",
           "css-loader"
          ]
      },
      {
          test: /\.(eot|ttf|wav|mp3)$/,
          loader: 'file-loader',
      },
      {
          test: /\.(woff2?|ttf|eot|svg|phtml)(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader?name=fonts/[name].[ext]"
      },
      {
          test: /.*\.(gif|png|jpe?g|svg)$/i,
          loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack-loader?bypassOnDebug&optimizationLevel=5']
      },
    ]
  }
}
