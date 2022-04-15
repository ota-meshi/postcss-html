const fs = {}
module.exports = new Proxy(fs, {
    get(_t, p) {
        if (!fs[p]) {
            console.log(p)
        }
        return fs[p]
    },
})
