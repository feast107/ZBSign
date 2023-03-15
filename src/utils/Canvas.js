import { GUID } from "./Definition";
import { Timer } from "./Format";
import Request from "./Request";

export const DotInfo = {
    width: 5600,
    height: 3960,
};

export class Dot {
    get X() {
        return this.x;
    }
    get Y() {
        return this.y;
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
                    let pgA = parseInt( of / numA / numB);
                    let pgB = parseInt((of / numA) % numB);
                    let pgC = parseInt( of % numA);
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
        this.lineWidth = lineWidth ?? 2;
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
    constructor(id, config, isRemote, address, scale, penSerial, pageNum) {
        this.id = id ?? GUID.NewGuid();
        this.config = config ?? new ContextConfig();
        this.isRemote = isRemote ?? false;
        this.address = address;
        this.setScale(scale ?? 1.5);
        this.penSerial = penSerial;
        this.pageNum = pageNum;
        this.lastPoint = null;
        /**
         * @type {Array<Array<Dot>>}
         */
        this.points = new Array(new Array());
        /**
         * @type {Array<Stroke>}
         */
        this.strokes = new Array();
        this.index = 0;
        this.className = "canvas";
        this.display = "";
    }
    get svgs() {
        return Stroke.PointsList2SVGList(this.points);
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
        this.drawHeight = 940 * scale;
        this.drawWidth = 1460 * scale;
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
    bringToFront() {
        this.index = 80;
        this.className = "front";
        console.log(`${this.id} 上升`);
    }
    bringBack() {
        this.index = 0;
        this.className = "canvas";
        console.log(`${this.id} 下降`);
    }
    show() {
        this.display = "";
    }
    hide() {
        this.display = "none";
    }
    /**
     *
     * @param {Dot} dot
     * @param {HTMLCanvasElement} canvas
     */
    draw(dot, canvas = null) {
        if (dot.IsUp) {
            this.lastPoint = null;
            var length = this.points.length;
            if (length == 0) return;
            if (this.points[length - 1].length == 0) return;
            let s = new Stroke(
                this.points[length - 1],
                this.penSerial,
                this.pageNum
            );
            this.strokes.push(s);
            console.log(s);
            this.points.push(new Array());
            return;
        }
        if (dot.IsDown) {
            return;
        }
        this.points[this.points.length - 1].push(dot);
        canvas ??= this.canvas;
        if (!canvas) return;
        this.resetDot(dot, canvas);
        if (!dot.IsValid) return;
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
        console.log(this.canvas ? "绑定成功" : "绑定失败");
    }
    uploadStroke(activityId) {
        if (this.strokes.length == 0) return Promise.resolve(true);
        let strokes = this.strokes;
        this.strokes = [];
        let data = {
            activityId: activityId,
            pageNum: this.pageNum,
            strokeList: strokes,
        };
        let r = Request.post("/signservice/stroke/uploadStroke", data);
        console.log(data);
        r.catch((e) => {
            this.strokes.forEach((x) => {
                strokes.push(x);
            });
            this.strokes = strokes;
        });
        return r;
    }
}

export class Stroke {
    /**
     *
     * @param {Array<Dot>} points
     */
    constructor(points, penSerial, pageNum, color = "#000") {
        this.c = color;
        this.p = Stroke.Points2SVG(points);
        this.s = penSerial;
        this.n = pageNum;
        this.st = Timer.timeStamp();
        this.x1 = points[0].X;
        this.y1 = points[0].Y;
    }

    /**
     * SVG转点集合
     * @param {string} svg
     * @return {Array<Dot>}
     */
    static SVG2Points(svg,address = null) {
        let ret = new Array();
        if (svg == null || typeof svg != "string") return ret;
        let field = svg.split("l");
        if (field.length != 2) return ret;
        var firstPontArray = field[0].replace("M", "").split(" ");
        let firstX = parseInt(firstPontArray[0].trim());
        let firstY = parseInt(firstPontArray[1].trim());
        ret.push(new Dot(firstX, firstY));

        var pointsArray = field[1]
            .replace("l", "")
            .replace("-", " -")
            .trim()
            .split(" ");
        for (let i = 0; i < pointsArray.length; i++) {
            if (i + 1 < pointsArray.length) {
                firstX = firstX + parseInt(pointsArray[i].trim());
                firstY = firstY + parseInt(pointsArray[i + 1].trim());
                ret.push(Dot.Move(firstX, firstY,address));
            }
            i++;
        }
        return ret;
    }

    /**
     * 点集合转SVG
     * @param {Array<Dot>} points
     * @return {string}
     */
    static Points2SVG(points) {
        let ret = String();
        if (points == null || points.length == 0) {
            return ret;
        }
        let i = 0;
        let oldX, oldY, curX, curY;
        let point = points[0];
        //第一个点为M起点
        ret += `M${point.X} ${point.Y}l`;
        oldX = point.X;
        oldY = point.Y;
        if (points.length > 1) {
            i = 1;
            //L第一个点特殊处理
            point = points[i];
            curX = point.X - oldX;
            curY = point.Y - oldY;
            oldX = point.X;
            oldY = point.Y;
            ret += String(curX);
            if (curY >= 0) {
                ret += " ";
            }
            ret += String(curY);
            i++;

            while (i < points.length) {
                point = points[i];
                curX = point.X - oldX;
                curY = point.Y - oldY;
                oldX = point.X;
                oldY = point.Y;
                if (curX == 0 && curY == 0) {
                    i++;
                    continue;
                }

                if (curX >= 0) {
                    ret += " ";
                }
                ret += String(curX);

                if (curY >= 0) {
                    ret += " ";
                }
                ret += String(curY);
                i++;
            }
        }
        return ret;
    }

    static PointsList2SVGList(points) {}
}
