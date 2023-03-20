export default (function () {
    let copy = (from, to) => {
        Object.keys(from).forEach((k) => {
            to[k] = from[k];
        });
    }
    /**
     * Remove specified target
     * @param {Any} item
     */
    Array.prototype.remove = function (item) {
        let index = this.findIndex((x) => Object.is(x, item));
        return index >= 0 ? this.splice(index, 1)[0] : false;
    };
    Object.defineProperty(Object.prototype, 'copy',
        {
            get: function () {
                let ret;
                if (this instanceof Array) {
                    ret = new Array();
                    this.forEach((x) => {
                        ret.push(x);
                    });
                } else if (this instanceof Map) {
                    ret = new Map();
                    let tmp = Object.fromEntries(this);
                    Object.keys(tmp).forEach(k => {
                        ret.set(k, tmp[k]);
                    })
                } else {
                    ret = new Object();
                    ret.__proto__ = this.__proto__;
                }
                copy(this, ret);
                return ret;
            },
            set: (_) => { }
        }
    )
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
