<template>
    <div style="width: 100%; height: 100%" v-loading="changing">
        <el-empty v-if="activities.length == 0" style="height: 100%" description="暂无记录">
            <template #image>
                <img style="width: 100px; height: 100px" src="../../assets/Main/Activity/None.svg" />
            </template>
        </el-empty>
        <el-col id="ActivityView" v-else style="height: 100%; width: 100%">
            <el-row justify="center" style="height: 50px; padding: 10px">
                <el-autocomplete id="AutoComplete" style="
                                        box-shadow: var(--el-box-shadow-light);
                                        width: 80%;
                                        border-radius: 20px;
                                    " v-model="searchPattern" :fetch-suggestions="getSuggests" clearable
                    popper-class="my-autocomplete" placeholder="搜索活动" @select="selectHandler" @change="onChangeHandler">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <search />
                        </el-icon>
                    </template>
                    <template #default="{ item }">
                        <div class="value">{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-row>
            <el-row id="MainList">
                <el-scrollbar v-loading="this.loading" style="width: 100%; padding-right: 10px">
                    <el-table stripe :data="activities.show" style="width: 100%">
                        <el-table-column width="35">
                            <el-button text style="margin-right: 10px">
                                <img class="icon-small" src="../../assets/Main/Activity/Activity.svg" />
                            </el-button>
                        </el-table-column>
                        <el-table-column>
                            <template #default="scope">
                                <span style="
                                                        user-select: none;
                                                        font-weight: 1000;
                                                        vertical-align: middle;
                                                        white-space :nowrap
                                                        ">
                                    {{ scope.row.title }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column width="120">
                            <template #default="scope">
                                <el-tag style="user-select: none" size="small">{{
                                    `| 签名${0}p | 照片${scope.row.PictureCount
                                    }p`
                                }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column width="100">
                            <template #default="scope">
                                <span style="user-select: none">
                                    {{
                                        `${scope.row.createTime.getFullYear()}/${scope.row.createTime.getMonth() + 1
                                        }/${scope.row.createTime.getDate()}`
                                    }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column width="50">
                            <template #default="scope">
                                <el-popover placement="top" trigger="hover">
                                    <el-button type="primary" plain @click="() => previewPlay(scope.row)">播放</el-button>
                                    <template #reference>
                                        <el-button class="iconButton" @click="
                                            () => previewPlay(scope.row)
                                        " circle>
                                            <img class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Play.svg" />
                                        </el-button>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column width="50"><!--Copy-->
                            <template #default="scope">
                                <el-button class="iconButton" @click="edit(scope.row)" circle>
                                    <img style="width: 20px; height: 20px" class="icon-small icon-canClick"
                                        src="../../assets/Main/Activity/Edit.svg" />
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="" width="50">
                            <template #default="scope">
                                <el-popover style="
                                                        box-shadow: var(--el-box-shadow-dark);
                                                    " placement="bottom" :width="'auto'" trigger="click">
                                    <template #reference>
                                        <el-button circle>
                                            <el-icon>
                                                <MoreFilled />
                                            </el-icon>
                                        </el-button>
                                    </template>
                                    <el-row>
                                        <el-popover placement="top" trigger="hover">
                                            <el-button type="primary" plain @click="
                                                () =>
                                                    copySharedLink(
                                                        scope.row
                                                    )
                                            ">复制分享码</el-button>
                                            <template #reference>
                                                <el-button class="iconButton" @click="
                                                    () =>
                                                        copySharedLink(
                                                            scope.row
                                                        )
                                                " circle>
                                                    <img class="icon-small icon-canClick" style="
                                                                            width: 20px;
                                                                            height: 20px;
                                                                        " src="../../assets/Main/Activity/Copy.svg" />
                                                </el-button>
                                            </template>
                                        </el-popover>
                                    </el-row>
                                    <el-row>
                                        <el-button class="iconButton" @click="
                                            () => erase(scope.row)
                                        " circle>
                                            <img style="
                                                                    width: 20px;
                                                                    height: 20px;
                                                                " class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Eraser.svg" />
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <el-button class="iconButton" @click="editResource(scope.row)" circle>
                                            <img style="
                                                                    width: 20px;
                                                                    height: 20px;
                                                                " class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Resource.svg" />
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <el-button class="iconButton" @click="deleteActivity(scope.row)" plain type="danger"
                                            circle>
                                            <el-icon style="
                                                                    width: 20px;
                                                                    height: 20px;
                                                                ">
                                                <Delete />
                                            </el-icon>
                                        </el-button>
                                    </el-row>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </el-row>
        </el-col>
        <!-- 修改对话框 -->
        <el-dialog v-model="editActivity.onEditInfo" title="修改信息" align-center width="50%" style="border-radius: 20px">
            <el-scrollbar style="height: 300px">
                <el-form v-if="editActivity.onEditInfo" label-width="120px" label-position="right"
                    style="margin-right: 20px" :model="editActivity.target" :rules="editActivity.rules">
                    <el-form-item prop="title" label="活动标题">
                        <el-input placeholder="请输入文字" v-model="editActivity.target.title" />
                    </el-form-item>
                    <el-form-item prop="subTitle" label="活动副标题">
                        <el-input placeholder="可以置空" v-model="editActivity.target.subTitle" />
                    </el-form-item>
                    <el-form-item label="标题颜色">
                        <el-color-picker v-model="editActivity.target.titleColor" />
                    </el-form-item>
                    <el-form-item label="标题字体">
                        <el-popover placement="right" :width="400" trigger="click">
                            <template #reference>
                                <el-button style="padding: 0; border: none">
                                    <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/Font.svg" />
                                </el-button>
                            </template>
                            <el-select v-model="editActivity.target.font" placeholder="选择字体">
                                <el-option v-for="item in activities.fonts" :key="item.dictValue" :label="item.dictName"
                                    :value="item.dictValue">
                                    <span style="float: left">{{
                                        item.dictName
                                    }}</span>
                                </el-option>
                            </el-select>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="标题尺寸">
                        <el-slider :min="activities.minSize" :max="activities.maxSize" style="width: 200px"
                            v-model="editActivity.target.titleSize" />
                    </el-form-item>
                    <el-form-item label="照片滚动速度">
                        <el-radio-group v-model="editActivity.target.pictureSpeed">
                            <el-radio v-for="item in activities.speeds" :key="item" :label="item"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="签名滚动速度">
                        <el-radio-group v-model="editActivity.target.signSpeed">
                            <el-radio v-for="item in activities.speeds" :key="item" :label="item"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="签名滚动效果">
                        <el-popover placement="right" :width="400" trigger="click">
                            <template #reference>
                                <el-button style="padding: 0; border: none">
                                    <img style="width: 30px; height: 30px"
                                        src="../../assets/Main/NewActivity/RowEffect.svg" />
                                </el-button>
                            </template>
                            <el-select v-model="editActivity.target.rollEffect" placeholder="选择效果">
                                <el-option v-for="item in effects" :key="item.value" :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{
                                        item.label
                                    }}</span>
                                </el-option>
                            </el-select>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="签名边框">
                        <el-popover placement="right" :width="400" trigger="click">
                            <template #reference>
                                <el-button style="padding: 0; border: none">
                                    <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/Border.svg" />
                                </el-button>
                            </template>
                            <el-select v-model="editActivity.target.border" placeholder="选择边框">
                                <el-option v-for="item in activities.borders" :key="item.dictValue" :label="item.dictName"
                                    :value="item.dictValue">
                                    <span style="float: left">{{
                                        item.dictName
                                    }}</span>
                                </el-option>
                            </el-select>
                        </el-popover>
                    </el-form-item>
                </el-form>
            </el-scrollbar>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelEdit">取消</el-button>
                    <el-button type="primary" @click="confirmEdit">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="editActivity.onEditResource" title="修改资源" align-center width="50%" style="border-radius: 20px">
            <div v-loading="changing">
                <el-form v-if="editActivity.onEditResource" label-position="right" label-width="120px"
                    style="margin-right: 20px" :model="editActivity.target">
                    <el-form-item prop="logo" label="活动LOGO">
                        <el-upload v-if="
                            editActivity.target.logoUrl == String() ||
                            editActivity.target.logoUrl == null
                        " class="avatar-uploader" action="#" :limit="1" :accept="accpetance" :on-change="uploadLogo"
                            :on-remove="removeLogo" :auto-upload="false" list-type="picture-card">
                            <el-icon id="logoUpload" class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                        <div class="ImageContainer" v-else>
                            <div class="ImageContainer clicker Imager">
                                <el-icon @click="removeLogo" color="#fff" size="20" class="ImageContainer">
                                    <delete />
                                </el-icon>
                            </div>
                            <el-image fit="contain" class="ImageContainer Imager" :src="editActivity.target.logoUrl" />
                        </div>
                    </el-form-item>
                    <el-form-item label="活动背景">
                        <el-upload v-if="
                            editActivity.target.backgroundUrl == String() ||
                            editActivity.target.backgroundUrl == null
                        " class="avatar-uploader" action="#" :limit="1" :accept="accpetance"
                            :on-change="uploadBackground" :on-remove="removeBackground" :auto-upload="false"
                            list-type="picture-card">
                            <el-icon id="backgroundUpload" class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                        <div class="ImageContainer" v-else>
                            <div class="ImageContainer clicker Imager">
                                <el-icon @click="removeBackground" color="#fff" size="20" class="ImageContainer">
                                    <delete />
                                </el-icon>
                            </div>
                            <el-image fit="contain" class="ImageContainer Imager"
                                :src="editActivity.target.backgroundUrl" />
                        </div>
                    </el-form-item>
                    <el-form-item label="上传照片墙">
                        <template #label>
                            <el-popover placement="left" :width="'auto'" trigger="hover">
                                <template #reference>
                                    <label style="
                                                            user-select: auto;
                                                            pointer-events: all;
                                                        ">上传照片墙</label>
                                </template>
                                <el-button id="PopRemoveAll" @click="
                                    () => {
                                        this.$refs.pictureWall.clearFiles();
                                        editActivity.target.removePictureUrl();
                                    }
                                " type="danger">清空</el-button>
                            </el-popover>
                        </template>

                        <el-popover placement="right" trigger="click">
                            <template #reference>
                                <el-button ref="cleanRef" style="padding: 0; border: none">
                                    <img style="width: 30px; height: 30px"
                                        src="../../assets/Main/NewActivity/UploadFile.svg" />
                                </el-button>
                            </template>
                            <el-scrollbar style="height: 300px; width: 440px">
                                <ul class="el-upload-list el-upload-list--picture-card">
                                    <li class="el-upload-list__item is-ready ImageContainer" :key="url" v-for="url in editActivity.target
                                        .pictureUrls">
                                        <div class="ImageContainer clicker Imager">
                                            <el-icon @click="
                                                () => removePictureUrl(url)
                                            " color="#fff" size="20" class="ImageContainer">
                                                <delete />
                                            </el-icon>
                                        </div>
                                        <el-image fit="contain" class="ImageContainer Imager" :src="url" />
                                    </li>
                                </ul>
                                <el-upload style="max-width: 440px" ref="pictureWall" multiple action="#"
                                    :auto-upload="false" :accept="accpetance" :on-change="uploadPicture"
                                    :on-remove="removePicture" list-type="picture-card">
                                    <el-icon class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </el-scrollbar>
                        </el-popover>
                    </el-form-item>
                </el-form>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelEdit">取消</el-button>
                    <el-button type="primary" @click="confirmEdit">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ComponentKey, Handlers } from "@/utils/Definition";
import { Activity } from "@/utils/Activity";
import { EffectLabel } from "@/utils/Animation";
import { Timer } from "@/utils/Format";
import { DomElement } from "@/utils/Events";
export default {
    inject: [ComponentKey.Activities, ComponentKey.PlayActicity],
    beforeMount() {
        this.setShow(this.activities);
    },
    data() {
        return {
            Timer: Timer,
            accpetance: "image/png,image/jpg,image/jpeg",
            loading: false,
            styles: {
                smallButton: "border:none;padding:0;",
            },
            effects: EffectLabel.getList(),
            /**
             * @type {Activity[]}
             */
            activities: this[ComponentKey.Activities],
            searchPattern: null,
            editActivity: {
                /**
                 * @type {Activity}
                 */
                target: null,
                onEditInfo: false,
                onEditResource: false,
                rules: Activity.rules(),
            },
            changing: false,
        };
    },
    watch: {
        activities(old, newValue) {
            console.log("CHANGE");
            this.setShow(newValue);
        },
    },
    methods: {
        setShow(activities, predict = null) {
            if (activities.whole.length > 0) {
                console.log(activities);
                this.loading = true;
                let vue = this;
                setTimeout(() => {
                    activities.show = [];
                    activities.whole.forEach((x) => {
                        if (predict && !predict(x)) {
                            return;
                        }
                        activities.show.push(x);
                    });
                    vue.loading = false;
                }, 200);
            }
        },
        onChangeHandler(value) {
            this.setShow(this.activities, (x) => x.title.includes(value));
        },
        selectHandler(args) {
            console.log(args);
            this.setShow(this.activities, (x) => x.title.includes(args.value));
        },
        uploadLogo(file) {
            this.editActivity.target.uploadLogo(file);
            DomElement.changeIconParent("logoUpload", DomElement.hidden);
        },
        removeLogo() {
            this.editActivity.target.removeLogo();
            DomElement.changeIconParent("logoUpload", DomElement.display);
        },
        uploadBackground(file) {
            this.editActivity.target.uploadBackground(file);
            DomElement.changeIconParent("backgroundUpload", DomElement.hidden);
        },
        removeBackground() {
            this.editActivity.target.removeBackground();
            DomElement.changeIconParent("backgroundUpload", DomElement.display);
        },
        uploadPicture(file) {
            this.editActivity.target.uploadPicture(file);
        },
        removePicture(file) {
            this.editActivity.target.removePicture(file);
        },
        removePictureUrl(url) {
            this.editActivity.target.removePictureUrl(url);
        },
        /**
         *
         * @param {string} queryString
         * @param {function} callback
         */
        getSuggests(queryString, callback) {
            let sel = [];
            let str = queryString == "null" ? "" : queryString.trim();
            this.activities.whole.forEach((x) => {
                if (str != "" && !x.title.startsWith(str)) return;
                if (sel.findIndex((i) => i.value == x.title) >= 0) return;
                sel.push({ value: x.title, link: "" });
            });
            callback(sel);
        },
        async copySharedLink(target) {
            try {
                await navigator.clipboard.writeText(target.sharedLink);
                this.$message.success(`复制成功`);
            } catch {
                this.$message.error(
                    `复制失败，请手动尝试:${target.sharedLink}`
                );
            }
        },
        previewPlay(target) {
            this.$emit(Handlers.PlayHandler, target);
        },
        erase(target) {
            this.$emit(Handlers.EraseHandler, target);
        },
        /**
         *
         * @param {Activity} target
         */
        edit(target) {
            this.editActivity.onEditInfo = true;
            this.editActivity.target = target.copy;
        },
        cancelEdit() {
            this.editActivity.onEditInfo = false;
            this.editActivity.onEditResource = false;
            this.editActivity.target = null;
        },
        async confirmEdit() {
            if (this.editActivity.onEditInfo) {
                if ((await this.editActivity.target.changeInfo()).Success) {
                    this.editActivity.onEditInfo = false;
                } else {
                    this.$message.error("修改失败");
                    return;
                }
            }
            if (this.editActivity.onEditResource) {
                this.changing = true;
                if ((await this.editActivity.target.changeResource()).Success) {
                    this.editActivity.onEditResource = false;
                    this.changing = false;
                } else {
                    this.$message.error("修改失败");
                    this.changing = false;
                    return;
                }
            }
            this.$message.success("修改成功");
            this.$emit("getActivities");
        },
        /**
         *
         * @param {Activity} target
         */
        editResource(target) {
            this.editActivity.onEditResource = true;
            this.editActivity.target = target.copy;
        },
        /**
         * @param {Activity} activity
         */
        async deleteActivity(activity) {
            if (!(await activity.delete())) return;
            this.$message.success("删除成功");
            this.$emit("getActivities");
            this.activities.whole.remove(activity);
            this.setShow(this.activities);
        },
    },
};
</script>

<style lang="scss">
.iconButton {
    padding: 0;
    border: none !important;
    margin: 1px;
    height: 36px;
    width: 36px !important;
}

.Imager {
    left: 0;
    position: absolute;
}

.clicker {
    border: 1px solid #c2c2c2;
    border-radius: 5px;
    z-index: 500;
    opacity: 0;
}

.clicker:hover {
    background-color: #00000088;
    transition-duration: 0.5s;
    opacity: 1;
}

.ImageContainer {
    width: 100px !important;
    height: 100px !important;
}

#ActivityView {
    #MainList {
        height: calc(100% - 50px);
        width: 100%;
    }

    .el-scrollbar {
        width: 100%;
    }

    .description {
        img {
            width: 40px;
            height: 40px;
        }
    }

    .el-table__row {
        .el-button {
            padding: 0;
            border-width: 0;
        }
    }

    .el-empty {
        user-select: none;
    }

    .el-input__wrapper {
        border-radius: 20px !important;
    }

    .el-empty__description {
        margin-top: 0;
    }

    .icon-small {
        height: 20px;
        width: 20px;
    }

    .icon-canClick:hover {
        filter: drop-shadow(10000px 0 0 white);
        transform: translate(-10000px);
    }
}
</style>
