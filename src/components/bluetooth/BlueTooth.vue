<template>
    <el-card v-if="blueTooth.length > 0" :style="{ boxShadow: `var(--el-box-shadow-dark)` }" shadow="always">
        <el-table :data="blueTooth" style="height: 400px;">
            <el-table-column prop="deviceId" label="编号" width="150" />
            <el-table-column prop="deviceName" label="名称" width="150" />
            <el-table-column prop="deviceName" label="事件" width="70">
                <template #default="scope">
                    <el-button type="primary"  @click="SelectDevice(scope.row)">
                        连接
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { IpcMessage } from '../../utils/Definition'
export default {
    name: 'BlueTooth',
    data() {
        return {
            blueTooth:[],
        }
    },
    created() {
        window.$Dispatcher.listen(IpcMessage.BlueToothList, (list) => {
            this.blueTooth = list[0];
        })
        window.$Dispatcher.listen(IpcMessage.BlueToothFinish,()=>{
            this.blueTooth = [];
        })
    },
    setup() {
        window.$Dispatcher;
    },
    methods:{
        SelectDevice(device){ 
            console.log(device.deviceId);
            window.$Dispatcher.invoke(IpcMessage.BlueToothSelect,device.deviceId);
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
</style>
