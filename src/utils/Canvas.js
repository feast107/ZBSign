import { GUID } from "./Definition";

export const DotInfo = {
    width: 5600,
    height: 7920,
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
            if(this.lastPoint != null)
                console.log(`UP : { x:${this.lastPoint.X},y:${this.lastPoint.Y} }`);
            this.lastPoint = null;
            var length = this.points.length;
            if (length == 0) return;
            if (this.points[length - 1].length == 0) return;
            let s = Stroke.Points2SVG(this.points[length - 1]);
            this.strokes.push(s);
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
        if (!dot.IsMove) return dot;
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
        console.log(this.canvas ? "绑定成功" : "绑定失败");
    }
}

export class Stroke {
    /**
     *
     * @param {Array<Dot>} points
     */
    constructor(points) {
        this.points = points;
        this.path = Stroke.Points2SVG(points);
    }

    /**
     * SVG转点集合
     * @param {string} svg
     * @return {Array<Dot>}
     */
    static SVG2Points(svg) {
        let ret = new Array();
        if (svg == null || typeof svg != "string") return ret;
        let field = svg.split("l");
        if (field.length != 2) return ret;
        var firstPontArray = field[0].replace("M", "").split(" ");
        let firstX = int.Parse(firstPontArray[0].trim());
        let firstY = int.Parse(firstPontArray[1].trim());
        ret.Add(new Dot(firstX, firstY));

        var pointsArray = field[1]
            .replace("l", "")
            .replace("-", " -")
            .trim()
            .split(" ");
        for (let i = 0; i < pointsArray.length; i++) {
            if (i + 1 < pointsArray.length) {
                firstX = firstX + int.Parse(pointsArray[i].trim());
                firstY = firstY + int.Parse(pointsArray[i + 1].trim());
                ret.Add(new Dot(firstX, firstY));
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
