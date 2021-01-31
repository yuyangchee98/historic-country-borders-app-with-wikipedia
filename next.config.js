const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlTagsPlugin = require('html-webpack-tags-plugin');
const path = require('path');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    try {
      config.externals.cesium = 'Cesium';
    } catch {
      config.externals = {
        cesium: 'Cesium',
      };
    }

    config.node = {
      // Resolve node module use of fs
      fs: 'empty',
      Buffer: false,
      http: 'empty',
      https: 'empty',
      zlib: 'empty',
    };

    if (isServer) {
      config.plugins.push(
        new CopyPlugin([
          {
            from: path.join(
              __dirname,
              dev
                ? 'node_modules/cesium/Build/CesiumUnminified/'
                : 'node_modules/cesium/Build/Cesium/',
            ),
            to: path.join(__dirname, 'cesium'),
          },
        ]),
      );
    }

    config.plugins = [
      new HtmlPlugin(),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('cesium'),
      }),
      new HtmlTagsPlugin({
        append: false,
        tags: [
          ...['cesium/Widgets/widgets.css'],
          path.join('cesium', 'Cesium.js'),
        ],
      }),
      ...config.plugins,
    ];

    // Important: return the modified config
    return config;
  },
};
