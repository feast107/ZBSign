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
    static get effect(){
        return (value) => {
            var vs = value.split(".");
        return Animation.getOpposite(vs[0], vs[1]);
        }
    }
}

export const Effects = {
    FadeUp: new EffectLabel("淡入淡出 (上)", "fade.Up"),
    FadeDown: new EffectLabel("淡入淡出 (下)", "fade.Down"),
    FadeLeft: new EffectLabel("淡入淡出 (左)", "fade.Left"),
    FadeRight: new EffectLabel("淡入淡出 (右)", "fade.Right"),
};
