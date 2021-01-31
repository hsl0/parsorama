const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const config = {
    entry: './src/web.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'web.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'ts'],
        })
    ],
    devtool: 'source-map'
};

module.exports = config;