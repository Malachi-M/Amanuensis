var form = document.createElement( 'form' );
form.setAttribute( 'method', 'get' );
form.setAttribute( 'action', "" );
form.setAttribute( 'enctype', 'application/json');
form.className = "post-form";

var labelAuthor = document.createElement( 'label' );
var textNodeAuthor = document.createTextNode( 'Author: ' );
var inputAuthor = document.createElement( 'input' );
inputAuthor.setAttribute( 'type', 'text' );
inputAuthor.setAttribute( 'name', 'author' );
inputAuthor.setAttribute( 'size', '70' );

var labelTitle = document.createElement( 'label' );
var textNodeTitle = document.createTextNode( 'Title: ');
var inputTitle = document.createElement( 'input' );
inputTitle.setAttribute( 'type','text' );
inputTitle.setAttribute( 'name', 'title' );
inputTitle.setAttribute( 'size', '70' );

var labelBody = document.createElement( 'label' );
var textNodeBody = document.createTextNode( 'Post Body: ' );
var inputBody = document.createElement( 'textarea' );
inputBody.setAttribute( 'name', 'body' );
inputBody.setAttribute( 'cols', '70' );
inputBody.setAttribute( 'rows', '10' );

var labelTags = document.createElement( 'label' );
var textNodeTags = document.createTextNode( 'Tags: ' );
var inputTag = document.createElement( 'input' );   
inputTag.setAttribute( 'name', 'tag' );
inputTag.setAttribute( 'type', 'text' );
inputTag.setAttribute( 'size', '70' );

var formSubmit = document.createElement( 'input' );
formSubmit.setAttribute( 'type', 'submit' );
formSubmit.setAttribute( 'value', 'Submit' );

labelAuthor.appendChild( textNodeAuthor );
labelAuthor.appendChild( inputAuthor );
labelTitle.appendChild( textNodeTitle );
labelTitle.appendChild( inputTitle );
labelBody.appendChild( textNodeBody );
labelBody.appendChild( inputBody );
labelTags.appendChild( textNodeTags );
labelTags.appendChild( inputTag );


form.appendChild( labelAuthor );
form.appendChild( labelTitle );
form.appendChild( labelBody );
form.appendChild( labelTags );

form.appendChild( formSubmit );

var body = document.querySelector('body');
body.appendChild( form );