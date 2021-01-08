$(function() {
    // 调用 getUserInfo() 获取用户信息
    getUserInfo();


    // 退出功能 绑定点击事件
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function(index) {
            // function(){ } 是点击确定后的回调函数
            // 1.清除localStorage中的token数据
            localStorage.removeItem('token');
            //2.重新 返回登陆页面
            location.href = "login.html"
        });
    });
});


// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        // 注意发请求之前一定要先导入baseApi
        url: '/my/userinfo',
        // 有权限的接口必须配置headers
        // 请求头配置对象 配置token
        // headers: {
        //     // 从本地存储李取出token值 ,如果没有token值就返回空字符串
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用函数渲染用户头像
            renderAvatar(res.data);
        },
        // // 不论成功还是失败，终都会调用这个回调函数
        // complete: function(res) {
        //     console.log('执行了complete回调');
        //     console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     // 如果请求结束，并且没有拿到认证失败
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         //1. 强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到登陆页
        //         location.href = 'login.html';
        //     };
        // }
    })
};
// 渲染用户头像
function renderAvatar(user) {
    // 1.第一步先获取用户名，如果有昵称渲染昵称如果没有昵称渲染用户名
    var name = user.nickname || user.username;
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;' + name);
    // 3.按需渲染用户头像 有图片头像就渲染图片头像，没有的话渲染文字头像
    if (user.user_pic != null) {
        //3.1 渲染图片头像 
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //3.2 渲染文本头像
        $('.layui-nav-img').hide();
        // 获取字符串第一个字符，并转换为大写，中文不变
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
};