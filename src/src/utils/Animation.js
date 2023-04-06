export class Animation {
    /**
     * 获取特效
     * @param {string} purpose 出入
     * @param {string} feature 特效
     * @param {string} direction 方向
     * @returns
     */
    static get(purpose, feature, direction) {
        return (
            "animate__animated " + "animate__" + feature + purpose + direction
        );
    }
    /**
     * 获取一对特效
     * @param {string} feature 特效
     * @param {string} direction 方向
     * @returns
     */
    static getPair(feature, direction) {
        return [
            this.get(this.purpose.in, feature, direction),
            this.get(this.purpose.out, feature, direction),
        ];
    }
    /**
     * 获取相反特效
     * @param {string} feature 特效
     * @param {string} direction 方向
     * @returns
     */
    static getOpposite(feature, direction) {
        return [
            this.get(this.purpose.in, feature, direction),
            this.get(
                this.purpose.out,
                feature,
                this.direction.opposite(direction)
            ),
        ];
    }
    static get purpose() {
        return {
            in: "In",
            out: "Out",
        };
    }
    static get feature() {
        return {
            fade: "fade",
        };
    }
    static get direction() {
        return {
            /**
             * 获取对立方向
             * @param {string} direction
             * @returns
             */
            get opposite() {
                return (direction) => {
                    switch (direction) {
                        case this.up:
                            return this.up;
                        case this.down:
                            return this.down;
                        case this.left:
                            return this.right;
                        case this.right:
                            return this.left;
                    }
                    return "";
                };
            },
            up: "Up",
            down: "Down",
            left: "Left",
            right: "Right",
        };
    }
}

export class EffectLabel {
    /**
     * 键值对
     * @param {string} label
     * @param {string} value
     */
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
    static getList() {
        var list = [];
        Object.keys(Effects).forEach((x) => list.push(Effects[x]));
        return list;
    }
    get effect() {
        var vs = this.value.split(".");
        return Animation.getOpposite(vs[0], vs[1]);
    }
    static get effect() {
        return (value) => {
            var vs = value.split(".");
            return Animation.getOpposite(vs[0], vs[1]);
        };
    }
}

export const Effects = {
    FadeUp: new EffectLabel("淡入淡出 (上)", "fade.Up"),
    FadeDown: new EffectLabel("淡入淡出 (下)", "fade.Down"),
    FadeLeft: new EffectLabel("淡入淡出 (左)", "fade.Left"),
    FadeRight: new EffectLabel("淡入淡出 (右)", "fade.Right"),
};

export class EndlessPlayer {
    /**
     *
     * @param {function} elementGetter
     */
    constructor(elementGetter) {
        this.interval = null;
        this.index = -1;
        this.getter = elementGetter;
        this.inAction = () => {};
        this.outAction = () => {};
        this.beforeRoundAction = () => {};
        this.beforeAllAction = () => {};
        this.afterAllAction = () => {};
    }
    /**
     *
     * @param {Number} second
     * @returns {EndlessPlayer}
     */
    bySeconds(second) {
        this.Between = 1000 * second;
        return this;
    }
    byMillionSeconds(millionSecond) {
        this.Between = millionSecond;
        return this;
    }
    /**
     * @param {Number} value
     */
    set Between(value) {
        this.between = value;
        if (this.interval) {
            this.start();
        }
    }
    /**
     *
     * @param {function} action
     * @returns {EndlessPlayer}
     */
    beforeRound(action) {
        this.beforeRoundAction = action;
        return this;
    }
    beforeAll(action) {
        this.beforeAllAction = action;
        return this;
    }
    /**
     *
     * @param {function} action
     * @returns {EndlessPlayer}
     */
    afterAll(action) {
        this.afterAllAction = action;
        return this;
    }
    /**
     *
     * @param {function} action
     * @returns {EndlessPlayer}
     */
    whenElementIn(action) {
        this.inAction = action;
        return this;
    }
    /**
     *
     * @param {function} action
     * @returns {EndlessPlayer}
     */
    whenElementOut(action) {
        this.outAction = action;
        return this;
    }
    Index(length, change = false) {
        if (change) this.index--;
        if (this.index < 0) {
            this.index = length - 1;
        }
        return this.index;
    }
    play() {
        this.start();
    }
    start() {
        this.stop();
        let started = false;
        let nextImage = () => {
            let elements = this.getter();
            if (elements.length > 1) {
                if(!started){
                    this.beforeAllAction();
                    started = true;
                }
                this.beforeRoundAction();
                let element = elements[this.Index(elements.length)];
                this.inAction(element);

                element = elements[this.Index(elements.length, true)];
                this.outAction(element);
            }
        };
        this.interval = setInterval(nextImage, this.between);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.afterAllAction();
            this.interval = null;
        }
    }
}
