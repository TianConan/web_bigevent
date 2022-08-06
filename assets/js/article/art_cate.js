$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var indexAdd = null;
    var indexEdit = null;

    initArtCateInfo();

    function initArtCateInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

            }
        })
    }

    $('#AddCateBtn').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章失败！');
                }
                initArtCateInfo();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    })

    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');

        $.ajax({
            method: 'GET',
            url: `/my/article/cates/${id}`,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新分类成功！');
                initArtCateInfo();
                layer.close(indexEdit);
            }
        })
    })

    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除分类成功！');
                    initArtCateInfo();
                }
            })            
            
            layer.close(index);
        });

    })
})