const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    // devServer:{
    //     port : 15543,
    //     proxy: {
    //         '/signservice': {
    //             target: 'http://localhost:8999', //API服务器的地址
    //             ws: true,  //代理websockets
    //             changeOrigin: true, // 虚拟的站点需要更管origin
    //             pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
    //                 '^/signservice': ''
    //             }
    //         }
    //     },
    // },
    transpileDependencies: true,
    chainWebpack: (config) => {
        config.plugin('html').tap((args) => {
            args[0].title = '孜博汇签到程序';
            return args;
        })
    },
    pluginOptions: {
        electronBuilder: {
            name: "y",
            appId: "com.zbform.sign",
            productName: "孜博汇签到程序",
            preload: "src/preload.js",
        },
    },
});
