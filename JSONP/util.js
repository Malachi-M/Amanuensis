 function getJSONP( path ){
 		var script = document.createElement('script');
 		script.src = path
 		document.appendChild( script );
 }