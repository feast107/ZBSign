import { GUID } from "./Definition";
import { Stroke, StrokeManager } from "./Stroke";

export class DotInfo {
    static get width() {
        return 10000;
    }
    static get height() {
        return 6900;
    }
}

export class Dot {
    get X() {
        return parseInt(this.x);
    }
    get Y() {
        return parseInt(this.y);
    }
    get IsValid() {
        return this.x != 0 || this.y != 0;
    }
    get IsDown() {
        return this.type == "down";
    }
    get IsUp() {
        return this.type == "up";
    }
    get IsMove() {
        return this.type == "move";
    }
    get Copy() {
        let ret = new Dot();
        Object.keys(this).forEach((K) => {
            ret[K] = this[K];
        });
        return ret;
    }
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
    static get Down() {
        if (!this.down) this.down = new Dot(null, null, "down", null);
        return this.down;
    }
    static get Up() {
        if (!this.up) this.up = new Dot(null, null, "up", null);
        return this.up;
    }
    static Move(x, y, address) {
        return new Dot(x, y, "move", address);
    }
    static pageNum(startAddress, address, pageSize) {
        let beginStrs = startAddress.split(".");
        let pageStrs = address.split(".");
        if (beginStrs[0] != pageStrs[0]) {
            return -1;
        }
        let begin_C = Number(beginStrs[3]);
        let begin_B = Number(beginStrs[2]);
        let begin_A = Number(beginStrs[1]);

        let page_C = Number(pageStrs[3]);
        let page_B = Number(pageStrs[2]);
        let page_A = Number(pageStrs[1]);

        let page = -1;
        switch (beginStrs[0]) {
            //拓思德点阵
            case "1713": {
                page =
                    ((page_A - begin_A) * 53 + (page_B - begin_B)) * 108 +
                    (page_C - begin_C) +
                    1;
                break;
            }
            //拓思德点阵
            case "1536": {
                page =
                    ((page_A - begin_A) * 73 + (page_B - begin_B)) * 108 +
                    (page_C - begin_C) +
                    1;
                break;
            }
            //腾千里点阵
            default: {
                page = (page_B - begin_B) * 256 + (page_C - begin_C) + 1;
                break;
            }
        }

        if (page > 0 && page <= pageSize) {
            return page;
        } else return -1;
    }
    static pageAddress(startAddress, pageNum) {
        let ret = "";
        if (pageNum > 0) {
            let strAry = startAddress.split(".");
            for (let i = 0; i < pageNum; i++) {
                let of = i;
                let stA = Number(strAry[1]);
                let stB = Number(strAry[2]);
                let stC = Number(strAry[3]);
                let numA = 108;
                let numB = 0;
                switch (Number(strAry[0])) {
                    case 1713: {
                        numB = 53;
                        numA = 108;
                        break;
                    }
                    case 1536: {
                        numB = 73;
                        numA = 108;
                        break;
                    }
                    case 0: {
                        numB = 1;
                        numA = 256;
                        break;
                    }

                    default:
                        break;
                }
                if (numA == 256) {
                    of = stC + of;
                    of = stB * numA + of;
                    if (of < 0) {
                        break;
                    }
                    let pgA = parseInt(of / numA / numB);
                    let pgC = parseInt(of % numA);
                    ret = `${strAry[0]}.${strAry[1]}.${pgA}.${pgC}`;
                } else {
                    of = stC + of;
                    of = stB * numA + of;
                    of = stA * numB * numA + of;
                    if (of < 0) {
                        break;
                    }
                    let pgA = parseInt(of / numA / numB);
                    let pgB = parseInt((of / numA) % numB);
                    let pgC = parseInt(of % numA);
                    ret = `${strAry[0]}.${pgA}.${pgB}.${pgC}`;
                }
            }
        } else {
            ret = "";
        }
        return ret;
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

export class SvgCanvas {
    constructor(address, penSerial, pageNum) {
        this.display = "";
        this.strokeManager = new StrokeManager(this);
        this.className = "canvas";
        this.address = address;
        this.penSerial = penSerial;
        this.pageNum = pageNum;
        this.strokes = [];
        this.currentStroke = null;
        this.lastDot = null;
        this.events = [];
    }
    trigger(sender) {
        this.events.forEach((x) => x(sender));
    }
    listen(handler) {
        this.events.push(handler);
    }
    onPenUp(store = true) {
        if (this.lastDot == null) return;
        this.lastDot = null;
        if (this.currentStroke == null) return;
        if (store) {
            this.strokeManager.addStroke(this.currentStroke);
            console.log("提交到manager");
        }
        this.currentStroke = null;
    }
    /**
     *
     * @param {Dot} dot
     * @returns
     */
    onPenMove(dot, store = true) {
        if (!dot.IsValid) return;
        if (this.lastDot == null) {
            this.lastDot = dot;
            return;
        }
        if (this.currentStroke == null) {
            this.currentStroke = new Stroke(
                [this.lastDot, dot],
                this.penSerial,
                this.pageNum
            );
            this.strokes.push(this.currentStroke);
            console.log(this.currentStroke);
        } else {
            this.currentStroke.addPoint(dot);
            console.log(this.currentStroke);
        }
    }
    /**
     *
     * @param {Dot} dot
     * @param {HTMLCanvasElement} canvas
     * @param {boolean} store 是否需要存储
     */
    draw(dot, _ = null, store = true) {
        if (dot.IsUp) {
            this.onPenUp(store);
            return;
        }
        if (dot.IsDown) {
            return;
        }
        this.onPenMove(dot, store);
    }

    show() {
        this.display = "";
    }
    hide() {
        this.display = "none";
    }
    /**
     *
     * @param {Stroke} stroke
     */
    hasStroke(stroke) {
        return this.strokeManager.hasStroke(stroke);
    }
    async uploadStroke(activityId) {
        return await this.strokeManager.upload(activityId);
    }
    uploadInterval(activityId, interval = 3000) {
        this.strokeManager.uploadInterval(activityId, interval);
    }
    stopUpload() {
        this.strokeManager.stopUpload();
    }
    bind(_) {}
}

export class Canvas {
    /**
     *
     * @param {string} id
     * @param {ContextConfig} config
     * @param {boolean} isRemote
     * @param {string} address
     * @param {number} scale
     * @param {Document}doc
     */
    constructor(
        id,
        config,
        isRemote,
        address,
        scale,
        penSerial,
        pageNum,
        doc = null
    ) {
        this.id = id ?? GUID.NewGuid();
        this.config = config ?? new ContextConfig();
        this.isRemote = isRemote ?? false;
        this.address = address;
        this.setScale(scale ?? 3);
        this.penSerial = penSerial;
        this.pageNum = pageNum;
        this.lastPoint = null;
        this.strokeManager = new StrokeManager(this);
        /**
         * @type {Dot[]}
         */
        this.currentPoints = [];
        this.index = 0;
        this.className = "canvas";
        this.display = "";
        if (doc) {
            setTimeout(() => {
                this.bind(doc);
            }, 0);
        }
        this.events = [];
    }
    /**
     * @param {Number} width
     */
    set strokeWidth(width) {
        this.config.drawWidth = width;
    }
    /**
     *
     * @param {number} scale
     * @param {HTMLCanvasElement} canvas
     */
    setScale(scale, canvas) {
        this.scale = scale;
        let standard = 450;
        this.drawHeight = standard * scale;
        this.drawWidth = (standard * 100 * scale) / 69;
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
    resetDot(dot, canvas) {
        if (!dot.IsMove) return dot;
        var x = (canvas.clientWidth / DotInfo.width) * dot.x * this.scale;
        var y = (canvas.clientHeight / DotInfo.height) * dot.y * this.scale;
        dot.x = x;
        dot.y = y;
        return dot;
    }
    trigger(sender) {
        this.events.forEach((x) => x(sender));
    }
    listen(handler) {
        this.events.push(handler);
    }
    show() {
        this.display = "";
    }
    hide() {
        this.display = "none";
    }
    onPenUp(store = true) {
        if (this.lastPoint == null) return;
        this.lastPoint = null;
        if (!store) return;
        var length = this.currentPoints.length;
        if (length == 0) return;
        this.strokeManager.addStroke(
            new Stroke(this.currentPoints, this.penSerial, this.pageNum)
        );
        this.currentPoints = [];
    }
    /**
     *
     * @param {Dot} dot
     * @returns
     */
    onPenMove(dot, store = true) {
        let d = dot.Copy;
        let canvas = this.canvas;
        if (!canvas) return;
        this.resetDot(dot, canvas);
        if (!dot.IsValid) return;
        if (store) {
            this.currentPoints.push(d);
        }
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
            this.lastPoint.X + (dot.X - this.lastPoint.X) * control_scale;
        controlPt.y =
            this.lastPoint.Y + (dot.Y - this.lastPoint.Y) * control_scale;
        context.quadraticCurveTo(controlPt.x, controlPt.y, dot.X, dot.Y);
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
     * @param {boolean} store 是否需要存储
     */
    draw(dot, canvas = null, store = true) {
        if (dot.IsUp) {
            this.onPenUp(store);
            return;
        }
        if (dot.IsDown) {
            return;
        }
        this.onPenMove(dot, store);
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
        if (this.canvas) return;
        this.canvas = doc.getElementById(this.id);
        if (!this.canvas) this.canvas = document.getElementById(this.id);
        console.log(this.canvas ? "绑定成功" : "绑定失败");
    }
    /**
     *
     * @param {Stroke} stroke
     */
    hasStroke(stroke) {
        return this.strokeManager.hasStroke(stroke);
    }
    async uploadStroke(activityId) {
        return await this.strokeManager.upload(activityId);
    }
    uploadInterval(activityId, interval = 3000) {
        this.strokeManager.uploadInterval(activityId, interval);
    }
    stopUpload() {
        this.strokeManager.stopUpload();
    }
}
