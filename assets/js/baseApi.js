// 注意：每次调用$.get() 或$.post() 或$.ajax() 的时候，
// 会先调用 $.ajaxPrefilter(fn(){}) 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// var baseURL = 'http://ajax.frontend.itheima.net'
var baseURL = 'http://www.liulongbin.top:3007'
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = baseURL + options.url;
    // console.log(options.url);

    // 先判断是 /api接口还是 /my接口，如果是/api接口就不需要权限，不用发送token
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) { // 证明有权限的接口
        options.headers = {
            // 从本地存储李取出token值 ,如果没有token值就返回空字符串
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete回调函数
    options.complete = function(res) {
        // console.log('执行了complete回调');
        // console.log(res);
        // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        // 如果请求结束，并且没有拿到认证失败
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //1. 强制清空token
            localStorage.removeItem('token');
            // 2.强制跳转到登陆页
            location.href = 'login.html';
        };

    }

});