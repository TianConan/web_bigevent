

$(function () {
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link-login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })


    // 从 layui 中获取 form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify()函数 自定义验证规则
    form.verify({
        // 自定义了一个叫做 pwd 的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码不一致的规则
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return '两次输入的密码不一致';
            }
        }
    })

    $('#form_reg').on('submit', (e) => {
        e.preventDefault();
        // $.ajax({
        //     type: 'POST',
        //     url: 'http://www.liulongbin.top:3007/api/reguser',
        //     data: {
        //         username: 'jjj',
        //         password: '000000'
        //     },
        //     success: function (res) {
        //         console.log(res);
        //     }
        // })
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // console.log('注册成功！');
            layer.msg('注册成功！');
        })

        $('#link-login').click();
    })

    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功！');
                // 将登录成功后得到的 token 存储到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })        
        
    })

})

