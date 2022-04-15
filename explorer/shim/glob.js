const glob = {}
module.exports = new Proxy(glob, {
    get(_t, p) {
        if (!glob[p]) {
            // eslint-disable-next-line no-console -- demo
            console.log(p)
        }
        return glob[p]
    },
})
