export const Animation = {
    /**
     * 获取特效
     * @param {string} purpose 出入
     * @param {string} feature 特效
     * @param {string} direction 方向
     * @returns
     */
    get(purpose, feature, direction) {
        return (
            "animate__animated " + "animate__" + feature + purpose + direction
        );
    },
    /**
     * 获取一对特效
     * @param {string} feature 特效
     * @param {string} direction 方向
     * @returns
     */
    getPair(feature, direction) {
        return [
            this.get(this.purpose.in, feature, direction),
            this.get(this.purpose.out, feature, direction),
        ];
    },
    /**
     * 获取相反特效
     * @param {string} feature 特效
     * @param {string} direction 方向
     * @returns
     */
    getOpposite(feature, direction) {
        return [
            this.get(this.purpose.in, feature, direction),
            this.get(
                this.purpose.out,
                feature,
                this.direction.opposite(direction)
            ),
        ];
    },
    purpose: {
        in: "In",
        out: "Out",
    },
    feature: {
        fade: "fade",
    },
    direction: {
        opposite(direction) {
            switch (direction) {
                case this.up:
                    return this.down;
                case this.down:
                    return this.up;
                case this.left:
                    return this.right;
                case this.right:
                    return this.left;
            }
            return "";
        },
        up: "Up",
        down: "Down",
        left: "Left",
        right: "Right",
    },
};

export class EffectLabel {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
    static getList() {
        var list = [];
        Object.keys(Effects).forEach((x) => list.push(Effects[x]));
        return list;
    }
}

export const Effects = {
    FadeUp: new EffectLabel("淡入淡出 (上)", "fade.Up"),
    FadeDown: new EffectLabel("淡入淡出 (下)", "fade.Down"),
    FadeLeft: new EffectLabel("淡入淡出 (左)", "fade.Left"),
    FadeRight: new EffectLabel("淡入淡出 (右)", "fade.Right"),
};
