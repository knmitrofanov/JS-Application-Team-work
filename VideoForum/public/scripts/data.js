var data = (function() {

    // start users
    function userRegister(user) {
        return new Promise((resolve, reject) => {
            let body = {
                Username: user.username,
                Password: user.password,
                Email: user.email,
                DisplayName: user.displayName
            };
            $.ajax({
                    type: 'POST',
                    url: 'api/register',
                    contentType: 'application/json',
                    data: JSON.stringify(body),
                }).done((data) => resolve(data))
                .fail((err) => reject(err));
        })
    }

    function userLogin(user) {
        return new Promise((resolve, reject) => {
            let body = {
                Username: user.Username,
                Password: user.Password
            };
            $.ajax({
                    type: 'POST',
                    url: 'api/login',
                    data: JSON.stringify(body),
                    contentType: 'application/json',
                    success: function(user) {
                        console.log('suces is trigerd');
                        localStorage.setItem('Current-User', JSON.stringify(body));
                    }
                }).done(resolve)
                .fail(reject);
        })
    }

    function userLogout() {
        return new Promise((resolve, reject) => {

            $.ajax({
                    type: 'DELETE',
                    url: 'api/logout',
                    success: function() {
                        console.log('successfully remove User token from localStorage');
                        localStorage.removeItem('Current-User');
                    }
                }).done(resolve)
                .fail(reject);
        })
    }

    function userGetCurrent() {
        return Promise.resolve(JSON.parse(localStorage.getItem('Current-User')));
    }
    // end users

    // start posts
    function postsGet() {
        return new Promise((resolve, reject) => {
            $.getJSON('/api/posts')
                .done(resolve)
                .fail(reject)
        });
    }

    function postAdd(post) {
        return new Promise((resolve, reject) => {
            let body = {
                Title: post.title,
                Content: post.content,
                Url: post.url,
                Rating: 0
            }

            $.ajax({
                    type: 'POST',
                    url: '/api/posts',
                    data: JSON.stringify(body),
                    contentType: 'application/json'
                })
                .done(resolve)
                .fail(reject);
        });
    }

    function postById(id) {
        return new Promise((resolve, reject) => {
            $.getJSON(`api/posts/${id}`)
                .done(resolve)
                .fail(reject);
        })
    }

    function postsAddComment(postId, content) {
        console.log("Post add comment");
        return new Promise((resolve, reject) => {
            userGetCurrent()
                .then((user) => {
                    let body = {
                        Messages: {
                            Username: user.Username,
                            Content: content
                        }
                    }
                    console.log("body");
                    console.log(body);
                    $.ajax({
                            type: 'POST',
                            url: '/api/posts/' + postId + '/messages',
                            data: JSON.stringify(body),
                            contentType: 'application/json'
                        })
                        .done(resolve)
                        .fail(reject);
                })
        });
    }

    function postsAddLike(postId) {
        var user = JSON.parse(localStorage.getItem("Current-User"));
        if (localStorage.getItem("Current-User") != null) {
            if (user.Username != undefined && user.Username != null && (localStorage.getItem(user.Username + " liked " + postId) === null || localStorage.getItem(user.Username + " liked " + postId) === undefined)) {
                localStorage.setItem(user.Username + " liked " + postId, "true");
                localStorage.removeItem(user.Username + " disliked " + postId);
                return new Promise((resolve, reject) => {
                    let body = {
                        Like: true
                    };

                    $.ajax({
                        type: 'POST',
                        url: '/api/posts/' + postId + '/messages',
                        contentType: 'application/json',
                        data: JSON.stringify(body),
                    }).done(resolve).fail(reject);
                });
            } else {
                return Promise.resolve();
            }
        } else {
            return Promise.resolve();
        }
    }

    function postsAddDislike(postId) {
        var user = JSON.parse(localStorage.getItem("Current-User"));
        if (localStorage.getItem("Current-User") != null) {
            if (user.Username != undefined && user.Username != null && (localStorage.getItem(user.Username + " disliked " + postId) === null || localStorage.getItem(user.Username + " liked " + postId) === undefined)) {
                localStorage.setItem(user.Username + " disliked " + postId, "true");
                localStorage.removeItem(user.Username + " liked " + postId);
                return new Promise((resolve, reject) => {
                    let body = {
                        Like: false
                    };

                    $.ajax({
                        type: 'POST',
                        url: '/api/posts/' + postId + '/messages',
                        contentType: 'application/json',
                        data: JSON.stringify(body),
                    }).done(resolve).fail(reject);
                });
            } else {
                return Promise.resolve();
            }
        } else {
            return Promise.resolve();
        }
    }
    // end posts


    return {
        users: {
            register: userRegister,
            login: userLogin,
            logout: userLogout,
            current: userGetCurrent
        },
        posts: {
            get: postsGet,
            add: postAdd,
            getById: postById,
            addMessage: postsAddComment,
            like: postsAddLike,
            dislike: postsAddDislike
        }
    }
})();

export { data };