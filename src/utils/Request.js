import axios from "axios";
/*创建axios 实例*/
const Request = axios.create({
    /*api的baseURL*/
    /*baseURL:
        process.env.NODE_ENV === "production"
            ? process.env.VUE_APP_REQUEST_URL
            : "/",*/
    /*请求超时时间*/
    timeout: 60000
});
/*request 拦截器*/
Request.interceptors.request.use(
    config => {
        let url = config.url;
        //配置密匙

        return config;
    },
    error => {
       /*处理请求出错*/
        return Promise.reject(error);
    }
);
/*response拦截器*/
Request.interceptors.response.use(res => {
        if (res.status === 401) {
            return res;
        }
        return res;
    },
    error => {
        /*处理response出错逻辑*/
        return Promise.reject(error);
    }
);
export default Request;
