const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/App.jsx",
    output: {
        path: "dist",
        filename: "[name]@[chunkhash].js",
        publicPath: "/",
    },
    devServer: {
        port: 9000,
        constentBase: "./dist",
        hot: true,
        host: "0.0.0.0",
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "localhost://10000",
                changeOrigin: true,
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js|x$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(le|c)ss$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8912,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            inject: "body",
            hash: true,
            scriptLoading: "defer",
            minify: true,
        }),
        new webpack.DefinePlugin({
            "process.env": `${JSON.stringify(ENV)}`,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        extensions: [".jsx", ".js", ".less", ".css"],
    },
};
