<template>
    <el-scrollbar v-loading="submitting" style="margin-right: 1px">
        <el-form :model="activity" :rules="rules" label-width="120px" ref="activeForm" style="margin-right: 20px">
            <el-form-item label="活动本子" prop="bookId">
                <!-- <el-popover placement="right" @show="this.$refs.book.toggleMenu()" :width="400" trigger="click">
                    <template #reference>
                        <el-button style="padding: 0; border: none">
                            <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/Book.svg" />
                        </el-button>
                    </template> -->
                    <el-select ref="book" v-model="activity.bookId" placeholder="选择本子">
                        <el-option v-for="item in config.books" :key="item.bookId" :label="item.bookName"
                            :value="item.bookId" style="max-height:unset;height:unset">
                            <el-image style="width:200px" :src="item.coverUrl"></el-image>
                        </el-option>
                    </el-select>
                <!-- </el-popover> -->
            </el-form-item>

            <el-form-item prop="title" label="活动标题">
                <el-row>
                    <el-col :span="12">
                        <el-input placeholder="请输入文字" v-model="activity.title" />
                    </el-col>
                    <el-col :span="6">
                        <el-color-picker v-model="activity.titleColor" :predefine="config.colors"/>
                    </el-col>
                    <el-col :span="6">
                        <el-slider :min="config.minSize" :max="config.maxSize" style="width:200px" v-model="activity.titleSize" />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item prop="subTitle" label="活动副标题">
                <el-row>
                    <el-col :span="12">
                        <el-input placeholder="可以置空" v-model="activity.subTitle" />
                    </el-col>
                    <el-col :span="6">
                        <el-color-picker v-model="activity.subTitleColor" :predefine="config.colors"/>
                    </el-col>
                    <el-col :span="6">
                        <el-slider :min="config.minSize" :max="config.maxSize" style="width:200px" v-model="activity.subTitleSize" />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item prop="font" label="标题字体">
                <!-- <el-popover placement="right" :width="400" trigger="click" @show="() => { this.$refs.font.toggleMenu() }">
                    <template #reference>
                        <el-button style="padding: 0; border: none">
                            <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/Font.svg" />
                        </el-button>
                    </template> -->
                    <el-select ref="font" v-model="activity.font" placeholder="选择字体">
                        <el-option v-for="item in config.fonts" :key="item.dictValue" :label="item.dictName"
                            :value="item.dictValue">
                            <span :style="`float: left;font-family:'${item.dictName}'`">{{ item.dictName }}</span>
                        </el-option>
                    </el-select>
                <!-- </el-popover> -->
            </el-form-item>

            <el-form-item prop="logo" label="活动LOGO">
                <el-upload class="avatar-uploader" action="#" :limit="1" :accept="accpetance" :on-change="logoUpload"
                    :on-remove="logoRemove" :auto-upload="false" list-type="picture-card">
                    <el-icon id="logoUpload" class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="活动背景">
                <el-upload class="avatar-uploader" action="#" :limit="1" :accept="accpetance" :on-change="backgroundUpload"
                    :on-remove="backgroundRemove" :auto-upload="false" list-type="picture-card">
                    <el-icon id="backgroundUpload" class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="上传照片墙">
                <template #label>
                    <el-popover placement="left" :width="'auto'" trigger="hover">
                        <template #reference>
                            <label style="user-select: auto; pointer-events: all">上传照片墙</label>
                        </template>
                        <el-button id="PopRemoveAll" @click="
                            () => {
                                this.$refs.pictureWall.clearFiles();
                                activity.pictures = [];
                            }
                        " type="danger">清空</el-button>
                    </el-popover>
                </template>

                <el-popover placement="right" trigger="click">
                    <template #reference>
                        <el-button ref="cleanRef" style="padding: 0; border: none">
                            <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/UploadFile.svg" />
                        </el-button>
                    </template>
                    <el-scrollbar :max-height="500">
                        <el-upload style="max-width: 440px" ref="pictureWall" multiple action="#" :auto-upload="false"
                            :accept="accpetance" :on-change="pictureUpload" :on-remove="pictureRemove"
                            list-type="picture-card">
                            <el-icon class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-scrollbar>
                </el-popover>
            </el-form-item>
            <el-form-item label="照片滚动速度">
                <el-radio-group v-model="activity.pictureSpeed">
                    <el-radio v-for="item in speeds" :key="item" :label="item"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="签名滚动速度">
                <el-radio-group v-model="activity.signSpeed">
                    <el-radio v-for="item in speeds" :key="item" :label="item"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="rollEffect" label="签名滚动效果">
                <!-- <el-popover @show="this.$refs.rollEffect.toggleMenu()" placement="right" :width="400" trigger="click">
                    <template #reference>
                        <el-button style="padding: 0; border: none">
                            <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/RowEffect.svg" />
                        </el-button>
                    </template> -->
                    <el-select ref="rollEffect" v-model="activity.rollEffect" placeholder="选择效果">
                        <el-option v-for="item in effects" :key="item.value" :label="item.label" :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                        </el-option>
                    </el-select>
                <!-- </el-popover> -->
            </el-form-item>

            <el-form-item prop="border" label="签名边框">
                <!-- <el-popover placement="right" @show="this.$refs.border.toggleMenu()" :width="400" trigger="click">
                    <template #reference>
                        <el-button style="padding: 0; border: none">
                            <img style="width: 30px; height: 30px" src="../../assets/Main/NewActivity/Border.svg" />
                        </el-button>
                    </template> -->
                    <el-select ref="border" v-model="activity.border" placeholder="选择边框">
                        <el-option v-for="item in config.borders" :key="item.dictValue" :label="item.dictName"
                            :value="item.dictValue">
                            <el-image style="width:200px;" :src="item.rightBorder" />
                        </el-option>
                    </el-select>
                <!-- </el-popover> -->
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm">创建</el-button>
            </el-form-item>
        </el-form>
    </el-scrollbar>
</template>

<script>
import { Activity } from "@/utils/Activity";
import { EffectLabel } from "@/utils/Animation";
import { ComponentKey } from "@/utils/Definition";
import { DomElement } from "@/utils/Events";
export default {
    components: {
    },
    inject: [ComponentKey.Activities],
    created() {
        window.activity = this.activity;
    },
    data() {
        return {
            accpetance: "image/png,image/jpg,image/jpeg",
            speeds: ["1x", "2x", "3x"],
            effects: EffectLabel.getList(),
            /**
             * @type {Activity}
             */
            activity: new Activity(),
            rules: Activity.rules(),
            submitting: false,
            config: this[ComponentKey.Activities]
        };
    },
    methods: {
        logoUpload(file) {
            this.activity.uploadLogo(file);
            DomElement.changeIconParent("logoUpload", DomElement.hidden);
        },
        logoRemove() {
            this.activity.removeLogo();
            DomElement.changeIconParent("logoUpload", DomElement.display);
        },
        pictureUpload(file) {
            this.activity.uploadPicture(file);
        },
        pictureRemove(file) {
            this.activity.removePicture(file);
        },
        backgroundUpload(file) {
            this.activity.uploadBackground(file)
            DomElement.changeIconParent("backgroundUpload", DomElement.hidden);
        },
        backgroundRemove() {
            this.activity.removeBackground();
            DomElement.changeIconParent("backgroundUpload", DomElement.display);
        },
        submitForm() {
            this.$refs.activeForm.validate()
                .then(async r => {
                    this.submitting = true;
                    let a = await this.activity.create();
                    if (a.code == 1) {
                        this.$message.success("创建成功");
                        this.$emit(`onJumpToList`);
                    } else {
                        this.$message.error("创建失败," + a.msg);
                    }
                    this.submitting = false;
                }).catch(e => {
                    this.$message.warning("请填写缺失的项目")
                });

        },
    },
};
</script>

<style>
.el-form-item {
    margin-top: 20px !important;
}

.el-upload-list--picture-card {
    --el-upload-list-picture-card-size: 100px !important;
}

.el-upload--picture-card {
    --el-upload-picture-card-size: 100px !important;
}

.el-popover.el-popper {
    min-width: 50px !important;
}
</style>
