export const Animation = {
    get(purpose, feature, direction) {
        return (
            "animate__animated " + "animate__" + feature + purpose + direction
        );
    },
    getPair(feature, direction) {
        return [
            this.get(this.purpose.in, feature, direction),
            this.get(this.purpose.out, feature, direction),
        ];
    },
    getOpposite(feature, direction) {
        return [
            this.get(this.purpose.in, feature, direction),
            this.get(this.purpose.out, feature, this.direction.opposite(direction)),
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
        },
        up: "Up",
        down: "Down",
        left: "Left",
        right: "Right",
    },
};
