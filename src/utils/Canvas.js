import { GUID } from "./Definition";

export const DotInfo = {
    width: 5600,
    height: 7920,
};

export class Dot {
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} type
     * @param {string} address
     */
    constructor(x, y, type, address) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.address = address;
    }
    static Down() {
        return new Dot(null, null, "down", null);
    }
    static Up() {
        return new Dot(null, null, "up", null);
    }
}

export class ContextConfig {
    /**
     *
     * @param {number} lineWidth
     * @param {string} lineJoin
     * @param {string} lineCap
     * @param {number} drawCount
     */
    constructor(lineWidth, lineJoin, lineCap, drawCount) {
        this.lineWidth = lineWidth ?? 1;
        this.lineJoin = lineJoin ?? "round";
        this.lineCap = lineCap ?? "round";
        this.drawCount = drawCount ?? 2;
    }
    /**
     * @param {number} scale
     * @param {CanvasRenderingContext2D} context
     */
    initContext(scale, context) {
        context.lineWidth = this.lineWidth * scale;
        context.lineJoin = this.lineJoin;
        context.lineCap = this.lineCap;
        context.strokeStyle = "rgb(0,0,0)"; // "#000"
        context.fillStyle = "rgb(0,0,0)";
    }
}

export class Canvas {
    /**
     *
     * @param {string} id
     * @param {ContextConfig} config
     * @param {boolean} isRemote
     * @param {string} address
     * @param {number} scale
     */
    constructor(id, config, isRemote, address, scale) {
        this.id = id ?? GUID.NewGuid();
        this.config = config ?? new ContextConfig();
        this.isRemote = isRemote ?? false;
        this.address = address;
        this.setScale(scale ?? 1.5);
        this.lastPoint = null;
    }
    /**
     *
     * @param {number} scale
     * @param {HTMLCanvasElement} canvas
     */
    setScale(scale, canvas) {
        this.scale = scale;
        this.drawHeight = 360 * scale;
        this.drawWidth = 960 * scale;
        if (canvas) {
            canvas.width = this.drawWidth;
            canvas.height = this.drawHeight;
        }
    }
    /**
     *
     * @param {Dot} dot
     * @param {HTMLCanvasElement} canvas
     */
    draw(dot, canvas = null) {
        switch (dot.type) {
            case "up":
                this.lastPoint = null;
                return;
            case "down":
                return;
        }
        canvas ??= this.canvas;
        if (!canvas) return;
        this.resetDot(dot, canvas);
        if (this.lastPoint == null) {
            this.lastPoint = dot;
            return;
        }
        let context = canvas.getContext("2d");
        this.initContext(context);
        context.beginPath();
        context.moveTo(this.lastPoint.x, this.lastPoint.y);
        let controlPt = {};
        let control_scale = (0.8 / 0.5) * 0.175;
        controlPt.x =
            this.lastPoint.x + (dot.x - this.lastPoint.x) * control_scale;
        controlPt.y =
            this.lastPoint.y + (dot.y - this.lastPoint.y) * control_scale;
        context.quadraticCurveTo(controlPt.x, controlPt.y, dot.x, dot.y);
        this.lastPoint = dot;
        var t = 0;
        while (t < this.config.drawCount) {
            context.stroke();
            t++;
        }
        context.closePath();
    }
    /**
     *
     * @param {Dot} dot
     * @param {HTMLCanvasElement} canvas
     */
    resetDot(dot, canvas) {
        if (!dot.x) return dot;
        var x = (canvas.clientWidth / DotInfo.width) * dot.x * this.scale;
        var y = (canvas.clientHeight / DotInfo.height) * dot.y * this.scale;
        dot.x = x;
        dot.y = y;
        return dot;
    }
    /**
     *
     * @param {CanvasRenderingContext2D} context
     */
    initContext(context) {
        this.config.initContext(this.scale, context);
    }
    /**
     *
     * @param {Document} doc
     */
    bind(doc) {
        this.canvas = doc.getElementById(this.id);
         console.log(this.canvas?"绑定成功":"绑定失败");
    }
}
