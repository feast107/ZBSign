import { GUID } from "./Definition";
import Request from "./Request";
export class Activity {
    constructor(id) {
        this.id = id ?? null;
        this.title = null;
        this.titleColor = "#000";
        this.logo = null;
        this.background = null;
        this.pictures = [];
        this.pictureSpeed = null;
        this.signSpeed = null;
        this.createTime = null;
        this.sharedLink = null;
    }
    getFileForm() {
        return Request.form({
            logo: this.logo,
            background: this.background,
            pictures: this.pictures,
        });
    }
    getDataQuery() {
        return {
            title: this.title,
            titleColor: this.titleColor,
            pictureSpeed: this.pictureSpeed,
            signSpeed: this.signSpeed,
        };
    }
    static Default() {
        let ret = new Activity();
        ret.id = "123456789";
        ret.title = "活动1";
        ret.createTime = new Date();
        ret.sharedLink = GUID.NewGuid();
        return ret;
    }
}
