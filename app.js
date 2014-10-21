// Requiring dependent modules
var express = require('express');
var bodyParser = require("body-parser");
var hbs = require("hbs");
var hbsutils = require('hbs-utils')(hbs);
var stylus = require('stylus');

var Blog = require('./models/post-model');

var app = express(); // Initiating a new express instance.


app.set('view engine', 'html'); // Setting the views for the templates to be read as html files from the handlebar engine.
app.engine('html', hbs.__express);

hbsutils.registerPartials('views/partials');

app.use(stylus.middleware(__dirname + '/public/css'));

app.set('port', process.env.PORT || 1337); // Setting the Port and IP as either system determined or hardcoded.
app.set('ip', process.env.IP || '127.0.0.1');

app.use(express.static('public')); // Static files served from '/public'

app.use(bodyParser.urlencoded({ //bodyParse is used to parse the body of Post requests. extended to false stops the 'qs' lib from parsing for extended syntax.
    extended: false
}));


app.get('/', function(req, res, next) { // Index served

    Blog.find()
        .where('isRemoved')
        .equals(null)
        .sort({
            created: -1
        })
        .exec(function(err, posts) {
            res.render('index', {
                title: "Amanuensis - Simple Blogs",
                posts: posts
            });
        });
})



app.get('/admin/post/create', function(req, res, next) { // route for creating a post
    res.render('createPost', {
        title: "New Post"
    });
});

app.post('/admin/post/create', savePost); // Saves a newly created post
app.post('/admin/post/:id/edit', savePost); // Saves edits made to a post
app.post('/admin/post/:id/delete', deletePost); // Removes post from the index list
app.post('/post/:id/comment/create', saveComment);
app.post('/post/:id/comment/:id/delete', deleteComment);

function savePost(req, res, next) {

    if (req.body.action == 'Remove') {
        return deletePost(req, res, next);
    }

    Blog.findById(req.params.id, function(err, post) {


        if (!post) {
            post = new Blog();
            post.created = Date();
        }

        post.set({
            title: req.body.title,
            author: req.body.author,
            isRemoved: req.body.isRemoved,
            body: req.body.body || '',
            tag: req.body.tag.split(/[ ,]+/).filter(Boolean)
        });

        post.save(function(err) {
            console.log(post.tag);
            if (err) {
                res.render('editPost', {
                    title: "Error Saving Post: " + post.title,
                    post: post,
                    notification: {
                        severity: "error",
                        message: "Well would ya look at that: " + err
                    }
                });
            }
            else {
                res.redirect('/');
            }
        });
    });
}

function deletePost(req, res, next) {

    Blog.findById(req.params.id, function(err, post) {

        if (post) {
            console.warn('Removing Post!', post);

            post.set({
                isRemoved: true
            });

            post.save(function(err) {
                if (err) {
                    res.render('editPost', {
                        title: "Error Saving Post: " + post.title,
                        post: post,
                        notification: {
                            severity: "error",
                            message: "Well would ya look at that: " + err
                        }
                    });
                }
                else {
                    res.redirect('/');
                }
            });
        }
        else {
            res.render('error', {
                title: "Not able to Remove Post" + req.params.id,
                notification: {
                    severity: "error",
                    message: "Sorry your post could not be found nor removed."
                }
            });
        }
    });
}

app.get('/admin/post/:id/edit', function(req, res, next) { // stub for editing commments
    Blog.findById(req.params.id, function(err, post) {
        if (err) res.status(404).render('index', {
            notification: {
                severity: "error",
                message: "Hey fella, your page percolated outta the internets. Next time perhaps!"
            }
        })
        res.render('editPost', {
            title: "Edit a Post!",
            post: post
        });
    });
});

app.get('/comment/create', function(req, res, next) { // stub for creating comments

    res.render('createComment', {
        title: "Create a Comment!"
    });
});

//app.post('/comment/create', saveComment);

function saveComment(req, res, next) {

    if (req.body.action == 'delete') {
        return deleteComment(req, res, next);
    }

    Blog.findById(req.params.id, function(err, comment) {

        if (!comment) {
            comment = new Blog().comment;
            comment.created = new Date();
        }

        comment.set({
            author: req.body.comment.author,
            created: Date(),
            body: req.body.comment.body || '',
        });

        comment.save(function(err) {
            if (err) {
                res.render('createComment', {
                    title: "Error Saving Create: " + comment.author,
                    comment: comment,
                    notification: {
                        severity: "error",
                        message: "Well would ya look at that: " + err
                    }
                });
            }
            else {
                res.redirect('/');
            }
        });
    });
}

function deleteComment(req, res, next) {

    Blog.findById(req.params.id, function(err, comment) {

        if (comment) {
            console.warn('Removing Comment!', comment);

            comment.remove(comment, function(err) {
                if (err) {
                    res.render('error', {
                        title: "Delete comment failed!",
                        notification: {
                            severity: "error",
                            message: "Could not delete comment: " + err
                        }
                    });
                }
                else {
                    res.redirect('/');
                }
            });

        }
        else {
            res.render('error', {
                title: "Not able to Remove Comment" + req.params.id,
                notification: {
                    severity: "error",
                    message: "Sorry your comment could not be found nor removed"
                }
            });
        }
    });
}

app.get('/comment/edit', function(req, res, next) {
    res.render('editComment', {
        title: "Edit a Comment!"
    });
});

app.get('/:id', function(req, res, next) {

    Blog.findById(req.params.id, function(err, post) {
        if (post) {
            res.render('view', {
                title: "Entry: " + post.title,
                post: post
            });
        }
        else {
            res.status(404).render('view', {
                title: "This post has yet to be created.",
                notification: {
                    severity: "error",
                    message: "You have reached into the future and failed to pull back this post!"
                }
            });
        }
    });
});

app.use(function(req, res) { // 404 routing. "console.warn()" is equivalent to "console.error"
    console.warn('404 Page Evaporated: %s', req.orginalUrl);
    res.status(404).render('index', {
        notification: {
            severity: "error",
            message: "Hey fella, your page percolated outta the internets. Next time perhaps!"
        }
    })
});

app.use(function(err, req, res, next) { // Internal Server error
    console.log(err.stack);

    res.status(500).render('index', {
        notification: {
            severity: "error",
            message: "The Force is strong with this one.\n Let us regroup and then retry!"
        }
    })
})

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Knock, and He'll open the door.\nVanish, and He'll make you Shine like the sun.\nFall, and He'll raise you to the heavens.\nBecome nothing, and He'll turn you into everything.\n--Rumi");
    console.log("Amanuensis is up and running on https://%s:%s", address.address, address.port);
});
