/*
    Handlebars Implementation
*/
var postTemplate = Handlebars.compile( templateSource );

function createPostFromTemplate( post ) {
	return postTemplate( post );
}

function renderPostWithTemplate( posts ) {
	var container = document.querySelector('.post-container');

	posts.map( createPostFromTemplate ).forEach(function( postHTML ){
		container.innerHTML += postHTML;
	});
}

renderPostWithTemplate( window.posts );