import { templates } from './templates.js';
import { router } from './routing.js';
import { data } from './data.js';

$(() => {
    function login() {
        templates.get("login").then((template) => {
            $("#log").html(template());
        }).then(() => {
            $('#btn-login').on('click', function() {
                console.log("Clicked btn-login!");
                var user = {
                    Username: $('#username-field').val(),
                    Password: $('#password-field').val()
                };
                data.users.login(user).then(() => { logout(user) });
            });
        });
    }

    function logout() {
        templates.get("logout").then((template) => {
            console.log(localStorage.getItem("Current-User"));
            $("#log").html(template(JSON.parse(localStorage.getItem("Current-User"))));
        }).then(() => {
            $("#btn-logout").on("click", function() {
                localStorage.removeItem("Current-User");
                login();
            });
        });
    }
    router.init();
    if (localStorage.getItem("Current-User") === null) {
        login();
    } else {
        logout();
    }
    //Log in events and requests logic!
    console.log("Start main.js");
    //Login button
});