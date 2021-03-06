$(function() {
    var layer = layui.layer
    var form = layui.form;
    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('初始化文章分类失败');
                }
                // 调用模版引擎渲染
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 这里一定要调用form.render() 必须重新加载一下才行
                form.render();
            }
        })
    };

    // 初始化富文本编辑器
    initEditor();

    // 封面裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 更换图片
    $('#btnChooseImage').on('click', function(e) {
        // 模拟文件域的点击
        $('#coverFile').click();

    });
    // 监听coverFile文件域的变化
    $('#coverFile').on('change', function(e) {
        //e.target.files 获取到文件列表数组
        if (e.target.files.length == 0) {
            return layer.msg('请选择照片')
        }
        // 拿到选中的图片
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿函数绑定点击事件,点击后就切换了状态
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        //2. 基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0]); // jQ对象必须转换为原生DOM对象
        //3.将文章的发布状态存到fd中   把state 追加到表单
        fd.append('state', art_state);

        //4.将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5. 将文件对象存储到fd中 
                fd.append('cover_img', blob);
                // 6. 发起ajax数据请求 ，发请求必须写在转换blob文件对象之时
                publishArticle(fd);
            });

    });

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是formData的数据，必须添加以下两个数据
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败');
                }
                layer.msg('发表文章成功');
                location.href = '/article/art_list.html';
            }
        });
    }





})