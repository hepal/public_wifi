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
    disableHostCheck: true,
    host: '192.168.0.5',          //local ip
        port: 8080,        
        historyApiFallback: true,
        inline: true,
    proxy : {
      '/Sensor' : {
        target: 'http://210.90.145.70:12000',
        changeOrigin: true,        
      }, 
      '/req' : {
        target: 'http://api.vworld.kr',
        secure: false,
        changeOrigin: true,        
        pathRewrite: { '^/req': '' },
      },    
    }    
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