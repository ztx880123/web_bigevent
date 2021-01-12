$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须在1-6个字符之间";
            }
        }
    });
    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                // 调用form.val 快速给表单赋值
                form.val('formUserInfo', res.data)
            }
        })

    }
    // 重置表单数据
    // 给重置按钮绑定事件
    $('#btnReset').on('click', function(e) {
        // 阻止默认行为，别让所有的value都重置
        e.preventDefault();
        // 初始化用户信息
        initUserInfo();
    });

    // 更新用户的基本信息
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 拿到表单的数据，里面有id，用隐藏域存储的
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                // 更新成功后，还要重新调用父页面的 getUserInfo() 获取一下用户信息，但是是两个页面
                // 可以这样调用
                window.parent.getUserInfo();
            }
        })
    });

});