 function getJSON( path, callback ){
 
 	var xhr= new XMLHttpRequest();
	xhr.open( 'get', path, true);
	xhr.onload = function(){ 
		// this.responseText;
		var json = this.responseText;
		var data = JSON.parse(json);
		callback( data );
 	};
	 xhr.send();
 }