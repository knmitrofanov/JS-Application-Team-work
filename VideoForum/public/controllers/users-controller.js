import { templates } from '../scripts/templates.js';
import { data } from '../scripts/data.js';

let usersController = function() {

    function register(context) {
        console.log("Register");
        templates.get('register')
            .then(function(template) {
                $('#content').html(template());
            }).then(() => {
                console.log($("#content").html());
                $('#btn-register').on('click', function() {
                    if ($('#username-register').val() != "" && $('#password-register').val() != "") {
                        console.log("Send registration.");
                        var user = {
                            username: $('#username-register').val(),
                            password: $('#password-register').val(),
                            email: $('#tb-email').val(),
                            displayName: $('#tb-displayName').val()
                        };

                        data.users.register(user)
                            .then(function() {
                                localStorage.setItem("Current-User", JSON.stringify({ Username: user.username, Password: user.password }));
                                location.hash = "";
                                location.reload();
                            });
                    } else {
                        console.log($('#username-register').val());
                        console.log("Can't send registration." + " " + $('#tb-username').val() + " " + $('#tb-password').val());
                    }
                });
            });
    }

    function login(context) {
        $('#btn-login').on('click', function() {
            var user = {
                username: $('#tb-username').val(),
                password: $('#tb-password').val(),
            };

            data.users.login(user)
                .then(function() {
                    context.redirect('#/');
                    document.location.reload(true);
                }).then(function() {
                    $('.input-group').hide();
                    $('#btn-login').html('Logout');
                });
        });

    }

    function logout(context) {
        var btnLogout = $('#btn-login');
        if (btnLogout.html() === 'Logout') {
            $('#btn-login').on('click', function() {
                data.users.logout(user)
                    .then(function() {
                        context.redirect('#/');
                        document.location.reload(true);
                    }).then(function() {
                        $('.input-group').show();
                        $('#btn-login').html('Login');
                    });
            });
        }
    }

    return {
        register: register,
        login: login,
        logout: logout
    };
}();

export { usersController };