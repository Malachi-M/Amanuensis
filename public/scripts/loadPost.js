
function renderPostWithTemplate( posts ) {
	var container = document.querySelector('.post-container');
	posts.map( Handlebars.templates.posts ).forEach(function( postHTML ){
		container.innerHTML += postHTML;
	});
}
var renderPost = renderPostWithTemplate;

getJSONP( '/scripts/post.js' );