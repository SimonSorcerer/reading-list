const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: {
            background: './src/background/index.ts',
            sidepanel: './src/sidepanel/index.tsx',
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].bundle.js',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname, '../postcss.config.js'),
                                },
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, '../src'),
                '@shared': path.resolve(__dirname, '../src/shared'),
                '@background': path.resolve(__dirname, '../src/background'),
                '@sidepanel': path.resolve(__dirname, '../src/sidepanel'),
            },
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new HtmlWebpackPlugin({
                template: './src/sidepanel/index.html',
                filename: 'sidepanel.html',
                chunks: ['sidepanel'],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'public',
                        to: '.',
                    },
                ],
            }),
        ],
        devtool: isProduction ? false : 'cheap-module-source-map',
        optimization: {
            minimize: isProduction,
        },
    };
};
