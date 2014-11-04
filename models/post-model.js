var mongoose = require('mongoose');
var markdown = require('markdown').markdown;


var commentSchema = new mongoose.Schema({ //Comment Schema defined.
    commentorId: String,
    author: String,
    created: {
        type: Date, 
        default: Date.now
    },
    body: String
});
commentSchema.virtual('commentDateFormat').get(function(){
    return this.created.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});


var postSchema = new mongoose.Schema({ //Blog Post Schema defined.
    id: Number,
    permalink: String,
    title: String,
    authorId: String,
    author: String,
    created: {
        type: Date, 
        default: Date.now
    },    
    isRemoved: {
        type: Boolean,
        default: false
    },
    body: String,
    tag: [String],
    comment: [commentSchema] // sub document defined above in commentSchema
});

postSchema.virtual('dateFormat').get(function(){
    return this.created.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
});


postSchema.virtual('bodyHTML').get(function(){
    return markdown.toHTML(this.body);
});

commentSchema.set('toObject',{
    getters: true,
    virtuals: true
});
postSchema.set('toObject', {
    getters: true,
    virtuals: true
});

module.exports = mongoose.model('post', postSchema); //The file name === model name (first parameter, second parameter is the schema name)
