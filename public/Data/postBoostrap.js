var Blog = require('./../../models/post-model');
var posts = require('./post.json');
var fs = require('fs');

// var str = fs.readFile('posts', function(err, data) {
//     if (err) console.log("HALP! :" + err);

//     data.forEach(function(post){
//         var p = new Blog(post);
//         p.save();
//         console.log("Posted Successfully!");
//     });
// });

posts.forEach( function(post){
    var p = new Blog(post);
    p.set("body", '<p>' + post.body + '</p>');

    p.save( function(err){
        if(err)console.log("Save Unsuccessful!");
    });
});