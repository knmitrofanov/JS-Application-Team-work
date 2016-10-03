import { templates } from '../scripts/templates.js';
import { data } from '../scripts/data.js';
import { utils } from '../scripts/utils.js';


let postsController = function() {
    function all() {
        Promise.all([data.posts.get(), templates.get('posts')])
            .then(([data, template]) => {
                console.log(data);
                let html = template(data);
                $('#content').html(html);
            }).then(() => {
                $(".like").on("click", function(ev) {
                    console.log(ev);
                    var id = $(ev.target).attr("post-id");
                    console.log("Like add to: " + id);
                    data.posts.like(id).then(() => { location.reload() });
                });
                $(".dislike").on("click", function(ev) {
                    var id = $(ev.target).attr("post-id");
                    console.log("Dislike add to: " + id);
                    data.posts.dislike(id).then(() => { location.reload() });
                });
            })
            .catch((err) => utils.showMsg(err, 'Error', 'alert-danger'))
    }

    function getById(params) {
        Promise.all([data.posts.getById(params.id), templates.get('post')])
            .then(([data, template]) => {
                console.log(data);
                let html = template(data);
                $('#content').html(html);
            }).then(() => {
                $(".like").on("click", function() {
                    console.log("Like");
                    data.posts.like(params.id).then(() => { location.reload() });
                });
                $(".dislike").on("click", function() {
                    console.log("Dislike");
                    data.posts.dislike(params.id).then(() => { location.reload() });
                });
                $("#btn-add-comment").on("click", function() {
                    let content = $("#content-comment").val();
                    data.posts.addMessage(params.id, content).then(() => (location.reload()));
                });
            })
            .catch((err) => utils.showMsg(err, 'Error', 'alert-danger'));
    }

    function add() {
        templates.get('add-post')
            .then(function(template) {
                $('#content').html(template());

                let post;
                $('#add-post').on('click', () => {
                    let videoId = $('#url').val().substr(32, 11);
                    let url = 'https://www.youtube.com/embed/' + videoId;
                    //
                    post = {
                        title: $('#title').val(),
                        content: $('textarea#content').val(),
                        url: url
                    };
                    console.log(post);
                    data.posts.add(post)
                        .then(function() {
                            setTimeout(function() {
                                window.location.href = '#/posts';
                            }, 1000);
                        });
                });
            })
    }


    return {
        all: all,
        getById: getById,
        add: add
    };
}();

export { postsController }