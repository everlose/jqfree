// webpack.config.js
module.exports = {
    entry: './src/main.js',
    output: {
        filename: './dist/bundle.js'
    },
    devServer: {
        contentBase: "./demo",
        colors: true,
        historyApiFallback: true,
        inline: true,
        port: '8088'
    }
};
