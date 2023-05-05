import { Canvas, Dot, SvgCanvas } from "./Canvas";
import { Activity } from "./Activity";
import Request from "../utils/Request";
import { Location } from "../configure/Location";

export class StrokeDivider {
    /**
     *
     * @param {Number} pageNum
     * @param {string} pageAddress
     * @param {Array<Stroke>} strokes
     * @param {Activity} activity
     * @param {string} localSerial
     * @param {Object} localContainer
     * @param {Object} remoteContainer
     */
    constructor(
        pageNum,
        pageAddress,
        strokes,
        activity,
        localSerial,
        localContainer,
        remoteContainer
    ) {
        this.penSerial = localSerial;
        this.activity = activity;
        this.pageAddress = pageAddress;
        this.pageNum = pageNum;
        this.isSvgCanvas = true;
        /**
         * @type {SvgCanvas}
         */
        this.local = null;
        /**
         * @type {SvgCanvas[]}
         */
        this.remote = {};
        this.localContainer = localContainer;
        this.remoteContainer = remoteContainer;
        this.accecptStrokes(strokes);
        if (localContainer[pageAddress]) {
            this.local = localContainer[pageAddress];
        }
        this.index = 0;
    }
    /**
     *
     * @param {Stroke} stroke
     */
    accecptOneStroke(stroke) {
        /**
         * @type {SvgCanvas}
         */
        let canvas;
        if (this.penSerial != null && stroke.s == this.penSerial) {
            canvas = this.createLocal(stroke.s);
            if (canvas.hasStroke(stroke)) {
                console.log("拉取到已上传的笔迹");
                return;
            }
            canvas.uploadInterval(this.activity.id);
        } else {
            canvas = this.createRemote(stroke.s);
        }
        if (this.isSvgCanvas) {
            canvas.strokes.push(stroke);
        } else {
            setTimeout(() => {
                canvas.bind(document);
                var points = Stroke.SVG2Points2(stroke.p, this.pageAddress);
                points.forEach((dot) => {
                    canvas.draw(dot, null, false);
                });
                canvas.draw(Dot.Up, null, false);
            }, 0);
        }
    }
    accecptNewStrokes(strokes) {
        strokes.forEach((stroke) => {
            this.index++;
            this.accecptOneStroke(stroke);
        });
    }
    /**
     * 处理笔迹事件
     * @param {Array<Stroke>} strokes
     */
    accecptStrokes(strokes) {
        for (; this.index < strokes.length; this.index++) {
            let stroke = strokes[this.index];
            this.accecptOneStroke(stroke);
        }
    }
    createLocal(penSerial) {
        if (this.local) return this.local;
        if (this.localContainer[this.pageAddress]) {
            this.local = this.localContainer[this.pageAddress];
            return this.local;
        }
        if (this.isSvgCanvas) {
            this.localContainer[this.pageAddress] = this.local = new SvgCanvas(
                this.pageAddress,
                penSerial,
                this.pageNum
            );
        } else {
            this.localContainer[this.pageAddress] = this.local = new Canvas(
                null,
                null,
                false,
                this.pageAddress,
                null,
                penSerial,
                this.pageNum
            );
        }
        this.local.listen(async (_) => {
            await this.doQuery();
        });
        return this.local;
    }
    createRemote(penSerial) {
        let name = `${this.pageAddress}|${penSerial}`;
        if (this.remote[name]) return this.remote[name];
        if (this.remoteContainer[name]) {
            return (this.remote[name] = this.remoteContainer[name]);
        }
        let remote;
        if (this.isSvgCanvas) {
            remote = this.remoteContainer[name] = new SvgCanvas(
                this.pageAddress,
                penSerial,
                this.pageNum
            );
        } else {
            remote = this.remoteContainer[name] = new Canvas(
                null,
                null,
                false,
                this.pageAddress,
                null,
                penSerial,
                this.pageNum
            );
        }

        if (Object.keys(this.remoteContainer).length == 1) {
            let interval = setInterval(async () => {
                if (Object.keys(this.remoteContainer).length > 1) {
                    clearInterval(interval);
                } else {
                    await this.doQuery();
                }
            }, 3000);
        }

        remote.listen(async (_) => {
            await this.doQuery();
        });
        return remote;
    }
    async doQuery(newInterface = true) {
        let promise;
        if (newInterface) {
            promise = await this.activity.queryStrokeChanged(
                this.pageNum,
                this.index
            );
        } else {
            promise = await this.activity.queryStrokes(this.pageNum);
        }
        if (!promise.Success) {
            return;
        }
        /**
         * @type {Array<Stroke>}
         */
        if (!promise) {
            console.log("promise 没有返回");
            return;
        }
        let strokes = promise.data;
        if (!strokes) {
            console.log("strokes 为空或没有新的笔迹");
            return;
        }
        if (newInterface) {
            console.log(
                `${this.pageNum}页 拉取新的笔迹 新增:[${strokes.length}]条`
            );
            this.accecptNewStrokes(strokes);
        } else {
            console.log(
                `${this.pageNum}页 拉取全部笔迹 总共:[${strokes.length
                }]条 新增:[${strokes.length - this.index}]条`
            );
            this.accecptStrokes(strokes);
        }
    }
}

export class Stroke {
    /**
     *
     * @param {Dot[]} points
     * @param {string} penSerial
     * @param {Number} pageNum
     * @param {string} color
     */
    constructor(points, penSerial, pageNum, color = "#000") {
        /**
         * 颜色
         */
        this.c = color;
        /**
         * 路径
         */
        this.p = Stroke.Points2SVG(points);
        /**
         * 笔序列号
         */
        this.s = penSerial;
        /**
         * 页码
         */
        this.n = pageNum;
        /**
         * 时间戳
         */
        this.st = new Date().getTime();
        /**
         * 起始点x
         */
        this.x1 = points[0].X;
        /**
         * 起始点y
         */
        this.y1 = points[0].Y;
        /**
         * 最终点
         */
        this.last = points[points.length - 1];
    }
    /**
     *
     * @param {Dot} dot
     * @returns
     */
    addPoint(dot) {
        let curX = dot.X - this.last.X;
        let curY = dot.Y - this.last.Y;
        if (curX == 0 && curY == 0) {
            return;
        }

        if (curX >= 0) {
            this.p += " ";
        }
        this.p += String(curX);

        if (curY >= 0) {
            this.p += " ";
        }
        this.p += String(curY);
        this.last = dot;
    }
    /**
     * SVG转点集合
     * @param {string} svg
     * @return {Array<Dot>}
     */
    static SVG2Points(svg, address = null) {
        let ret = new Array();
        debugger;
        if (svg == null || typeof svg != "string") return ret;
        let field = svg.split("l");
        if (field.length != 2) return ret;
        var firstPontArray = field[0].replace("M", "").split(" ");
        let firstX = parseInt(firstPontArray[0].trim());
        let firstY = parseInt(firstPontArray[1].trim());
        ret.push(Dot.Move(firstX, firstY, address));

        var pointsArray = field[1]
            .replace("l", "")
            .replace("-", " -")
            .trim()
            .split(" ");
        for (let i = 0; i < pointsArray.length; i++) {
            if (i + 1 < pointsArray.length) {
                firstX = firstX + parseInt(pointsArray[i].trim());
                firstY = firstY + parseInt(pointsArray[i + 1].trim());
                ret.push(Dot.Move(firstX, firstY, address));
            }
            i++;
        }
        return ret;
    }
    /**
     *
     * @param {string} points
     * @param {string} address
     * @returns
     */
    static SVG2Points2(points, address = null) {
        let pointList = [];
        /*开始转换*/
        if (points != null && points != "") {
            /*起始点及其他点*/
            let firstOther = points.split("l");
            if (firstOther != null && firstOther.length == 2) {
                /*获取第一个点*/
                let firstPoint = firstOther[0].replace("M", "").split(" ");
                let firstX = parseInt(firstPoint[0]);
                let firstY = parseInt(firstPoint[1]);
                let firstStrokePoint = Dot.Move(firstX, firstY, address);
                pointList.push(firstStrokePoint);
                /*其他点*/
                let otherPoint = firstOther[1]
                    .replaceAll("l", "")
                    .replaceAll("-", " -");
                let otherPoints = otherPoint.trim().split(" ");
                /*循环其他点*/
                for (let i = 0; i < otherPoints.length; i++) {
                    if (i + 1 < otherPoints.length) {
                        let point = Dot.Move(
                            firstX + parseInt(otherPoints[i].trim()),
                            firstY + parseInt(otherPoints[i + 1].trim()),
                            address
                        );
                        pointList.push(point);
                        firstX = point.X;
                        firstY = point.Y;
                        i++;
                    }
                }
            }
        }
        return pointList;
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
}

export class StrokeManager {
    /**
     * @param {Canvas|SvgCanvas} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.waits = [];
        /**
         * @type {Stroke[]}
         */
        this.uploaded = [];
    }
    /**
     *
     * @param {Stroke} stroke
     */
    addStroke(stroke) {
        this.waits.push(stroke);
    }
    /**
     *
     * @param {Stroke} stroke
     */
    hasStroke(stroke) {
        return this.uploaded.findIndex((x) => x.st == stroke.st) > -1;
    }
    async upload(activityId) {
        if (this.waits.length == 0) return Promise.resolve(true);
        let uploads = this.waits;
        this.waits = [];
        return Request.post(Location.stroke("uploadStroke"), {
            activityId: activityId,
            pageNum: this.canvas.pageNum,
            strokeList: uploads,
        })
            .then((_) => {
                uploads.forEach((x) => {
                    this.uploaded.push(x);
                });
            })
            .catch((_) => {
                this.waits.forEach((x) => {
                    uploads.push(x);
                });
                this.waits = uploads;
            });
    }
    uploadInterval(activityId, interval = 3000) {
        this.stopUpload();
        this.interval = setInterval(() => {
            this.upload(activityId);
        }, interval);
    }
    stopUpload() {
        if (!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
    }
}
