const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function tryResolve_(url, sourceFilename) {
    // Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
    // when the importer throws
    try {
        return require.resolve(url, { paths: [path.dirname(sourceFilename)] });
    } catch (e) {
        return '';
    }
}

function tryResolveScss(url, sourceFilename) {
    // Support omission of .scss and leading _
    const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
    return tryResolve_(normalizedUrl, sourceFilename) ||
        tryResolve_(path.join(path.dirname(normalizedUrl), `_${path.basename(normalizedUrl)}`),
            sourceFilename);
}

function materialImporter(url, prev) {
    if (url.startsWith('@material')) {
        const resolved = tryResolveScss(url, prev);
        return { file: resolved || url };
    }
    return { file: url };
}

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.tsx',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: "css-loader" },
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
                                //importer: materialImporter
                                includePaths: ['./node_modules']
                            }
                        }
                    ]
                })
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', 'jsx', '.js', 'json']
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'src/assets/index.html'
        })
    ]
}