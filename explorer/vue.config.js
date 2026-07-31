"use strict";

const webpack = require("webpack");
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
					stylus: require.resolve("../node_modules/stylus/lib/stylus"),
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
				// Strip the `node:` scheme so the aliases above also apply to
				// `node:module`, `node:path`, etc.
				new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
					resource.request = resource.request.replace(/^node:/, "");
				}),
				new webpack.DefinePlugin({
					"process.version": JSON.stringify(process.version),
					// process: JSON.stringify(process),
				}),
			],
		};
	},
};
