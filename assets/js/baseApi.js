// 注意：每次调用$.get() 或$.post() 或$.ajax() 的时候，
// 会先调用 $.ajaxPrefilter(fn(){}) 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// var baseURL = 'http://ajax.frontend.itheima.net'
var baseURL = 'http://www.liulongbin.top:3007'
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = baseURL + options.url
    console.log(options.url);
});