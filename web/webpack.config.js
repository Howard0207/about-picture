const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ENV = process.env.NODE_ENV;

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./App.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]@[hash].js",
        publicPath: "/",
    },
    devServer: {
        contentBase: "./dist",
        port: 9000,
        hot: true,
        host: "0.0.0.0",
        historyApiFallback: true,
        proxy: [
            {
                context: ["/account", "/upload", "/static", "/gallery", "/pictures", "/compress"],
                target: "http://localhost:10000",
                changeOrigin: true,
            },
        ],
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
                use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
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
        new CleanWebpackPlugin(),
        new AntdDayjsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            inject: "body",
            hash: true,
            scriptLoading: "defer",
            minify: true,
        }),
        new CopyPlugin({
            patterns: [{ from: path.resolve(__dirname, "./public/worker.js"), to: "dist" }],
        }),
        new webpack.DefinePlugin({
            "process.env": `${JSON.stringify(ENV)}`,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        alias: {
            _components: path.resolve(__dirname, "./src/components"),
            _less: path.resolve(__dirname, "./src/less"),
            _const: path.resolve(__dirname, "./src/const"),
            _api: path.resolve(__dirname, "./src/api"),
            _static: path.resolve(__dirname, "./src/static"),
            _utils: path.resolve(__dirname, "./src/utils"),
        },
        extensions: [".jsx", ".js", ".less", ".css"],
    },
};
