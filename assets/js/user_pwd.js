$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        oldPwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        newPwd: function(value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能和原密码相同'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不同'
            }
        }
    })

    // 提交发起请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功');
                // 更新成功后重置表单
                // reset是原生js中的方法，jq元素需要转换为dom元素 $('.layui-form')[0]
                $('.layui-form')[0].reset()
            }
        })
    });

})