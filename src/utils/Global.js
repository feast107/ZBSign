export default (function () {
    /**
     * Remove specified target
     * @param {Any} item
     */
    Array.prototype.remove = function (item) {
        let index = this.findIndex((x) => x == item);
        return index >= 0 ? this.splice(index, 1)[0] : false;
    };
    /**
     *
     * @param {Any} target
     * @param {Class|undefined} any
     * @returns
     */
    Object.copy = function (target, any = null) {
        if (!target) return;
        let ret;
        if (any) {
            switch (typeof any) {
                case "function":
                    try {
                        ret = any();
                    } catch {
                        ret = new any();
                    }
                    break;
                default:
                    ret = any;
            }
        } else {
            ret = {};
        }
        if (target instanceof Array) {
            let ret = [];
            target.forEach((x) => {
                ret.push(x);
            });
            return ret;
        } else {
            Object.keys(target).forEach((k) => {
                ret[k] = target[k];
            });
            return ret;
        }
    };
    Date.prototype.timeStamp = function () {
        return this - new Date(1970, 1, 1);
    };
})();
