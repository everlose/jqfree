// webpack.config.js
module.exports = {
    entry: './src/main.js',
    output: {
        filename: './dist/bundle.js'
    },
    devServer: {
        contentBase: "./test/",
        colors: true,
        historyApiFallback: true,
        inline: true,
        port: '8088',
        //自动打开浏览器
        open: {
            type: true
        }
    }
};
