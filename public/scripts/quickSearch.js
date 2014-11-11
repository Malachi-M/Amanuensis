(function initSearch(){
    //reveal an element!
    function reveal(el){
        el.classList.remove('hidden');
        return el;
    }
    
    //make an element hidden!
    function obfuscate(el){
        el.classList.add('hidden');
    }
    
    //Find the posts on the page. Find the search box
    var posts = [].slice.call(document.querySelectorAll('.post-container > .post-blog-entry'));
    var searchField = document.querySelector('.search-input');
    
    if(searchField){
        //Filter
        searchField.onkeyup = function(){
            var value = this.value;
            posts.map(reveal).filter(function(post){
                return post.textContent.toLowerCase().indexOf(value.toLowerCase()) === -1;
            }).forEach(obfuscate);
        };
    }
})();