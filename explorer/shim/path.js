const path = {
	sep: "/",
	join(...args) {
		return args.join("/");
	},
};

export default new Proxy(path, {
	get(_t, p) {
		if (!path[p]) {
			console.log(p);
		}
		return path[p];
	},
});
