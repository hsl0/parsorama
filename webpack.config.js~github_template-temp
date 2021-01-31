const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const config = {
    entry: './src/parsorama.ts',
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: 'parsorama.js'
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
    devtool: 'inline-source-map'
};

module.exports = config;