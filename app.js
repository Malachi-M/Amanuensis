// Requiring dependent modules
var express = require( 'express' );
var bodyParser = require( "body-parser" );
var hbs = require( "hbs" );
var stylus = require( 'stylus' );
var low = require( 'lowdb' );


var db = low( './public/Data/post.json' );

var app = express(); // Initiating a new express instance.


app.set( 'view engine', 'html' ); // Setting the views for the templates to be read as html files from the handlebar engine.
app.engine( 'html', hbs.__express );

app.use(stylus.middleware(__dirname + '/public/css'));

app.set( 'port', process.env.PORT || 1337 );// Setting the Port and IP as either system determined or hardcoded.
app.set( 'ip', process.env.IP || '127.0.0.1' );

app.use(express.static( 'public' ));// Static files served from '/public'

app.get( '/', function( req, res, next ){ // Index served
    var postData = db( 'posts' );

     res.render( 'index', {
         title: "Amanuensis - Simple Blogs",
         posts: postData.where().value()
     });
});

app.get( '/admin/post/create', function( req, res, next ){ // stub for creating a post
    res.render( 'createPost', {
        title: "Create a Post!"
    });
});

app.get( '/admin/post/edit', function( req, res, next ){ // stub for editing commments
    res.render( 'editPost', {
        title: "Edit a Post!"
    });
});

app.get( '/comment/create', function( req, res, next ){ // stub for creating comments
    res.render( 'createPost', {
        title: "Create a Post!"
    });
});

app.get( '/comment/edit', function( req, res, next ){
    res.render( 'editComment', {
        title: "Edit a Comment!"
    });
});

app.get( '/post/view/:id', function( req, res, next ){
    var postData = db( 'posts' );

    var post = postData.find({id: +  req.params.id}).value();
    if ( post ){
        res.render( 'view', {
            title: postData.title,
            post: post
        });
    } else {
        res.render( 'view', {
           title: "This Post Does Not Exist!",
           notification: {
               severity: "error",
               message: "These are not the posts you are looking for. Move along."
           }
        });
    }

});

app.use(function( req, res ){ // 404 routing. "console.warn()" is equivalent to "console.error"
    console.warn( '404 Page Evaporated: %s', req.orginalUrl );
    res.status( 404 ).render( 'index', {
        notification: {
            severity: "error",
            message: "Hey fella, your page percolated outta the internets. Next time perhaps!"
        }
    })
});

app.use(function( err, req, res, next ){ // Internal Server error
    console.log( err.stack );

    res.status( 500 ).render( 'index', {
        notification: {
            severity: "error",
            message: "The Force is strong with this one.\n Let us regroup and then retry!"
        }
    })
})

var server = app.listen( app.get( 'port' ), app.get( 'ip' ), function(){
    var address = server.address();
    console.log( "The Roof, The Roof, The Roof is on Fire! \n We don't need no water let the Mother $%#@a burn." );
    console.log( "Amanuensis is up and running on https://%s:%s", address.address, address.port );
});
