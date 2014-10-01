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

var labelBody = document.createElement( 'label' );
var textNodeBody = document.createTextNode( 'Post Body: ' );
var inputBody = document.createElement( 'textarea' );
inputBody.setAttribute( 'name', 'body' );
inputBody.setAttribute( 'cols', '70' );
inputBody.setAttribute( 'rows', '10' );

var formSubmit = document.createElement( 'input' );
formSubmit.setAttribute( 'type', 'submit' );
formSubmit.setAttribute( 'value', 'Submit' );

labelAuthor.appendChild( textNodeAuthor );
labelAuthor.appendChild( inputAuthor );
labelBody.appendChild( textNodeBody );
labelBody.appendChild( inputBody );

form.appendChild( labelAuthor );
form.appendChild( labelBody );


form.appendChild( formSubmit );

var body = document.querySelector('body');
body.appendChild( form );