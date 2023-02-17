<template>
    <el-scrollbar style="margin-right: 1px">
        <el-form
            :model="form.dataForm"
            :rules="rules"
            label-width="120px"
            ref="activeForm"
            style="margin-right: 20px">
            <el-form-item prop="title" label="活动标题">
                <el-input
                    placeholder="请输入文字"
                    v-model="this.form.dataForm.title" />
            </el-form-item>
            <el-form-item label="标题颜色">
                <el-color-picker v-model="this.form.dataForm.titleColor" />
            </el-form-item>
            <el-form-item prop="logo" label="活动LOGO">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :limit="1"
                    :accept="accpetance"
                    :on-change="logoUpload"
                    :on-remove="logoRemove"
                    :auto-upload="false"
                    list-type="picture-card">
                    <el-icon id="logoUpload" class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="活动背景">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :limit="1"
                    :accept="accpetance"
                    :on-change="backgroundUpload"
                    :on-remove="backgroundRemove"
                    :auto-upload="false"
                    list-type="picture-card">
                    <el-icon id="backgroundUpload" class="avatar-uploader-icon">
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
                            <label>上传照片墙</label>
                        </template>
                        <el-button
                            id="PopRemoveAll"
                            @click="
                                () => {
                                    this.$refs.pictureWall.clearFiles();
                                    this.form.fileForm.files = [];
                                }
                            "
                            type="danger"
                            >清空</el-button
                        >
                    </el-popover>
                </template>
                <el-upload
                    ref="pictureWall"
                    multiple
                    action="#"
                    :auto-upload="false"
                    :accept="accpetance"
                    :on-change="pictureUpload"
                    :on-remove="pictureRemove"
                    list-type="picture-card">
                    <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="照片滚动速度">
                <el-radio-group v-model="this.form.dataForm.pictureSpeed">
                    <el-radio label="1x" />
                    <el-radio label="2x" />
                    <el-radio label="3x" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="签名滚动速度">
                <el-radio-group v-model="this.form.dataForm.signSpeed">
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
import { ComponentKey } from "@/utils/Definition";
import Request from "@/utils/Request";
export default {
    inject: [ComponentKey.Http],
    data() {
        return {
            accpetance: "image/png,image/jpg,image/jpeg",
            form: {
                dataForm: {
                    title: null,
                    titleColor: "#000",
                    pictureSpeed: "1x",
                    signSpeed: "1x",
                },
                fileForm: {
                    file1: null,
                    file2: null,
                    files: [],
                },
            },
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
            this.form.fileForm.logo = file.raw;
            document.getElementById("logoUpload").parentElement.style.display =
                "none";
        },
        logoRemove() {
            this.form.fileForm.logo = null;
            document.getElementById("logoUpload").parentElement.style.display =
                "";
        },
        pictureUpload(file) {
            this.form.fileForm.pages.push(file.raw);
        },
        pictureRemove(file) {
            let index = this.form.fileForm.pages.findIndex(
                (x) => x.uid == file.raw.uid
            );
            this.form.fileForm.pages.splice(index, 1);
        },
        backgroundUpload(file) {
            this.form.fileForm.background = file.raw;
            document.getElementById(
                "backgroundUpload"
            ).parentElement.style.display = "none";
        },
        backgroundRemove() {
            this.form.fileForm.background = null;
            document.getElementById(
                "backgroundUpload"
            ).parentElement.style.display = "";
        },
        submitForm() {
            console.log(this.form.dataForm);
            Request.post(
                "http://192.168.101.32:9898/signservice/file/uploadFile",
                Request.form(this.form.fileForm),
                {
                    method: "POST",
                    headers: { "Content-Type": "multipart/form-data" },
                    params: this.form.dataForm,
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
