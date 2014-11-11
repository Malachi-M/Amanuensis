var mongoose = require('mongoose');
var Post = require('./post-model');

var User = mongoose.Schema({
    user_email:{
        type: String,
        require: true,
        index:{
            unique: true
        }
    },
    username: {
        type: String,
        require: true,
        index: {
            unique: true
        }
    }
});

// the passport-local-mongoose plugin creates the 'hash' and 'salt' properties.
User.plugin(require('passport-local-mongoose'));

// query to find all posts for a user
User.methods.findPost = function(cb){
    return Post.find({
        user_id: this._id
    }, cb);
};

// query to find a post that matches the post._id with the id passed in.
User.methods.retrievePostById = function(id, cb){
    return Post.findOne({
        user_id : this._id,
        _id : id
    }, cb);
};

//Returns a new Post document.

User.methods.newPost = function(){
    var post = new Post();
    post.user_id = this._id;
    return post;
};  

//Deletes a post from the user's collection.

User.methods.removePost = function(post, cb){
    Post.findOneAndRemove({
        _id: post._id,
        user_id: this._id
    },cb);  
};

//Deletes a comment from a post in the user's collection
//TODO complete the removal of comment
User.methods.removeComment = function(post, comment_id, cb){ 
    console.log(post + "\n" + comment_id);
    Post.comment.findOneAndRemove({
        _id: comment_id
    }, cb);
};

module.exports = mongoose.model('user', User);