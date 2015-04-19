var app = app || {};

(function(){

    var postFactory = new app.module.ViewFactory(app.module);
    postFactory.loadPosts();

    app.addEventListeners(app.module);
}());