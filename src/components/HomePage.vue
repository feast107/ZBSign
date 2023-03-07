<template>
    <div class="background">
        <div class="login">
            <div class="insider">
                <el-form :model="form" style="height:100%;" ref="mainForm" :rules="rules">
                    <el-space fill direction="vertical" :size="16" style="width: 100%;height:100%">
                        <el-row >
                            <el-form-item prop="phoneNumber" style="width: 100%">
                                <el-input
                                    v-model="form.phoneNumber"
                                    clearable
                                    maxlength="11"
                                    controls="false"
                                    oninput="value=value.replace(/[^\d.]/g,'')"
                                    placeholder="手机号">
                                    <template #prefix>
                                        <el-icon class="el-input__icon">
                                            <img
                                                style="
                                                    width: 20px;
                                                    height: 20px;
                                                    margin-top: 3px;
                                                "
                                                src="../assets/Home/Phone.svg" />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-row>
                        <el-row >
                            <el-col :span="12">
                                <el-form-item prop="verifyCode" style="width: 100%;height:100%">
                                    <el-input
                                        placeholder="验证码"
                                        :disabled="!this.form.verifyCodeAquired"
                                        v-model="form.verifyCode"
                                        oninput="value=value.replace(/[^\d.]/g,'')"
                                        maxlength="6">
                                        <template #prefix>
                                            <el-icon class="el-input__icon">
                                                <img
                                                    style="
                                                        width: 20px;
                                                        height: 20px;
                                                        margin-top:3px;
                                                    "
                                                    src="../assets/Home/Shield.svg" />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :offset="2" :span="10">
                                <el-button
                                    :disabled="!this.form.canGetCode"
                                    @click="this.getVerifyCode()"
                                    style="width:100%; font-size: 10;"
                                    >获取验证码
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row >
                            <el-button style="width: 100%;" class="loginButton" @click="this.onLogin()">
                                登录
                            </el-button>
                        </el-row>
                    </el-space>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { ComponentKey } from '@/utils/Definition';
export default {
    inject:[ComponentKey.User],
    data() {
        return {
            form: {
                phoneNumber: "",
                verifyCode: "",
                verifyCodeAquired: false,
                canGetCode: false,
            },
            rules: {
                phoneNumber: [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: "blur",
                    },
                    {
                        min: 11,
                        message: "长度需要11位",
                        trigger: "blur",
                    },
                    {
                        validator: (rule, value, callback) => {
                            this.form.canGetCode = value.length == 11;
                            callback();
                        },
                        trigger: "change",
                    },
                ],
                verifyCode: [
                    {
                        required: true,
                        message: "请输入验证码",
                        trigger: "blur",
                    },
                    { min: 6, max: 6, message: "长度需要6位", trigger: "blur" },
                ],
            },
        };
    },
    methods: {
        getVerifyCode() {
            this.form.verifyCodeAquired = true;
        },
        onLogin() {
            this.$refs.mainForm.validate((v) => {
                if (v) {
                } else {
                    this.$message.error("表单验证失败");
                }
            });
        },
    },
};
</script>

<style scoped>
.background {
    height: 100%;
    width: 100%;
    background-image: url("../assets/Home/Background.svg");
    background-size: cover;
}

.login {
    text-align: center;
    position: absolute;
    width: 34%;
    height: 40%;
    margin-left: calc(50% - 17%);
    margin-top: calc(16%);
    background-image: url("../assets/Home/Card.png");
    background-size: cover;
    padding: 0;
}

.insider {
    padding-left: 20%;
    padding-right: 20%;
    padding-top: 15%;
    padding-bottom: 15%;
    height: 70%;
}

.loginButton{
    color: antiquewhite !important;
    background-color: #0f8bff !important;
}
.loginButton:hover{
    transition-delay: 0.1s;
    transition-duration: 0.3s;
    color:#0f8bff  !important;
    background-color: #abdbf8 !important;
}

.el-form-item {
    margin: 0 !important;
}

.el-input {
    height: 100%;
}

.el-button {
    height: 100% !important;
}
</style>
