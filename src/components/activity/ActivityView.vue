<template>
    <div style="width: 100%; height: 100%">
        <el-empty
            v-if="cache.length == 0"
            style="height: 100%"
            description="暂无记录">
            <template #image>
                <img
                    style="width: 100px; height: 100px"
                    src="../../assets/Main/Activity/None.svg" />
            </template>
        </el-empty>
        <el-col id="ActivityView" v-else style="height: 100%; width: 100%">
            <el-row justify="center" style="height: 50px; padding: 10px">
                <el-autocomplete
                    id="AutoComplete"
                    style="
                        box-shadow: var(--el-box-shadow-light);
                        width: 80%;
                        border-radius: 20px;
                    "
                    v-model="searchPattern"
                    :fetch-suggestions="getSuggests"
                    clearable
                    popper-class="my-autocomplete"
                    placeholder="搜索活动"
                    @select="selectHandler">
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
                <el-scrollbar
                    v-loading="this.loading"
                    style="width: 100%; padding-right: 10px">
                    <el-table
                        stripe
                        :data="activitiesForShow"
                        style="width: 100%">
                        <el-table-column>
                            <template #default="scope">
                                <el-button text style="margin-right: 10px">
                                    <img
                                        class="icon-small"
                                        src="../../assets/Main/Activity/Activity.svg" />
                                </el-button>
                                <span
                                    style="
                                        user-select: none;
                                        font-weight: 1000;
                                        vertical-align: middle;
                                    ">
                                    {{ scope.row.title }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column width="120">
                            <template #default="scope">
                                <el-tag
                                    style="user-select: none"
                                    size="small"
                                    >{{
                                        `| 签名${0}p | 照片${
                                            scope.row.pictures.length
                                        }p`
                                    }}</el-tag
                                >
                            </template>
                        </el-table-column>
                        <el-table-column width="100">
                            <template #default="scope">
                                <span style="user-select: none">
                                    {{
                                        `${scope.row.createTime.getFullYear()}/${scope.row.createTime.getMonth()}/${scope.row.createTime.getDate()}`
                                    }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column width="50">
                            <template #default="scope">
                                <el-popover placement="top" trigger="hover">
                                    <el-button
                                        type="primary"
                                        plain
                                        @click="() => previewPlay(scope.row)"
                                        >播放</el-button
                                    >
                                    <template #reference>
                                        <el-button
                                            class="iconButton"
                                            @click="
                                                () => previewPlay(scope.row)
                                            "
                                            circle>
                                            <img
                                                class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Play.svg" />
                                        </el-button>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column width="50"
                            ><!--Copy-->
                            <template #default="scope">
                                <el-popover placement="top" trigger="hover">
                                    <el-button
                                        type="primary"
                                        plain
                                        @click="() => copySharedLink(scope.row)"
                                        >复制分享码</el-button
                                    >
                                    <template #reference>
                                        <el-button
                                            class="iconButton"
                                            @click="
                                                () => copySharedLink(scope.row)
                                            "
                                            circle>
                                            <img
                                                class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Copy.svg" />
                                        </el-button>
                                    </template>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="" width="50">
                            <template #default="scope">
                                <el-popover
                                    style="
                                        box-shadow: var(--el-box-shadow-dark);
                                    "
                                    placement="bottom"
                                    :width="'auto'"
                                    trigger="click">
                                    <template #reference>
                                        <el-button circle>
                                            <el-icon>
                                                <MoreFilled />
                                            </el-icon>
                                        </el-button>
                                    </template>
                                    <el-row>
                                        <el-button
                                            class="iconButton"
                                            @click="edit(scope.row)"
                                            circle>
                                            <img
                                                style="
                                                    width: 20px;
                                                    height: 20px;
                                                "
                                                class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Edit.svg" />
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <el-button class="iconButton" circle>
                                            <img
                                                style="
                                                    width: 20px;
                                                    height: 20px;
                                                "
                                                class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Share.svg" />
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <el-button
                                            class="iconButton"
                                            @click="editResource(scope.row)"
                                            circle>
                                            <img
                                                style="
                                                    width: 20px;
                                                    height: 20px;
                                                "
                                                class="icon-small icon-canClick"
                                                src="../../assets/Main/Activity/Resource.svg" />
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <el-button
                                            class="iconButton"
                                            plain
                                            type="danger"
                                            circle>
                                            <el-icon
                                                style="
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
        <el-dialog
            v-model="editActivity.onEditInfo"
            title="修改信息"
            align-center
            width="50%">
            <div>
                <el-form
                    v-if="editActivity.onEditInfo"
                    label-position="right"
                    style="margin-right: 20px"
                    :model="editActivity.target"
                    :rules="editActivity.rules">
                    <el-form-item prop="title" label="活动标题">
                        <el-input
                            placeholder="请输入文字"
                            v-model="editActivity.target.title" />
                    </el-form-item>
                    <el-form-item label="标题颜色">
                        <el-color-picker
                            v-model="editActivity.target.titleColor" />
                    </el-form-item>
                    <el-form-item label="照片滚动速度">
                        <el-radio-group
                            v-model="editActivity.target.pictureSpeed">
                            <el-radio
                                v-for="item in speeds"
                                :key="item"
                                :label="item"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="签名滚动速度">
                        <el-radio-group v-model="editActivity.target.signSpeed">
                            <el-radio
                                v-for="item in speeds"
                                :key="item"
                                :label="item"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="签名滚动效果">
                        <el-popover
                            placement="right"
                            :width="400"
                            trigger="click">
                            <template #reference>
                                <el-button style="padding: 0; border: none">
                                    <img
                                        style="width: 30px; height: 30px"
                                        src="../../assets/Main/NewActivity/RowEffect.svg" />
                                </el-button>
                            </template>
                            <el-select
                                v-model="editActivity.target.rollEffect"
                                placeholder="选择效果">
                                <el-option
                                    v-for="item in effects"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{
                                        item.label
                                    }}</span>
                                </el-option>
                            </el-select>
                        </el-popover>
                    </el-form-item>
                </el-form>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelEdit">取消</el-button>
                    <el-button type="primary" @click="cancelEdit">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog
            v-model="editActivity.onEditResource"
            title="修改资源"
            align-center
            width="50%">
            <div>
                <el-form
                    v-if="editActivity.onEditResource"
                    label-position="right"
                    style="margin-right: 20px"
                    :model="editActivity.target">
                    <el-form-item prop="logo" label="活动LOGO">
                        <el-upload
                            v-if="editActivity.target.logoUrl == String()"
                            class="avatar-uploader"
                            action="#"
                            :limit="1"
                            :accept="accpetance"
                            :on-change="uploadLogo"
                            :on-remove="removeLogo"
                            :auto-upload="false"
                            list-type="picture-card">
                            <el-icon
                                id="logoUpload"
                                class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                        <img v-else :src="editActivity.target.logoUrl" style="width:100px;height:100px;">
                    </el-form-item>
                    <el-form-item label="活动背景">
                        <el-upload
                            class="avatar-uploader"
                            action="#"
                            :limit="1"
                            :accept="accpetance"
                            :on-change="uploadBackground"
                            :on-remove="removeBackground"
                            :auto-upload="false"
                            list-type="picture-card">
                            <el-icon
                                id="backgroundUpload"
                                class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="上传照片墙">
                        <template #label>
                            <el-popover
                                placement="left"
                                :width="'auto'"
                                trigger="hover">
                                <template #reference>
                                    <label
                                        style="
                                            user-select: auto;
                                            pointer-events: all;
                                        "
                                        >上传照片墙</label
                                    >
                                </template>
                                <el-button
                                    id="PopRemoveAll"
                                    @click="
                                        () => {
                                            this.$refs.pictureWall.clearFiles();
                                            activity.pictures = [];
                                        }
                                    "
                                    type="danger"
                                    >清空</el-button
                                >
                            </el-popover>
                        </template>

                        <el-popover placement="right" trigger="click">
                            <template #reference>
                                <el-button
                                    ref="cleanRef"
                                    style="padding: 0; border: none">
                                    <img
                                        style="width: 30px; height: 30px"
                                        src="../../assets/Main/NewActivity/UploadFile.svg" />
                                </el-button>
                            </template>
                            <el-upload
                                style="max-width: 440px"
                                ref="pictureWall"
                                multiple
                                action="#"
                                :auto-upload="false"
                                :accept="accpetance"
                                :on-change="uploadPicture"
                                :on-remove="removePicture"
                                list-type="picture-card">
                                <el-icon class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
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
import { ComponentKey } from "@/utils/Definition";
import { Activity } from "@/utils/Activity";
import { EffectLabel } from "@/utils/Animation";
import Request from "@/utils/Request";
export default {
    inject: [ComponentKey.Activities, ComponentKey.PlayActicity],
    data() {
        return {
            accpetance: "image/png,image/jpg,image/jpeg",
            loading: false,
            styles: {
                smallButton: "border:none;padding:0;",
            },
            speeds: ["1x", "2x", "3x"],
            effects: EffectLabel.getList(),
            /**
             * @type {Activity[]}
             */
            cache: this[ComponentKey.Activities],
            /**
             * @type {Activity[]}
             */
            preview: this[ComponentKey.PlayActicity],
            /**
             * @type {Activity[]}
             */
            activitiesForShow: [],
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
        };
    },
    beforeMount() {
        if (this.cache.length > 0) {
            this.loading = true;
            let vue = this;
            setTimeout(() => {
                vue.cache.forEach((x) => {
                    vue.activitiesForShow.push(x);
                });
                vue.loading = false;
            }, 200);
        }
    },
    methods: {
        selectHandler(...args) {
            console.log(args);
        },
        uploadLogo(file){ this.editActivity.target.uploadLogo(file); },
        removeLogo(){ this.editActivity.target.removeLogo(); },
        uploadBackground(file){ this.editActivity.target.uploadBackground(file); },
        removeBackground(){ this.editActivity.target.removeBackground(); },
        uploadPicture(file){ this.editActivity.target.uploadPicture(file); },
        removePicture(file){ this.editActivity.target.removePicture(file); },
        /**
         *
         * @param {string} queryString
         * @param {function} callback
         */
        getSuggests(queryString, callback) {
            let sel = [];
            let str = queryString == "null" ? "" : queryString.trim();
            this.activitiesForShow.forEach((x) => {
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
            this.preview = target;
            this.$emit(`onSetActivity`, target);
        },
        /**
         *
         * @param {Activity} target
         */
        edit(target) {
            this.editActivity.onEditInfo = true;
            this.editActivity.target = target.Copy;
        },
        cancelEdit() {
            this.editActivity.onEditInfo = false;
            this.editActivity.onEditResource = false;
            this.editActivity.target = null;
        },
        confirmEdit() {
            if (this.editActivity.onEditInfo) {
                this.editActivity.target.changeInfo();
                this.editActivity.onEditInfo = false;
            }
            if (this.editActivity.onEditResource) {
                this.editActivity.target.changeResource();
                this.editActivity.onEditResource = false;
            }
        },
        /**
         *
         * @param {Activity} target
         */
        editResource(target) {
            this.editActivity.onEditResource = true;
            this.editActivity.target = target.Copy;
        },
    },
};
</script>

<style lang="scss">
.iconButton {
    padding: 0;
    border: none !important;
    margin: 1px;
}

.el-popover {
    .iconButton {
        height: 32px;
        width: 32px;
    }
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
