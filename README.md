Amanuensis
==========
A light-weight blogging platform that takes down your thoughts in written form and presents the written word in an elegant voice.
## Project Details
The goal of this project is to empower all voices to be read through a simple platform aimed at providing elegant user facing content.

Each __post__ has the following properties:
- id - A Number identifier for archiving posts
- title - A String providing the post title
- author - A String providing the name of the author
- created - A Date representing the date/time an author posted a blog post
- body - A String providing the content of the blog post
- tag - An Array of Strings containing descriptor tokens about content within the body

Each __comment__ has the following properties
- id - A Number identifier to match up with the correct post as well as archiving comments
- author - A String providing the name of the commentor
- body - A String providing the content of the comment

#### Views
- /post/:addPost
    Displays the page that allows the blogger to create a new post. This is a form @ postCreate.html
---
- /post/:deletePost
    Displays the page that lists out all current posts with an option to be able to delete a particular post.
- /post/:editPost
    Displays the page that will allow the blogger to edit a particular post
- /post/:viewPost
 
- /post/:index

- /comment/:createComment

- /comment/:deleteComment
- 
- - /admin/posts
- /admin/posts/:editPost
- /admin/posts/new