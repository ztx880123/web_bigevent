$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象，提交到服务器
    var q = {
        pagenum: 1, //页面值，默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据，默认每页显示两条
        cate_id: '', // 文章分类的id
        state: '' //文章的发布状态
    };
    // 定义补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 定义template 管道函数 时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 渲染表单
    initTable();
    //获取文章数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status != 0) {
                    layer.msg('获取列表失败')
                }
                // 使用模版引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('#art-list-body').html(htmlStr);
                // 调用渲染分页的方法
                // 总数据条数 res.total 
                renderPage(res.total);
            }
        })
    };

    initCate();
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取分类失败');
                }
                // 调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知 layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格数据
        initTable();
    });


    // 定义渲染分页的方法 渲染分页要写在 // 渲染表单initTable() 方法内，在渲染数据时直接渲染好分页
    function renderPage(total) {
        // 调用laypage.render({}) 来渲染分页的结构欧
        laypage.render({
            elem: 'pageBox', //分页容器的id，不需要价#号
            count: total, //数据总和。总数据条数,通过形参传递过来的
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            // 自定义分页列表的内容排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 注意顺序
            limits: [2, 3, 5, 10], //指定limit分页条数里面的数据

            // jump是分页发生切换的时候发生jump回调
            // 触发jump回调的方式有两种
            // 第一种是 点击页码的时候会触发jump回调
            // 第二种是只要调用了laypage.render()方法就会触发jump回调
            jump: function(obj, first) {
                // 可以通过first的值来判断是通过那种方式触发的jump回调
                // 如果jump的值是true，证明是方式2触发的
                // 否则就是方式1触发的
                // 把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 改变分页条数时也会触发jump，拿到最新的条数并渲染
                // 把最新的条目数，赋值到q这个查询参数对象pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染表格
                // 如果直接把initTable放在这里会发生死循环，所以不能直接在这调用，只要调用了laypage.render()方法就会触发jump回调
                //
                //
                //首次不执行，就是打开页面的时候不会直接触发jump回调。而是通过点击触发
                // 这样就只能通过第一种
                // 如果是通过第二中方式调用的话，first的值为ture，不是的话就是undefined
                if (!first) {
                    // 崇勋渲染数据表格
                    initTable();
                }
            }
        });
    };

    // 删除文章功能
    // 通过代理的形式为删除按钮绑定点击事件
    $('body').on('click', '.btn_delete', function() {
        // 拿到id
        var id = $(this).attr('data-id');
        // 看看有几个删除按钮,获取删除按钮的个数
        var len = $('.btn_delete').length;
        // 弹出询问层 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');

                    //解决当前页面文章全部删除后，页码改变但实质没有跳转
                    // 当数据删除完成后，需要判断当前这一页中， 是否还有剩余数据
                    // 如果没有剩余数据了，则让页码值减1之后，再重新调用initTable()
                    // 根据删除按钮当数量判断是否是只有一条数据了
                    if (len === 1) { // 如果len 的值等于1，证明删除完毕之后，页面上就没有任何数据了

                        // 页面减之前判断页面值是否等于1，因为页面值最小是1
                        q.pagenum = q.pagenum == 1 ? q.pagenum : q.pagenum - 1;
                        initTable();
                    }

                    // 重新渲染表格
                    initTable();
                }
            });
            // 关闭此弹出层
            layer.close(index);
        });
    })


    // 文章编辑功能
    $('body').on('click', '.btn_edit', function() {
        // 点击编辑后得到当前id
        var id = $(this).attr('data-id');
        // 通过字符串查询的方法跳转，并把参数通过url传递过去
        location.href = '/article/art_edit.html?id=' + id;
    })
})