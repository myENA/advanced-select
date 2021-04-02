const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');

module.exports = {
  css: {
    loaderOptions: {
      css: {
        // localIdentName: `${pkg.libname}[name]_[local]_[hash:base64:5]`,
      },
    },
  },
  lintOnSave: false,
  configureWebpack: () => {
    const customConfig = {
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jquery: 'jquery',
          jQuery: 'jquery',
          'window.jquery': 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery',
        }),
        new webpack.DefinePlugin({
          LIBNAME: JSON.stringify(pkg.libname),
        }),
      ],
    };
    // config for lib
    if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
      // set external modules so they won't get bundled with the lib
      customConfig.externals = [
        'bootbox',
        'bootstrap',
        'font-awesome',
        'jquery',
        'vue',
      ];
    }

    // config parameter can be mutated
    // or a new object (to be used with webpack-merge) returned
    return customConfig;
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'test') {
      config.module
        .rule('istanbul')
        .test(/\.(js|vue)$/)
        .enforce('post')
        .include
        .add(path.resolve(__dirname, '/src'))
        .end()
        .use('istanbul-instrumenter-loader')
        .loader('istanbul-instrumenter-loader')
        .options({ esModules: true })
        .end();
    }
  },
};
