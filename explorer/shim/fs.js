const fs = {};

export default new Proxy(fs, {
	get(_t, p) {
		if (!fs[p]) {
			console.log(p);
		}
		return fs[p];
	},
});
