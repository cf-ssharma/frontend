import NyanProgressPlugin from 'nyan-progress-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const DEBUG = !process.argv.includes('--release');
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

const CSS_LOADER = DEBUG ? 'css' : 'css?minimize';
const CSS_LOADER_PARAMS = `modules&localIdentName=${DEBUG ? '[dir]--[local]--[sourceHash:5]' : '[sourceHash]&minimize'}`;
const SASS_LOADER = 'sass?sourceMap&' + [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, 'node_modules', 'bourbon', 'app', 'assets', 'stylesheets'),
  path.join(__dirname, 'node_modules', 'bourbon-neat', 'app', 'assets', 'stylesheets')
].map(p => 'includePaths[]=' + p).join('&');

// Common configuration for both client-side and server-side bundles
const config = {
  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin(DEBUG ? 'styles.css' : 'styles.[contenthash].css'),
    new NyanProgressPlugin()
  ].concat(DEBUG ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]),

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],

    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel?cacheDirectory'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/,
      loader: 'url?limit=10000!img'
    }]
  }
};

// Configuration for the client-side bundle (app.js)
const appConfig = Object.assign({}, config, {
  entry: './src/client.js',

  output: {
    path: './dist/public',
    filename: DEBUG ? 'bundle.js' : 'bundle.[hash].js'
  },

  devtool: DEBUG ? 'source-map' : false,
  plugins: config.plugins.concat(
    new AssetsPlugin({ path: path.join(__dirname, 'dist') })
    // Disabled until it's compatible with React 0.13.3 zilverline/react-tap-event-plugin/issues/22
    //new webpack.BannerPlugin('require("react-tap-event-plugin")();', { raw: true, entryOnly: false })
  ),

  module: Object.assign({}, config.module, {
    loaders: config.module.loaders.concat([{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', CSS_LOADER)
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', `css?${CSS_LOADER_PARAMS}&sourceMap!autoprefixer!${SASS_LOADER}`)
    }])
  })
});

// Configuration for the server-side bundle (server.js)
const serverConfig = Object.assign({}, config, {
  entry: './src/server.js',

  output: {
    path: './dist',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  target: 'node',
  externals: /^[a-z0-9\-]+$/,
  devtool: 'source-map',

  plugins: config.plugins.concat(
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false })
  ),

  module: Object.assign({}, config.module, {
    loaders: config.module.loaders.concat([{
      test: /\.css$/,
      loader: CSS_LOADER
    }, {
      test: /\.scss$/,
      loader: `css/locals?${CSS_LOADER_PARAMS}!autoprefixer!${SASS_LOADER}`
    }, {
      test: /\.hbs$/,
      loader: 'handlebars'
    }])
  })
});

export default {
  appConfig,
  serverConfig
};
