$(function () {
    getUserInfo();


    var layer = layui.layer;

    $("#btnLoginOut").on('click', function () {
        
        layer.confirm('此操作将退出登录, 是否继续?', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 1.移除localStorage的token
            localStorage.removeItem('token');

            // 2.跳转到登录界面。
            location.href = '/login.html';
            
            layer.close(index);
        });
    })
    
})



// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 配置请求头（只有 带了/my/的才需要请求头）
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            renderAvatar(res.data);
        },
        // complete: function (res) {
        //     console.log('complete 的回调  :');
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}

function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }

}


