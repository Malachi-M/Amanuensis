var mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://' + ( process.env.IP || 'localhost' ) + '/blogposts' ); //connecting to the database named '/blogposts' over process.env.IP

var commentSchema = new mongoose.Schema({ //Comment Schema defined.
    author : String,
    created : { type: Date,  default: Date.now },
    body : String
});

var postSchema = new mongoose.Schema({ //Blog Post Schema defined.
    id: Number,
    permalink: String,
    title: String,
    author: String,
    created: { type: Date, default: Date.now},
    isRemoved: { type: Boolean, default: false},
    body: String,
    tag: [String],
    comment : [commentSchema] // sub document defined above in commentSchema
});

module.exports = mongoose.model( 'post', postSchema ); //The file name === model name (first parameter, second parameter is the schema name)
