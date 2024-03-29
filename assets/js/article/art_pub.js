$(function () {

    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 1.初始化图片裁剪器
    var $image = $('#image');

    // 2.裁剪选项
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    }

    // 3.初始化裁剪区域
    $image.cropper(options);

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })


    $('#coverFile').on('change', function (e) {

        var files = e.target.files;
        if (files.length === 0) {
            return;
        }

        var newImgURL = URL.createObjectURL(files[0]);


        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options);

    })


    // 定义文章发布状态
    var art_state = '已发布';

    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })


    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.组织表单的默认提交行为
        e.preventDefault();

        // 2.基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);

        // 3.将文章的发布状态，存到 fd 中
        fd.append('state', art_state);

        // fd.forEach(function(k, v) {
        //     console.log(k, v);
        // })

        // 4.将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 200
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作、
                // 5.将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 6.发起 Ajax 的数据请求
                publishArticle(fd);
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html';

            }
        })
    }
})