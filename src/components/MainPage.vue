<template>
    <div class="Main">
        <div id="Fore">
            <el-container>
                <el-aside style="overflow:hidden">
                    <div style="width: 100%; ">
                        <div style="padding:20px">
                            <el-row style="user-select: none;">
                                <img src="../assets/Main/Logo.svg" />
                            </el-row>
                            <el-row justify="center">
                                <el-col :span="8">
                                    <el-button text style="font-size:small">当前账号:</el-button>
                                </el-col>
                                <el-col :span="10">
                                    <el-button text type="primary">{{ this.user.phoneNumber }}</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <el-menu default-active="1" @select="selectMenu">
                        <el-menu-item-group>
                            <el-menu-item index="1">
                                <el-row justify="center">
                                    <el-row justify="center">
                                        <img class="menu-logo" src="../assets/Main/NewActive.svg" />
                                    </el-row>
                                    <el-row justify="center">
                                        <label class="menu-text">新建活动</label>
                                    </el-row>
                                </el-row>
                            </el-menu-item>
                            <el-menu-item index="2">
                                <el-row justify="center">
                                    <el-row justify="center">
                                        <img class="menu-logo" src="../assets/Main/ActiveList.svg" />
                                    </el-row>
                                    <el-row justify="center">
                                        <label class="menu-text">活动列表</label>
                                    </el-row>
                                </el-row>
                            </el-menu-item>
                            <el-menu-item index="3">
                                <el-row justify="center">
                                    <el-row justify="center">
                                        <img class="menu-logo" src="../assets/Main/SmartPen.svg" />
                                    </el-row>
                                    <el-row justify="center">
                                        <label class="menu-text">智能笔</label>
                                    </el-row>
                                </el-row>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-menu>
                </el-aside>
                <el-main>
                    <div id="MainCard">
                        <NewActivityView v-if="this.select == this.menu[0]" />
                        <ActivityView v-if="this.select==this.menu[1]"/>
                    </div>
                </el-main>
            </el-container>
        </div>
        <div id="Back"></div>
</div>
</template>
<script>
import { ComponentKey } from "@/utils/Definition";
import ActivityView from "./activity/ActivityView.vue";
import NewActivityView from "./activity/NewActivityView.vue";
export default {
    components: {
        NewActivityView,
        ActivityView
    },
    inject: [ComponentKey.User],
    data() {
        this[ComponentKey.User].phoneNumber = "1771***807";
        return {
            menu: ['新建活动', '活动列表', '智能笔'],
            select: '新建活动',
            user: this[ComponentKey.User]
        }
    },
    methods: {
        selectMenu() {
            this.select = this.menu[Number.parseInt(arguments[0]) - 1]
        }
    }

};
</script>
<style scoped lang="scss">
img {
    position: unset !important;
    pointer-events: none;
}

svg {
    position: unset !important;
}

.Main {
    background-color: #f3f6fb;
    height: 100%;
    width: 100%;
}

#Fore {
    height: 100% !important;
    overflow: hidden;
    z-index: 1 !important;
    position: fixed;
    left: 0;
    right: 0;
}

#Back {
    z-index: 0 !important;
    height: 300px;
    width: 500px;
    position: fixed;
    top: 0;
    right: 0;
    float: right;
    background-image: url(../assets/Main/Dot.svg);
}

.el-menu-item {
    .el-row {
        user-select: none;
    }
}

.el-container {
    height: 100% !important;
    overflow: hidden;
    z-index: 0 !important;
}

.el-aside {
    height: 100% !important;
    width: 25% !important;
}

.el-menu {
    background-color: transparent !important;
    height: calc(100% - 150px) !important;

    .el-row {
        height: 100%;
        width: 100%;
    }
}

.el-menu-item {
    height: auto !important;
    padding-bottom: 8px;
    padding-top: 8px;
}

.is-active {
    background-color: #0073ff !important;

    .menu-text {
        color: #f3f6fb;
    }

    .menu-logo {
        filter: drop-shadow(10000px 0 0 white);
        transform: translate(-10000px);
    }
}

.menu-text {
    font-size: 17px !important;
    color: #525252;
    font-family: "Microsoft YaHei";
    line-height: initial;
    padding-bottom: 5px;
}

.menu-logo {
    height: 70px;
    width: 70px;
    filter: drop-shadow(1000px 0 0 #737478);
    transform: translate(-1000px);
}

.el-main {
    margin-top: 30px;
    padding-left: 0 !important;
    height: 100%;
    overflow: hidden !important;
}

#MainCard {
    height: calc(100% - 40px);
    background-color: white;
    border-radius: 20px;
    border-color: #e5e5e8;
    border-width: 1px !important;
    border-style: solid;
    padding: 20px;
    margin: 0;
    box-shadow: var(--el-box-shadow);

    .el-card__body {
        height: calc(100% - 40px) !important;
    }
}

.el-card__body {
    height: inherit !important;
}
</style>
