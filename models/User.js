var mongoose = require('mongoose');
var Post = require('./post-model');

var User = mongoose.Schema({
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
    post.user_id - this._id;
    return post;
};  

//Delets a post from the user's collection.

User.methods.removePost = function(post, cb){
    Post.fineOneAndRemove({
        _id: post._id,
        user_id: this._id
    },cb);  
};

module.exports = mongoose.model('user', User);