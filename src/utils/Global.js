export default (function () {
    /**
     * Remove specified target
     * @param {Any} item
     */
    Array.prototype.remove = function (item, predicate = null) {
        if (!predicate || typeof (predicate) != "function") { predicate = (x) => x == item; }
        let index = this.findIndex((x) => predicate(x));
        return index >= 0 ? this.splice(index, 1)[0] : false;
    };
    /**
     *
     * @param {Any} from
     * @param {Class|undefined} type
     * @returns
     */
    Object.copy = function (from) {
        if (!from || typeof (from) != 'object') return;
        let ret;
        if (from instanceof Array) {
            ret = [];
            from.forEach((x) => {
                ret.push(x);
            });
            return ret;
        } else {
            try {
                ret = new from.__proto__.constructor();
            } catch { ret = {} }
            Object.keys(from).forEach((k) => {
                ret[k] = from[k];
            });
            return ret;
        }
    };
    Date.prototype.timeStamp = function () {
        return this - new Date(1970);
    };
    Promise.prototype.result = async function () {
        try {
            let ret = await this;
            if (ret.status == 200) {
                ret = ret.data;
                let getter = {
                    get: function () {
                        return this.code == 1;
                    }
                };
                Object.defineProperty(ret, "Success", getter)
                Object.defineProperty(ret, "success", getter)
            }
            return ret;
        } catch (e) {
            return {
                get Success() { return false; },
                code: 0,
                msg: e,
                data: null,
            }
        }
    }
})();
