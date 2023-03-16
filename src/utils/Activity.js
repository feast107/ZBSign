import { Effects } from "./Animation";
import { GUID } from "./Definition";
import Request from "./Request";
import { Dot } from "@/utils/Canvas";
export class Activity {
    constructor(id) {
        this.id = id ?? "";
        this.title = "";
        this.titleColor = "#000";

        this.logo = null;
        this.background = null;
        this.pictures = [];

        this.logoUrl = "";
        this.backgroundUrl = "";
        this.pictureUrls = [];

        this.pictureSpeed = "1x";
        this.signSpeed = "1x";
        this.createTime = "";
        this.sharedLink = "";

        this.rollEffect = "";
        this.localSign = [];

        this.border = "";

        this.startPageAddress = null;
        this.pageCount = null;
        this.pageHeight = null;
        this.pageWidth = null;
    }
    get PictureCount() {
        return this.pictureUrls.length;
    }
    getFileForm() {
        return Request.form({
            logo: this.logo,
            background: this.background,
            pictures: this.pictures,
            localSign: this.localSign,
        });
    }
    getDataQuery() {
        return {
            title: this.title,
            titleColor: this.titleColor,
            pictureSpeed: this.pictureSpeed,
            signSpeed: this.signSpeed,
            rollEffect: this.rollEffect,
        };
    }
    static Default() {
        let ret = new Activity();
        ret.id = "123456789";
        ret.title = "南京孜博汇信息科技有限公司";
        ret.titleColor = "#faf";
        ret.createTime = new Date();
        ret.sharedLink = GUID.NewGuid();
        ret.rollEffect = Effects.FadeDown.value;
        let getUrl = (num) =>
            `http://47.93.86.37:8686/taskFile/sign/${num}.JPG`;
        ret.pictureUrls = [
            getUrl(1),
            getUrl(2),
            getUrl(3),
            getUrl(4),
            getUrl(5),
        ];
        ret.logoUrl = `http://47.93.86.37:8686/taskFile/sign/logo.png`;
        return ret;
    }
    static rules() {
        return {
            title: [
                {
                    required: true,
                    message: "请输入活动名称",
                    trigger: "blur",
                },
            ],
        };
    }
    uploadLogo(file) {
        this.logo = file.raw;
    }
    removeLogo() {
        this.logo = null;
    }
    uploadPicture(file) {
        this.pictures.push(file.raw);
    }
    removePicture(file) {
        let index = this.pictures.findIndex((x) => x.uid == file.raw.uid);
        this.pictures.splice(index, 1);
    }
    uploadBackground(file) {
        this.background = file.raw;
    }
    removeBackground() {
        this.background = null;
    }
    get Copy() {
        var ret = new Activity();
        Object.keys(this).forEach((k) => (ret[k] = this[k]));
        return ret;
    }
    getPageAddress(pageNum) {
        return Dot.pageAddress(this.startPageAddress, pageNum);
    }
    get Speed() {
        switch (this.pictureSpeed) {
            case "3x":
                return 2;
            case "2x":
                return 4;
            case "1x":
                return 6;
        }
        return 6;
    }
    getPageNum(address) {
        return Dot.pageNum(this.startPageAddress, address, this.pageCount);
    }
    create() {
        return Request.post(
            "/signservice/activity/createActivity",
            this.getFileForm(),
            {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                params: this.getDataQuery(),
            }
        );
    }
    changeInfo() {
        return Request.post("");
    }
    changeResource() {}
    static queryList() {
        return Request.get("/signservice/activity/queryActivity");
    }
    /**
     *
     * @param {Activity} other
     */
    static from(other) {
        let ret = new Activity();
        Object.keys(other).forEach((x) => {
            if (x == "createTime") {
                ret[x] = new Date(Number(other[x]));
            } else {
                ret[x] = other[x];
            }
        });
        return ret;
    }
    queryWrittenPages() {
        return Request.get(
            "/signservice/activity/queryWritePages?activityId=" + this.id
        );
    }
    queryStroke(pageNum) {
        return Request.post("/signservice/stroke/queryStroke", {
            activityId: this.id,
            pageNum: pageNum,
        });
    }
    delete(){
        return Request.get(`/signservice/activity/deleteActivity?activityId=${this.id}`);
    }

    static async allFont(){

    }
    static async allBorder(){
        
    }
}
