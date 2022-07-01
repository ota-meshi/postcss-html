const glob = {};
module.exports = new Proxy(glob, {
	get(_t, p) {
		if (!glob[p]) {
			console.log(p);
		}
		return glob[p];
	},
});
