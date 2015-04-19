var app = app || {};

(function(){

    var Post = function(url){
        this.url = url;
    };

    Post.prototype.getAllPosts = function(success, error){
        app.makeRequest("GET", this.url + 'Post/', null, success, error);
    };

    Post.prototype.postPost = function(data, success, error){
        app.makeRequest("POST", this.url + 'Post/', data, success, error);
    };

    Post.prototype.editPost = function(id, data, success, error){
        app.makeRequest("PUT", this.url + 'Post/' + id, data, success, error);
    };

    Post.prototype.deletePost = function(id, success, error){
        app.makeRequest("DELETE", this.url + 'Post/' + id, success, error);
    };

    app.module.Post = new Post('https://api.parse.com/1/classes/');
}());