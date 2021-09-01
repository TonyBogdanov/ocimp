const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = {

    devtool: false,
    entry: './web/index.js',

    output: { path: path.resolve( __dirname, 'dist' ), publicPath: '/', filename: '[name].js' },
    plugins: [ new HtmlWebpackPlugin( { template: './web/index.html' } ) ],

    module: { rules: [ {

        test: /worker\.js$/,
        use: { loader: 'worker-loader' },

    }, {

        test: /\.js$/,
        use: {

            loader: 'babel-loader',
            options: {

                presets: [ '@babel/preset-env' ],
                plugins: [ '@babel/plugin-transform-runtime' ],

            },

        },

    } ] },

    devServer: {

        host: 'upmaas.maga.re',
        allowedHosts: [ 'upmaas.maga.re' ],

        port: 9000,
        headers: { 'Access-Control-Allow-Origin': '*' },

        hot: false,
        liveReload: true,

        compress: true,
        static: {

            directory: path.resolve( __dirname, 'static' ),

        },

        historyApiFallback: true,
        https: false,

    },

};