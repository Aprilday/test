const path = require('path');
const webpack = require('webpack');
const HtmlWebpckPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// 动态设置多页面打包的 entry 和 插件 HtmlWebpckPlugin
const setMPA = () => {
    const entry = {};
    const htmlWebpckPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

    Object.keys(entryFiles)
        .map(index => {
            const entryFile = entryFiles[index];
            const pageName = entryFile.match(/src\/(.*)\/index\.js/)[1];

            entry[pageName] = entryFile;
            htmlWebpckPlugins.push(
                new HtmlWebpckPlugin({
                    template: path.join(__dirname, `./src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chuncks: [pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                })
            )
        })

    return {
        entry,
        htmlWebpckPlugins
    }
}

const { entry, htmlWebpckPlugins } = setMPA();

module.exports = {
    mode: "development", // "production",
    entry: entry,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /.(jpg|png|gif|jpeg|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240 // 10K
                        } 
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ].concat(htmlWebpckPlugins),
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'errors-only'
    },
    devtool: 'source-map'
}