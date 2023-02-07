<template>
    <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in 6" :key="item">
            <h3 text="2xl" justify="center">{{ item }}</h3>
        </el-carousel-item>
    </el-carousel>

    <el-upload
    v-model:file-list="FileList" 
    multiple 
    :action="PictureUrl"
    class="upload-demo" 
    accept="image/png,image/jpg,image/jpeg" 
    :list-type="'picture-card'" 
    :limit="3"
    :auto-upload="true" :on-preview="(file) => { this.Preview(file) }"
    :on-exceed="() => { debugger; this.log(arguments) }">
        <el-icon  class="el-icon--upload"><PictureFilled /></el-icon>
        <template #tip>
            <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
            </div>
        </template>
    </el-upload>
    <el-dialog v-model="Previewer.Visible">
        <img style="max-width:95%;max-height:95%;" w-full :src="Previewer.Url" alt="Preview Image" />
    </el-dialog>
</template>

<script>
import Request from '../utils/Request';
export default {
    created(){
        debugger;
        Request.get("http://localhost:5148/Picture/Get")
        .then(r=>console.log(r))
        .catch(e=>console.error(e))
    },
    data() {
        return {
            FileList: [],
            Previewer: { Visible: false, Url: null },
            PictureUrl: "http://localhost:5148/Picture/Upload"
        }
    },
    methods: {
        log(...args) { debugger; console.log(args[0]) },
        HandlePreview() { debugger; console.log(arguments) },
        HandleRemove() { debugger; console.log(arguments) },
        BeforeRemove() { debugger; console.log(arguments) },
        HandleExceed() { debugger; console.log(arguments) },
        Preview(file) {
            this.Previewer.Url = file.url;
            this.Previewer.Visible = true;
        }
    },
    props: {
    }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>