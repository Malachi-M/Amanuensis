function Editor(input, preview) {
    this.update = function() {
        preview.innerHTML = markdown.toHTML(input.value);
    };
    input.editor = this;
    this.update();
}
var $ = function(id) {
    return document.getElementById(id);
};
new Editor($("text-input"), $("preview"));

var form = document.querySelector('.post-form');
var body = document.querySelector('textarea[name="body"]');

form.addEventListener('submit', function(evt) {
    /*body.value = "";
    body.value = document.getElementById('preview').innerHTML;
    */

    if (body.value === "") {
        alert("This is an empty post!");
        evt.preventDefault();
    }
    //return false;
});