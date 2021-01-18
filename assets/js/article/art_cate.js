$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取列表失败！');
                }
                var htmlStr = template('tpl-table', res); //  传输的是res 不是res.data
                $('.layui-table tbody').html(htmlStr);
            }
        })
    };

    // 添加文章分类
    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $("#btnAddCate").on('click', function() {
        // 用一个script标签，写content里面的html标签。
        var htmlStr = $('#dialog-add').html();
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: htmlStr
        });
    });
    // 通过代理的形式 为form-add表单 绑定submit事件 ,不能绑定script标签的id
    //  body是页面已存在的函数
    $("body").on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('新增分类失败');
                }
                layer.msg('新增分类成功');
                initArtCateList();
                // 
                layer.close(indexAdd);
            }
        })
    });

    // 编辑文章分类
    // 通过代理的形式，为btnEdit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btnEdit', function() {
        // 弹出一个修改文章分类信息的层
        // 用一个script标签，写content里面的html标签。
        var htmlStr = $('#dialog-edit').html();
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: htmlStr
        });

        // 拿到对应的id
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据值
        $.ajax({
            method: 'get', //1.8以后才支持method
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取分类失败');
                }
                // 利用layui给form表单填充数据
                // 在对应form表单上添加 lay-filter="form-edit"
                form.val('form-edit', res.data); //第一个值是lay-filter对应的值
                //注意，获取到的id值利用隐藏域保存起来
            }
        });
    });

    // 通过代理的方式 为修改分类的表单绑定submit事件
    // 监听form-edit编辑分类表单的提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        //发起请求提交数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新分类数据失败');
                }
                layer.msg('更新分类数据成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });

    // 删除分类
    // 通过代理的形式，为btnDelete 按钮绑定点击事件
    $('tbody').on('click', '.btnDelete', function() {
        // 拿到自定义的id
        var id = $(this).attr('data-id');
        // 弹出询问框
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            // 发起ajax请求删除
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功');
                    initArtCateList();
                }
            });

            layer.close(index);
        });
    });











})