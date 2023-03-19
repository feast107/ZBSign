const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    chainWebpack: config => {
        config.plugin('html').tap(
            args => {
                debugger;
                args[0].title = '孜博汇签到程序';
                return args;
            }
        )
    },
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            name: "孜博汇签到程序",
            appId: "com.zbform.sign",
            productName: "孜博汇签到程序",
            preload: "src/preload.js",
            chainWebpackMainProcess: (_) => { },
        },
    },
});
