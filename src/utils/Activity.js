import { Effects } from "./Animation";
import { GUID } from "./Definition";
import Request from "./Request";
import { Dot } from "@/utils/Canvas";
import { Location } from "./Location";

export class Activity {
    constructor(id) {
        this.id = id ?? "";
        this.title = "";
        this.subTitle = null;
        this.titleColor = "#000";
        this.titleSize = "10";
        this.font = null;

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
        this.bookId = "";

        this.startPageAddress = null;
        this.pageCount = null;
        this.pageHeight = null;
        this.pageWidth = null;

        /**
         * @type {Array<string>} 亟待删除的图片链接
         */
        this.willDeletePictureUrls = [];
    }
    get PictureCount() {
        return this.pictureUrls.length;
    }
    getCreateForm() {
        return Request.form({
            logo: this.logo,
            background: this.background,
            pictures: this.pictures,
            localSign: this.localSign,
        });
    }
    getCreateQuery() {
        return {
            title: this.title,
            subTitle: this.subTitle,
            titleSize: this.titleSize,
            titleColor: this.titleColor,
            font: this.font,
            bookId: this.bookId,
            border: this.border,
            pictureSpeed: this.pictureSpeed,
            rollEffect: this.rollEffect,
            signSpeed: this.signSpeed,
        };
    }
    /**
     *
     * @returns 获取删除的Query
     */
    getUpdateQuery() {
        let pictures = [];
        this.base.pictureUrls.forEach((l) => {
            if (this.pictureUrls.findIndex((x) => x == l) < 0) {
                pictures.push(l);
            }
        });
        return {
            activityId: this.id,
            pictureUrls: pictures,
        };
    }
    getUpdateBody() {
        let info = this.getCreateQuery();
        info.bookId = this.bookId;
        info.id = this.id;
        console.log(info);
        return info;
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
        this.logoUrl = null;
    }
    uploadPicture(file) {
        this.pictures.push(file.raw);
    }
    removePicture(file) {
        this.pictures.remove(null, (x) => x.uid == file.raw.uid);
    }
    removePictureUrl(url) {
        if (this.pictureUrls.remove(url)) {
            this.willDeletePictureUrls.push(url);
        }
    }
    removeAllPictureUrls() {
        if (this.pictureUrls) {
            while (this.pictureUrls.length > 0) {
                let url = this.pictureUrls.pop();
                this.willDeletePictureUrls.push(url);
            }
        }
    }
    uploadBackground(file) {
        this.background = file.raw;
    }
    removeBackground() {
        this.background = null;
        this.backgroundUrl = null;
    }
    get Copy() {
        return Object.copy(this,Activity);
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
        return Request
            .post(
                Location.activity("createActivity"),
                this.getCreateForm(),
                {
                    method: "POST",
                    headers: { "Content-Type": "multipart/form-data" },
                    params: this.getCreateQuery(),
                })
            .result();
    }
    async changeInfo() {
        return Request
            .post(
                Location.activity("updateActivityInfo"),
                this.getUpdateBody())
            .result();
    }
    async changeResource() {
        return Request
            .post(Location.activity("updateActivityInfo"),
                this.getCreateForm(),
                {
                    method: "POST",
                    headers: { "Content-Type": "multipart/form-data" },
                    params: this.getUpdateQuery(),
                }
            ).result();
    }
    static queryList() {
        return Request
            .get(Location.activity("queryActivity"))
            .result();
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
        return Request
            .get(Location.activity(`queryWritePages?activityId=${this.id}`))
            .result();
    }
    queryStroke(pageNum) {
        return Request.post(Location.stroke("queryStroke"), {
            activityId: this.id,
            pageNum: pageNum,
        }).result();
    }
    async delete() {
        return await Request
            .get(Location.activity(`deleteActivity?activityId=${this.id}`))
            .result();
    }
    static async allFont() {
        return await Request
            .get(Location.dic(`queryDic?code=font`))
            .result();
    }
    static async allBorder() {
        return await Request
            .get(Location.dic(`queryDic?code=border`))
            .result();
    }
}
