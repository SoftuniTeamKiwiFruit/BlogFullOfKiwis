var app = app || {};

(function(){
    var post = new app.module.Post('https://api.parse.com/1/classes/');
    var comment = new app.module.Comment('https://api.parse.com/1/classes/');
    var postFactory = new app.module.ViewFactory(post);
    postFactory.loadPosts();

    app.addEventListeners(post);
}());