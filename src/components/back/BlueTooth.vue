<template>
    <el-card v-if="this.Show" :style="{ boxShadow: `var(--el-box-shadow-dark)` }" shadow="always">
        <el-collapse v-model="Activate" style="border:none ;border-width: 0;">
            <el-collapse-item style="border:none ;border-width: 0;" name="main">
                <template #title>
                    <el-button loading text 
                    class="el-icon--right">
                        <td class="color-dark-light">智能笔连接</td>
                    </el-button>
                </template>
                <el-table :data="BlueTooth" max-height="250">
                    <el-table-column prop="deviceId" label="编号" width="150" />
                    <el-table-column prop="deviceName" label="名称" width="150" />
                    <el-table-column  label="操作" width="100">
                        <template #default="scope">
                            <el-button type="primary" plain style="width:100%;"
                            :disabled="this.TryingToConnect"
                            :loading="scope.row.IsConnecting"
                            @click="SelectDevice(scope.row)">
                                连接
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button 
                type="danger" 
                size="small" 
                style="float:right;width: 50px;margin-top: 10px;"
                @click="CancelSelect()"
                :disabled="this.BlueTooth.length==0">
                    取消
                </el-button>
            </el-collapse-item>
        </el-collapse>
    </el-card>
</template>

<script>
import { ComponentKey, IpcMessage, ConnectStatus, Bridges } from '../../utils/Definition'
export default {
    name: 'BlueTooth',
    inject: [ComponentKey.Dotpen],
    data() {
        return {
            Dotpen: this[ComponentKey.Dotpen],
            BlueTooth: [],
            TryingToConnect: false,
            Show: false,
            Activate:['main']
        }
    },
    watch: {
        Dotpen: {
            handler: function (_, newPen) {
                switch (newPen.$ConnectStatus) {
                    case ConnectStatus.Connected:
                        this.Show = false;
                        this.BlueTooth = [];
                        this.TryingToConnect = false;
                        break;
                    case ConnectStatus.Connecting:
                        this.Show = true;
                        this.TryingToConnect = false;
                        break;
                    case ConnectStatus.Disconnected:
                        this.Show = false;
                        this.BlueTooth = [];
                        this.TryingToConnect = false;
                        break;
                }
            },
            deep: true
        }
    },
    created() {
        window[Bridges.Dispatcher].listen(IpcMessage.BlueToothList, (list) => {
            if (!this.TryingToConnect) {
                this.BlueTooth = list[0];
            }
        })
    },
    methods: {
        SelectDevice(device) {
            this.TryingToConnect = true;
            device.IsConnecting = true;
            window[Bridges.Dispatcher].invoke(IpcMessage.BlueToothSelect, device.deviceId);
        },
        CancelSelect() {
            window[Bridges.Dispatcher].invoke(IpcMessage.BlueToothCancel);
            this.Dotpen.$ConnectStatus = ConnectStatus.Disconnected;
        }
    }
}
</script>
<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

.el-collapse{
    --el-collapse-border-color:#fff,
}
</style>
