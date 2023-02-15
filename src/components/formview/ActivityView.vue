<template>
    <el-scrollbar>
        <el-form :model="form" label-width="120px" style="margin-right: 20px">
            <el-form-item label="活动标题">
                <el-input placeholder="请输入文字" />
            </el-form-item>
            <el-form-item label="标题颜色">
                <el-color-picker v-model="form.titleColor" />
            </el-form-item>
            <el-form-item label="活动LOGO">
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
                    <template #file="{ file }">
                        <img style="width:20px;height:20px" class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item label="上传照片墙">
                <el-upload
                    action="#"
                    :auto-upload="false"
                    multiple
                    list-type="picture-card">
                    <el-icon  class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="照片滚动速度">
                <el-radio-group v-model="form.speed">
                    <el-radio label="1x" />
                    <el-radio label="2x" />
                    <el-radio label="3x" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="签名滚动速度">
                <el-radio-group v-model="form.signSpeed">
                    <el-radio label="1x" />
                    <el-radio label="2x" />
                    <el-radio label="3x" />
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">Create</el-button>
                <el-button>Cancel</el-button>
            </el-form-item>
        </el-form>
    </el-scrollbar>
</template>

<script>
export default {
    data() {
        return {
            accpetance: "image/png,image/jpg,image/jpeg",
            form: {
                titleColor: "#000",
                pictureSpeed: null,
                signSpeed: null,
                logo:null,
                background:null,
            },
        };
    },
    methods:{
        logoUpload(file){ 
            this.form.logo = file;
            document.getElementById('logoUpload').parentElement.style.display = "none";
        },
        logoRemove(){ 
            this.form.logo = null;
            document.getElementById('logoUpload').parentElement.style.display = "";
        },
        backgroundUpload(file){
            this.form.background = file;
            document.getElementById('backgroundUpload').parentElement.style.display = "none";
        },
        backgroundRemove(){
            this.form.background = null;
            document.getElementById('backgroundUpload').parentElement.style.display = "";
        }
    }
};
</script>

<style>
.el-form-item {
    margin-top: 20px !important;
}
.el-upload-list--picture-card {
    --el-upload-list-picture-card-size: 100px !important;
}
</style>
