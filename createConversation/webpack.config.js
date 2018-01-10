var slsw          = require('serverless-webpack');
var nodeExternals = require('webpack-node-externals');
var path          = require('path');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        plugins: [
          require.resolve("babel-plugin-source-map-support"), 
          require.resolve("babel-plugin-transform-runtime")
        ],
        presets: [
          require.resolve("babel-preset-es2015"), 
          require.resolve("babel-preset-stage-3")
        ]
      },
      include: [__dirname,path.join(__dirname, '../shared')],
      exclude: /node_modules/,
    }]
  }
};
