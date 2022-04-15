const fs = {}
module.exports = new Proxy(fs, {
    get(_t, p) {
        if (!fs[p]) {
            // eslint-disable-next-line no-console -- demo
            console.log(p)
        }
        return fs[p]
    },
})
