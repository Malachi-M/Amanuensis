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
  router.route('/posts/my').get(userLoggedIn); // had to move this above the /posts/:post
  router.route('/posts/:post').get(view); //works
  router.route('/posts/by/author/:author').get(author); //add /author/  // ****does not work
  router.route('/posts/by/tag/:tag').get(tag); //works. boom.
  router.route('/posts/admin/create').get(create).post(savePost); //works
  router.route('/posts/admin/:post/edit').get(edit).post(savePost); // ****psuedo works, allows any user to edit
  router.route('/posts/admin/:post/delete').get(edit).post(deletePost); // works
  router.route('/posts/:post/comment/create').get(commentCreate).post(saveComment); // works
  router.route('/posts/admin/:post/comment/:comment_id/delete').get(view).post(deleteComment); // ****does not work


  router.param('post', function(req, res, next, id) {
    console.log("we have arrived!!!");
    Blog.findById(id, function(err, posts) {
      if (posts) {
        //console.log('actually we are here');
        //console.log(posts);
        req.post = posts;
        next(err);
      }
      else {
        if (err) {
          console.warn("Error received while retrieving post. " + id, err);
        }
        console.log('now we are here!');
        res.status(404).render('view', {
          title: "This post has yet to be created.",
          notification: {
            severity: "error",
            message: "404 - This page does not exist."
          }
        });
      }
    });
  });

  function tag(req, res, next) {
    Blog.find({
      tag: req.params.tag
    }).sort('-created').exec(function(err, tags) {
      res.render('index', {
        title: req.params.tag,
        posts: tags
      });
    });
  }

  function author(req, res, next) {
    console.log(req.params.author);
    Blog.find()
      .where('isRemoved').equals(null)
      .where('author').equals(req.params.author)
      .sort('-created')
      .exec(function(err, posts) {
        console.log(posts);
        if (err) {
          return next(err);
        }
        res.render('index', {
          title: req.params.author,
          posts: posts
        });
      });
  }

  function userLoggedIn(req, res, next) {
    console.log(req.user);
    var user = req.user;
    if (!user) {
      res.redirect('/');
    }
    console.log(user._id);
    user.findPost()
      .where('isRemoved').equals(null)
      .sort('-created')
      .exec(function(err, posts) {
        console.log(posts);
        if (err) {
          return next(err);
        }
        res.render('index', {
          title: "Welcome" + user.username,
          posts: posts
        });
      });

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
    console.log(req.user._id + '\n' + req.post.user_id);
    if (req.user._id == req.post.user_id) {
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
    else {
      return res.redirect('/posts/' + req.post._id);
    }
  }

  function view(req, res, next) {
    var post = req.post;
    Blog.findById(post, function(err, post) {
      if (post) {
        res.render('view', {
          title: "Entry: " + post.title,
          post: post
        });
      }
    });
  }

  function commentCreate(req, res, next) {
    var post = req.post;
    if (post) {
      res.render('createComment', {
        title: "Create a Comment"
      });
    }
    else {
      next()
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
    if (req.body.title === "" || req.body.title.length < 1) {
      return res.render('createPost', {
        title: "Creating a New Post",
        notification: {
          severity: "error",
          message: "A title for the post is required"
        }
      });
    }
    if (req.body.body === "" || req.body.body.length < 1) {
      return res.render('createPost', {
        title: "Creating a New Post",
        notification: {
          severity: "error",
          message: "Content for the post is required"
        }
      });
    }
    post.set({
      title: req.body.title,
      author: req.body.author,
      user_id: req.user._id,
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
    var post = req.post;
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

        if (req.body.author === "" || req.body.author.length < 1) {
          return res.render('createComment', {
            title: "Write a Comment",
            notification: {
              severity: "error",
              message: "An author for the comment is required"
            }
          });
        }
        if (req.body.body === "" || req.body.body.length < 1) {
          return res.render('createComment', {
            title: "Write a Comment",
            notification: {
              severity: "error",
              message: "Content for the comment is required"
            }
          });
        }
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
            res.redirect('/posts/' + req.params.post);
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
    var user = req.user;
    user.removeComment(req.params.post, req.params.comment_id, function(err) {
      if (err) return next(err);
    });
  }

  return router;
};
