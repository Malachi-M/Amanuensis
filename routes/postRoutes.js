var express = require('express');
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;
var Blog = require('../models/post-model');

exports.init = function() {
    var router = express.Router();

    router.get('/', function(req, res, next) {
      Blog.find()
        .where('isRemoved')
        .equals(null)
        .sort('-created')
        //  created: -1
        //})
        .exec(function(err, posts) {
          res.render('index', {
            title: "Amanuensis - Simple Blogs",
            posts: posts
          });
        });
    });

    router.all('/posts/admin/*', ensureAuthenticated('/login'));
    router.get('/posts/', function(req, res, next) {
      res.rediret('/');
    });
    
    router.route('/posts/by/:author').get(author);
    router.route('/posts/:post').get(view);
    router.route('/posts/admin/create').get(create).post(savePost);
    router.route('/posts/admin/:post/edit').get(edit).post(savePost);
    router.route('/posts/admin/:post/delete').get(edit).post(deletePost);
    router.route('/posts/:post/comment/create').get(commentCreate).post(saveComment);
    router.route('/posts/admin/:post/comment/:comment_id/delete').get(view).post(deleteComment);


    router.param('post', function(req, res, next, id) {
      console.log(req.user);

      function find(err, posts) {
        if (posts) {
          req.post = posts;
          next(err);
        }
        else {
          if (err) {
            console.warn("Error received while retrieving post. " + id, err);
          }
          res.status(404).render('view', {
            title: "This post has yet to be created.",
            notification: {
              severity: "error",
              message: "You have reached into the future and failed to pull back this post!"
            }
          });
        }
      }
    });

    function author(req, res, next) {
      if (!req.user) {
        Blog.find()
          .where('isRemoved').equals(null)
          .where('author').equal(req.params.author)
          .sort('-created')
          .exec(function(err, posts) {
            res.render('index', {
              title: req.params.author,
              post: posts
            });
          });
      }
      else {
        req.user.findPost()
        .where('isRemoved').equals(null)
        .sort('-created')
        .exec(function(err, posts){
          res.render('index',{
            title: req.user.username,
            post: posts
          });
        });
      }
    }

      function create(req, res, next) {
        if (!req.user) {
          return res.redirect('/login');
        }
        res.render('createPost', {
          title: "Creating a New Post"
        });
      }

      function edit(req, res, next) {
        var post = req.post;
        if (post) {
          res.render('editPost', {
            title: "Edit a Post!",
            post: post
          });
        }
        else {
          res.render('index');
        }
      }

      function view(req, res, next) {
        var post = req.post;
        res.render('view', {
          title: "Entry: " + post.title,
          post: post
        });
      }

      function commentCreate(req, res, next) {
        var post = req.post;
        if (post) {
          res.render('createComment', {
            title: "Create a Comment"
          });
        }
      }

      function savePost(req, res, next) {
        if (!req.user) {
          return res.status(401).send("Not Authorized to View this.");
        }

        if (req.body.action == 'Remove') {
          return deletePost(req, res, next);
        }

        var post = req.post;

        if (!post) {
          post = req.user.newPost();
        }

        post.set({
          title: req.body.title,
          author: req.body.author,
          isRemoved: req.body.isRemoved,
          body: req.body.body || '',
          tag: req.body.tag.split(/[ ,]+/).filter(Boolean)
        });

        post.save(function(err) {
          if (err) {
            if (err.name === "ValidationError") {
              var notificationArr = [];
              for (var validator in err.errors) {
                notificationArr.push({
                  severity: "error",
                  message: err.errors[validator].message
                });
              }
              res.render('editPost', {
                title: "Edit Post " + post.title,
                post: post,
                notification: notificationArr
              });
            }
            else {
              res.render('editPost', {
                title: "Error Saving Post: " + post.title,
                post: post,
                notification: {
                  severity: "error",
                  message: "Well would ya look at that: " + err
                }
              });
            }
          }
          else {
            res.redirect('/');
          }
        });
      }

      function deletePost(req, res, next) {

        Blog.findById(req.params.post, function(err, post) {

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

      function saveComment(req, res, next) {

        console.log('We are saving a comment. req.params is %j, req.body is %j', req.params, req.body);

        if (req.body.action == 'delete') {
          return deleteComment(req, res, next);
        }

        Blog.findById(req.params.post, function(err, post) {

          if (post) {

            console.log("Comment is author:'%s', body:'%s'", req.body.author, req.body.body);
            post.comment.push({
              author: req.body.author,
              body: req.body.body
            });

            post.save(function(err) {
              if (err) {
                res.render('createComment', {
                  title: "Error Saving Create: " + comment.author,
                  post: post,
                  notification: {
                    severity: "error",
                    message: "Well would ya look at that: " + err
                  }
                });
              }
              else {
                console.log("Success My Friend!");
                res.redirect('/' + req.params.post);
              }
            });
          }
          else {
            res.render('error', {
              title: "Not able to Comment on Post: " + req.params.post,
              notification: {
                severity: "error",
                message: "Sorry your post could not be found."
              }
            });
          }
        });
      }

      function deleteComment(req, res, next) {

        Blog.findById(req.params.post, function(err, post) {

          if (post) {
            console.warn('Removing Comment!', req.params.post.comment);

            post.comment.id(req.params.comment_id).remove();
            post.save(function(err) {
              if (err) {
                res.render('/' + req.params.post, {
                  title: "Error Deleting Comment",
                  post: post,
                  notification: {
                    severity: "error",
                    message: "Well would ya look at that: " + err
                  }
                });
              }
              else {
                res.redirect('/' + req.params.post);
              }
            });
          }
          else {
            res.render('error', {
              title: "Not able to Remove Comment",
              notification: {
                severity: "error",
                message: "Sorry your comment could not be found nor removed"
              }
            });

          }
        });
      }
      return router;
    };
