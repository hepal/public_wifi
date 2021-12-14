const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

// https://cesium.com/docs/tutorials/cesium-and-webpack/
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

// 배포시 devServer에 넣을것
// watchOptions: {
//   ignored: [/public/],
// }
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: 'http://210.90.145.70:12000',
    
  },
  configureWebpack: {

    plugins: [
      new CopyPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' } ]),
      new CopyPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets' } ]),
      new CopyPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' } ]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
      })
    ],

  }
}