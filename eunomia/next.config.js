const webpack = require("webpack");
const withCSS = require('@zeit/next-css');
require("dotenv").config();
module.exports = withCSS({
  webpack: config => {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});
    config.plugins.push(new webpack.DefinePlugin(env));
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: true,
          name: '[name].[ext]'
        }
      }
    });
    return config;
  }
});
