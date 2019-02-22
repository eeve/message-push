/**
 * Created by Ajian on 16/6/2.
 */
var env = env || (process.env.NODE_ENV || 'development');
console.log('======= 现在环境:',JSON.stringify(env || 'true'),' =======');
var debug = env==='development';

var webpack = require('webpack');
var plugins = [
    new webpack.DefinePlugin({
        __DEV__: debug
    }),
    new webpack.BannerPlugin('This file is created by eeve.'),
    new webpack.NoErrorsPlugin()
].concat(debug ? [] : [
    new webpack.optimize.UglifyJsPlugin({
        test: /(\.js)$/,
        compress: {
            warnings: false
        },
        // mangle: false
    })
]);

module.exports = {
    entry: {
        'client': './src/client.js',
        'console': './src/console.js'
    },
    output: {
        filename: './dist/[name].bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ["node_modules"]
    }
};