function createCommentBlock( commentsContainer, comment ){
    var commentsAuthor = document.createElement( 'h5' );
        commentsAuthor.className = "post-comment-author";
    var commentCreated = document.createElement( 'time' );
        commentCreated.className = "post-comment-created";
    var commentBody = document.createElement( 'p' );
        commentBody.className = "post-comment-body";
    var commentDelimiter = document.createElement( 'hr' );
    
    var textNodeCommentAuthor = document.createTextNode( comment.author );
    var textNodeCommentCreated = document.createTextNode( comment.created ); 
    var textNodeCommentBody = document.createTextNode( comment.body );
    
    commentsAuthor.appendChild( textNodeCommentAuthor );
    commentCreated.appendChild( textNodeCommentCreated );
    commentBody.appendChild( textNodeCommentBody );

    commentsContainer.appendChild( commentDelimiter );
    commentsContainer.appendChild( commentsAuthor );
    commentsContainer.appendChild( commentCreated );
    commentsContainer.appendChild( commentBody );
}


function createPostElement( post ){
    
    var postContainer = document.createElement( 'article' )
        postContainer.className = "post-blog-entry";
    var title = document.createElement( 'h1' );
        title.className = "post-title";
    var author = document.createElement( 'h4' );
        author.className = "post-author";
    var postTime = document.createElement( 'time');
        postTime.className = "post-created";
    var postBody = document.createElement( 'p' );
        postBody.className = "post-body";
    var tagList = document.createElement( 'ul' );
        tagList.className = "post-tags";
    var commentsContainer = document.createElement( 'aside' );
        commentsContainer.className = "post-commentsContainer";
    
    
    var textNodeTitle = document.createTextNode( post.title );
    var textNodeAuthor = document.createTextNode( post.author );
    var textNodePostTime = document.createTextNode( post.created );
    var textNodePostBody = document.createTextNode( post.body );
    
    var tags = post.tag.forEach( function( obj ){
        var tagItem = document.createElement( 'li' );
        tagItem.className = "post-tag-item";
        tagItem.appendChild(document.createTextNode( obj ));
        tagList.appendChild( tagItem );
    });
    
     var comments = post.comment.map( function( obj ){
        return createCommentBlock( commentsContainer, obj );
    });
    
    
    author.appendChild( textNodeAuthor );
    title.appendChild( textNodeTitle );
    postTime.appendChild( textNodePostTime );
    postBody.appendChild( textNodePostBody)

    
    
    postContainer.appendChild( title );
    postContainer.appendChild( author );
    postContainer.appendChild( postTime );
    postContainer.appendChild( postBody );
    postContainer.appendChild( tagList );
    postContainer.appendChild( commentsContainer );
   
    return postContainer;
}
function renderPostElement( posts ){
    
    var container = document.querySelector( "section" );
    var elements = posts.map( createPostElement ).forEach(function( element ){
    container.appendChild( element );
    })
}
getJSON('post.json', renderPostElement);