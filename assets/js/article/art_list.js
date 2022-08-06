$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询参数对象q
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,     // 页码值
        pagesize: 2,    // 每页可显示多少条数据
        cate_id: '',    // 文章分类的 Id
        state: ''       // 文章的发布状态
    }

    initTable()
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                res = {
                    "status": 0,
                    "message": "获取文章列表成功！",
                    "data": [
                        {
                            "Id": 1,
                            "title": "abab",
                            "pub_date": "2020-01-03 12:19:57.690",
                            "state": "已发布",
                            "cate_name": "最新"
                        },
                        {
                            "Id": 2,
                            "title": "666",
                            "pub_date": "2020-01-03 12:20:19.817",
                            "state": "已发布",
                            "cate_name": "新闻"
                        },
                        // {
                        //     "Id": 3,
                        //     "title": "哈哈",
                        //     "pub_date": "2021-03-03 15:20:19.817",
                        //     "state": "已发布",
                        //     "cate_name": "新闻"
                        // },
                        // {
                        //     "Id": 4,
                        //     "title": "qwer",
                        //     "pub_date": "2020-11-03 02:10:19.817",
                        //     "state": "草稿",
                        //     "cate_name": "最新"
                        // },
                        // {
                        //     "Id": 5,
                        //     "title": "ABC",
                        //     "pub_date": "2019-04-03 07:40:19.817",
                        //     "state": "已发布",
                        //     "cate_name": "新闻"
                        // },
                        // {
                        //     "Id": 6,
                        //     "title": "小明的故事",
                        //     "pub_date": "2020-09-12 18:02:19.817",
                        //     "state": "已发布",
                        //     "cate_name": "最新"
                        // }
                    ],
                    "total": 5
                }
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 让layui重新渲染一下form表单
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                if (!first) {
                    initTable();
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function () {

        var len = $('.btn-delete').length;

        var id = $(this).attr('data-id');

        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    initTable();
                }
            })

            layer.close(index);
        });
    })


})