const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpckPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin }= require('clean-webpack-plugin');
const glob = require('glob');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


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
                    chuncks: ['vendors', pageName],
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
    mode: 'none', // "production",
    entry: entry,
    output: {
        filename: '[name]_[chunkhash:8].js',
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
                    // 'style-loader', 将css提取到单独的文件就不能使用 style-loader
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    browsers: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75, // 1rem=75px 对应750的设计稿较好
                            remPrecision: 8 // px 转换为 rem 时小数点保留位数
                        }
                    }
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
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        // css压缩 需要单独引入 cssnano
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin()
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://unpkg.com/react@16/umd/react.production.min.js',
        //             global: 'React'
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
        //             global: 'ReactDOM'
        //         }
        //     ]
        // })
    ].concat(htmlWebpckPlugins),
    stats: 'errors-only',
    optimization: {
        splitChunks: {
            // minSize: 0, // 提取公共文件的最小大小 单位 字节
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                }
                // commons: {
                //     name: 'commons',
                //     chunks: 'all',
                //     minChunks: 2 // 提取公共文件最小引用次数
                // }
            }
        }
    }
}