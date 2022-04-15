// eslint-disable-next-line node/no-extraneous-require -- ignore
const webpack = require("webpack")
module.exports = {
    publicPath: "/postcss-html/",

    configureWebpack(_config, _isServer) {
        return {
            resolve: {
                alias: {
                    module: require.resolve("./shim/module"),
                    path: require.resolve("./shim/path"),
                    fs: require.resolve("./shim/fs"),
                    glob: require.resolve("./shim/glob"),
                    stylus: require.resolve(
                        // eslint-disable-next-line node/no-unpublished-require -- ignore
                        "../node_modules/stylus/lib/stylus",
                    ),
                },
                fallback: {
                    util: false,
                    url: false,
                    crypto: false,
                    assert: false,
                    "postcss-sass": false,
                },
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.version": JSON.stringify(process.version),
                    // process: JSON.stringify(process),
                }),
            ],
        }
    },
}
