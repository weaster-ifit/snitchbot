const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const package = require('./package.json');

module.exports = (env) => {
  return {
    entry: {
      bulk: './src/bulk.ts',
      base: './src/base.js',
      example: './src/example.js'
    },
    module: {
      rules: [
        {
          use: [{
            loader: 'ts-loader',
            options: {
              configFile: env.PRODUCTION === true
                ? 'tsconfig.json'
                : 'tsconfig.dev.json'
            }
          }],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        __MAIN_STYLE__: `\`${fs.readFileSync(path.resolve(__dirname, 'src/style/main.css').replace(/\n/g, ''), 'utf8')}\``,
        __PACKAGE_NAME__: `"${package.name}"`,
        __PACKAGE_VERSION__: `"${package.version}"`,
        __IS_PRODUCTION_BUILD__: `${env.PRODUCTION === true}`
      })
    ]
  }
}