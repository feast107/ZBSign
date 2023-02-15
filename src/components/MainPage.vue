<template>
    <div class="Main">
        <div id="SideDot"></div>

        <el-container>
            <el-aside>
                <div style="width:100%;height: 150px;">
                </div>
                <el-menu :default-openeds="['1']">
                    <el-menu-item-group>
                        <el-menu-item index="1-1">新建活动</el-menu-item>
                        <el-menu-item index="1-2">活动列表</el-menu-item>
                        <el-menu-item index="1-3">智能笔</el-menu-item>
                    </el-menu-item-group>
                </el-menu>
            </el-aside>
            <el-main>
                <el-card :style="{ borderRadius: `var(--el-border-radius-round) ` }">
                    <ActivityView />
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>  
<script>
import ActivityView from './formview/ActivityView.vue';
export default {
    components: {
        ActivityView,
    }
}
</script>
<style>
.Main {
    background-color: #f3f6fb;
    height: 100%;
    width: 100%;
}

.el-container {
    height: 100% !important;
    overflow: hidden;
    z-index: 0;
}

.el-aside {
    height: 100% !important;
    width: 25% !important;
}

.el-menu {
    background-color: transparent !important;
    height: calc(100% - 150px) !important;
}

.is-active {
    background-color: #0073ff !important;
}

.el-main {
    margin-top: 30px;
    padding-left: 0 !important;
    height: 100%;
    overflow: hidden !important;
}

.el-card {
    height: 100%;
}

.el-card__body {
    height: calc(100% - 40px);
}

#SideDot {
    z-index: 1;
    height: 300px;
    width: 500px;
    position: fixed;
    top: 0;
    right: 0;
    float: right;
    background-image: url(../assets/Main/Dot.svg);
}
</style>