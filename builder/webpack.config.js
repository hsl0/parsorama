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
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-typescript"
                        ],
                        plugins: [
                            ["babel-plugin-replace-import-extension", {
                                extMapping: {
                                    ".ts": ".js"
                                }
                            }]
                        ]
                    }
                }
            },
            {
                enforce: "pre",
                test: /\.m?js$/,
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