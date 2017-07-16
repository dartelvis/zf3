
var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'public/js');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
    entry: APP_DIR + '/app.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',

        // Utilizado pelo Hot Module Replacement
        publicPath: process.env.NODE_ENV === "development" ? 'http://localhost:8008/' : ''
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: [
                    APP_DIR,
                    path.resolve( __dirname, 'node_modules', 'react-tree-menu' )
                ],

                loader: 'babel-loader',
                query: {
                    presets: ['env', "latest", "react"]
                }
            }
        ]
    },
    devServer: {
	port: 8008,
        headers: { "Access-Control-Allow-Origin": "*" }
    }
};

module.exports = config;
