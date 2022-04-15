const path = {
    sep: "/",
    join(...args) {
        return args.join("/")
    },
}
module.exports = new Proxy(path, {
    get(_t, p) {
        if (!path[p]) {
            // eslint-disable-next-line no-console -- demo
            console.log(p)
        }
        return path[p]
    },
})
