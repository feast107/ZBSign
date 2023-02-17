<template>
    <el-empty
        v-if="this.activities.length == 0"
        style="height: 100%"
        description="暂无记录">
        <template #image>
            <img
                style="width: 100px; height: 100px"
                src="../../assets/Main/Activity/None.svg" />
        </template>
    </el-empty>
    <el-col  id="ActivityView" v-else style="height: 100%; width: 100%">
        <el-row justify="center" style="height: 50px; padding: 10px">
            <el-autocomplete
                id="AutoComplete"
                style="box-shadow: var(--el-box-shadow-light); width: 80%"
                v-model="state"
                :fetch-suggestions="querySearch"
                popper-class="my-autocomplete"
                placeholder="搜索活动"
                @select="handleSelect">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <search />
                    </el-icon>
                </template>
                <template #suffix>
                    <el-icon class="el-input__icon" @click="handleIconClick">
                        <edit />
                    </el-icon>
                </template>
                <template #default="{ item }">
                    <div class="value">{{ item.value }}</div>
                    <span class="link">{{ item.link }}</span>
                </template>
            </el-autocomplete>
        </el-row>
        <el-row id="MainList">
            <el-scrollbar>
                <ul class="infinite-list" style="overflow: auto">
                    <li
                        v-for="i in activities"
                        :key="i"
                        class="infinite-list-item">
                        <el-descriptions title="">
                            <el-descriptions-item label="">
                                <label
                                    style="font: bolder; font-weight: 1000"
                                    >{{ i.title }}</label
                                >
                            </el-descriptions-item>
                            <el-descriptions-item label="">
                                <el-tag size="small">{{
                                    `| 签名${0}p | 照片${i.pictures.length}p`
                                }}</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="">{{
                                `${i.createTime.getFullYear()}/${i.createTime.getMonth()}/${i.createTime.getDate()}`
                            }}</el-descriptions-item>
                        </el-descriptions>
                    </li>
                </ul>
            </el-scrollbar>
        </el-row>
    </el-col>
</template>

<script>
import { ComponentKey } from "@/utils/Definition";
export default {
    inject: [ComponentKey.Activities],
    data() {
        return {
            activities: this[ComponentKey.Activities],
        };
    },
};
</script>

<style lang="scss">
#ActivityView {
    #MainList {
        height: calc(100% - 50px);
        width: 100%;
    }

    .el-scrollbar {
        width: 100%;
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
}
</style>
