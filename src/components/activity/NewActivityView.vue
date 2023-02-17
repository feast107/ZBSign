<template>
    <el-scrollbar style="margin-right: 1px">
        <el-form :model="model" :rules="rules" label-width="120px" ref="activeForm" style="margin-right: 20px">
            <el-form-item prop="title" label="活动标题">
                <el-input placeholder="请输入文字" v-model="this.model.title" />
            </el-form-item>
            <el-form-item label="标题颜色">
                <el-color-picker v-model="this.model.titleColor" />
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
            <el-form-item  label="上传照片墙">
                <template #label>
                    <el-popover placement="left" :width="'auto'" trigger="hover">
                        <template #reference>
                            <label style="user-select:auto;pointer-events: all;">上传照片墙</label>
                        </template>
                        <el-button id="PopRemoveAll" @click="
                            () => {
                                this.$refs.pictureWall.clearFiles();
                                this.model.pictures = [];
                            }
                        " type="danger">清空</el-button>
                    </el-popover>
                </template>
                <el-upload ref="pictureWall" multiple action="#" :auto-upload="false" :accept="accpetance"
                    :on-change="pictureUpload" :on-remove="pictureRemove" list-type="picture-card">
                    <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="照片滚动速度">
                <el-radio-group v-model="this.model.pictureSpeed">
                    <el-radio label="1x" />
                    <el-radio label="2x" />
                    <el-radio label="3x" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="签名滚动速度">
                <el-radio-group v-model="this.model.signSpeed">
                    <el-radio label="1x" />
                    <el-radio label="2x" />
                    <el-radio label="3x" />
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">预览</el-button>
                <el-button type="primary" @click="submitForm">创建</el-button>
            </el-form-item>
        </el-form>
</el-scrollbar>
</template>

<script>
import { Activity } from "@/utils/Activity";
import { ComponentKey } from "@/utils/Definition";
import Request from "@/utils/Request";
export default {
    inject: [ComponentKey.Http],
    data() {
        return {
            accpetance: "image/png,image/jpg,image/jpeg",
            model:new Activity(),
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        logoUpload(file) {
            this.model.logo = file.raw;
            document.getElementById("logoUpload").parentElement.style.display =
                "none";
        },
        logoRemove() {
            this.model.logo = null;
            document.getElementById("logoUpload").parentElement.style.display =
                "";
        },
        pictureUpload(file) {
            this.model.pictures.push(file.raw);
        },
        pictureRemove(file) {
            let index = this.model.pictures.findIndex(
                (x) => x.uid == file.raw.uid
            );
            this.model.pictures.splice(index, 1);
        },
        backgroundUpload(file) {
            this.model.background = file.raw;
            document.getElementById(
                "backgroundUpload"
            ).parentElement.style.display = "none";
        },
        backgroundRemove() {
            this.model.background = null;
            document.getElementById(
                "backgroundUpload"
            ).parentElement.style.display = "";
        },
        submitForm() {
            console.log(this.model);
            Request.post(
                "http://192.168.101.32:9898/signservice/file/uploadFile",
                this.model.getFileForm(),
                {
                    method: "POST",
                    headers: { "Content-Type": "multipart/form-data" },
                    params: this.model.getDataQuery(),
                }
            )
                .then((t) => console.log(t))
                .catch((e) => console.log(e));
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
