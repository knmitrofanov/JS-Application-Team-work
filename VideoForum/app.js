var express = require('express'),
    bodyParser = require('body-parser');
var Everlive = require('everlive-sdk');
var db = new Everlive('2w3chu0yie1f0qjv');

db.authentication.login('project', // username
    'project', // password
    function(data) { // success callback
        console.log("Log in");
    },
    function(error) { // error callback
        console.log("Cannot log in");
    });

var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/api/posts', function(req, res) {
    var post = req.body;
    console.log(post);
    var posts = db.data('Post');
    posts.create({
            'Messages': [],
            'Content': post.Content,
            'Title': post.Title,
            'Rating': post.Rating,
            'Likes': 0,
            'Dislikes': 0,
            'Url': post.Url
        },
        function(data) {
            console.log('Create post.');
        },
        function(error) {
            console.log('Cannot create post.');
        });
});
app.get('/api/posts', function(req, res) {
    var posts = db.data('Post');
    posts.get().then(function(data) {
        res.json({ data: data });
    });
});

app.get('/api/posts/:id', function(req, res) {
    var posts = db.data('Post');
    posts.getById(req.params.id)
        .then(function(data) {
                console.log("Get post.");
                res.json({ data: data });
            },
            function(error) {
                console.log("Cannot get post.");
                res.json({ data: error });
            });
});

app.post('/api/posts/:id/messages', function(req, res) {
    var message = req.body.Messages;
    var DoLike = req.body.Like;

    console.log("Add message to post with id: " + req.params.id);
    var posts = db.data('Post');
    posts.getById(req.params.id)
        .then(function(data) {
                var id = data.result.Id;
                var messages = data.result.Messages;
                var rating = data.result.Rating;
                if (DoLike) {
                    rating++;
                } else {
                    rating--;
                }
                messages.push(message);
                if (message === null || message === undefined || message === []) {
                    posts.updateSingle({ Id: id, 'Rating': rating },
                        function(data) {
                            res.json({ data: "done" });
                        },
                        function(error) {
                            res.json({ data: "error" });
                        });
                } else {
                    posts.updateSingle({ Id: id, 'Messages': messages, 'Rating': rating },
                        function(data) {
                            res.json({ data: "done" });
                        },
                        function(error) {
                            res.json({ data: "error" });
                        });
                }
            },
            function(error) {
                console.log("Cannot add message");
            });
});

app.post('/api/register', function(req, res) {
    var username = req.body.Username;
    var password = req.body.Password;
    var attrs = {
        Email: req.body.Email,
        DisplayName: req.body.DisplayName
    };

    db.Users.register(username,
        password,
        attrs,
        function(data) {
            console.log("Register user with name: " + username);
            res.json({ data: "done" });
        },
        function(error) {
            res.json({ data: "error" });
        });
})

app.post('/api/login', function(req, res) {
    var userData = req.body;
    console.log(userData);
    db.authentication.login(userData.Username,
        userData.Password,
        function(data) { // success callback
            console.log("Log in with name: " + userData.Username);
            res.json({ data: userData.Username });
        },
        function(error) { // error callback
            console.log("Cannot log in with name: " + userData.Username);
            res.sendStatus(500);
        });
});

app.post('/api/logout', function(req, res) {
    db.authentication.logout(function() {
        console.log("Logout successful!");
        res.sendStatus(200);
    }, function(err) {
        console.log("Failed to logout: " + err.message);
        res.sendStatus(400);
    });
});

var port = 1509;
app.listen(port, function() {
    console.log(`Server is running at http://localhost:${port}`);
});