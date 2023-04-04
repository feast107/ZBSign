const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
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
