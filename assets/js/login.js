$(function() {
    // 点击去注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg_box').show();
    });
    // 点击去登陆
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg_box').hide();
    });

    //1. 从layui中   获取form对象
    var form = layui.form;
    //2. 通过form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则，需要在html文档对应的表单lay-verify处加上pwd
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'], ///^[\S]{6,12}$/ 表示非空格且6-12位 
        repwd: function(value) { //value：表单的值、item：表单的DOM对象
            // 通过value拿到的是确认密码框的内容
            // 还需要拿到密码框的内容
            // 然后进行一次判断
            // 如果判断失败则return一个提示消息即可
            var pwd = $('.reg_box input[name=password]').val();
            if (value !== pwd) {
                console.log(value);
                console.log(pwd);


                return "两次输入的密码不一样";
            }
        }
    });
    // 发起注册请求
    $("#regform").on('submit', function(e) {
        // 先阻止默认的提交行为
        e.preventDefault();
        // 再发起ajax的post请求
        var data = { username: $('.reg_box [name=username]').val(), password: $('.reg_box input[name=password]').val() };
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: data,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                } else {
                    layer.msg('注册成功,请登陆');
                    // 模拟人的点击行为，注册成功之后去登陆
                    $('#link_login').click();
                }
            }
        })
    });
    // 发起登陆请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        // 为了简化表单中数据的获取操作，jquery提供了serialize() 函数，其语法如下：
        // $(dom).serialize()
        var data = $(this).serialize();
        $.post('/api/login', data, function(res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            } else {
                console.log(res.token);
                layer.msg('登陆成功！');
                // 将登陆成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = 'index.html';
                //  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzI4MDgsInVzZXJuYW1lIjoiZGFzaGlqaWFuMTIzNDU2IiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2MDk0NjQxMTMsImV4cCI6MTYwOTUwMDExM30.5kJPaPqflBElmUP3mRSqZxn2ZWyimX7op_bTyQK1y9Y
            }
        })
    });

})