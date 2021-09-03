const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = {

    devtool: false,
    entry: [ 'core-js/stable', './web/index.js' ],

    output: { path: path.resolve( __dirname, 'dist' ), publicPath: '/', filename: '[name].js' },
    plugins: [

        new HtmlWebpackPlugin( { template: './web/index.html' } ),
        new webpack.ProvidePlugin( { Buffer: [ 'buffer', 'Buffer' ], process: 'process/browser' } ),

    ],

    module: { rules: [ {

        test: /worker\.js$/,
        use: { loader: 'worker-loader' },

    }, {

        test: /\.js$/,
        use: {

            loader: 'babel-loader',
            options: {

                presets: [ '@babel/preset-env' ],
                plugins: [ '@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs' ],

            },

        },

    } ] },

    devServer: {

        host: 'localhost',
        allowedHosts: [ 'localhost' ],

        port: 9090,
        headers: { 'Access-Control-Allow-Origin': '*' },

        hot: false,
        liveReload: true,

        compress: true,
        static: { directory: path.resolve( __dirname, 'static' ) },

        historyApiFallback: true,
        https: false,

    },

};
