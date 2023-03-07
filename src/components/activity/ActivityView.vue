<template>
    <el-empty
        v-if="this.preload.length == 0"
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
                style="box-shadow: var(--el-box-shadow-light); width: 80%"
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
                    <span class="link">{{ item.link }}</span>
                </template>
            </el-autocomplete>
        </el-row>
        <el-row id="MainList">
            <el-scrollbar
                v-loading="this.loading"
                style="width: 100%; padding-right: 10px">
                <el-table stripe :data="activities" style="width: 100%">
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
                            <el-tag style="user-select: none" size="small">{{
                                `| 签名${0}p | 照片${
                                    scope.row.pictures.length
                                }p`
                            }}</el-tag>
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
                                    @click="
                                        () => {
                                            previewPlay(scope.row);
                                        }
                                    "
                                    >播放</el-button
                                >
                                <template #reference>
                                    <el-button
                                        class="iconButton"
                                        @click="
                                            () => {
                                                previewPlay(scope.row);
                                            }
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
                                    @click="
                                        () => {
                                            copySharedLink(scope.row);
                                        }
                                    "
                                    >复制分享码</el-button
                                >
                                <template #reference>
                                    <el-button
                                        class="iconButton"
                                        @click="
                                            () => {
                                                copySharedLink(scope.row);
                                            }
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
                                style="box-shadow: var(--el-box-shadow-dark)"
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
                                    <el-button class="iconButton" circle>
                                        <img
                                            style="width: 20px; height: 20px"
                                            class="icon-small icon-canClick"
                                            src="../../assets/Main/Activity/Edit.svg" />
                                    </el-button>
                                </el-row>
                                <el-row>
                                    <el-button class="iconButton" circle>
                                        <img
                                            style="width: 20px; height: 20px"
                                            class="icon-small icon-canClick"
                                            src="../../assets/Main/Activity/Share.svg" />
                                    </el-button>
                                </el-row>
                                <el-row>
                                    <el-button class="iconButton" circle>
                                        <img
                                            style="width: 20px; height: 20px"
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
                                            style="width: 20px; height: 20px">
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
</template>

<script>
import { ComponentKey } from "@/utils/Definition";
import { Activity } from "@/utils/Activity";
export default {
    inject: [ComponentKey.Activities, ComponentKey.PlayActicity],
    data() {
        return {
            loading: false,
            styles: {
                smallButton: "border:none;padding:0;",
            },
            preload: this[ComponentKey.Activities],
            /**
             * @type {Array<Activity>}
             */
            preview: this[ComponentKey.PlayActicity],
            /**
             * @type {Array<Activity>}
             */
            activities: [],
            searchPattern: null,
        };
    },
    beforeMount() {
        if (this.preload.length > 0) {
            this.loading = true;
            setTimeout(() => {
                this.preload.forEach((x) => {
                    this.activities.push(x);
                });
                this.loading = false;
            }, 1000);
        }
    },
    methods: {
        selectHandler() {},
        /**
         * 
         * @param {string} queryString 
         * @param {function} callback 
         */
        getSuggests(queryString, callback) {
            let sel = [];
            let str = queryString == "null" ? ""  : queryString.trim();
            this.activities.forEach((x) =>
            {
                if(str != "" && !x.title.startsWith(str))return;
                if(sel.findIndex(i => i.value == x.title) >= 0)return;
                sel.push({ value: x.title, link: "" })
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
    },
};
</script>

<style lang="scss">
.iconButton {
    padding: 0;
    border: none !important;
    margin: 1px;
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
