var app = app || {};

(function(){

    var Comment = function(url){
        this.url = url;
    };

    Comment.prototype.getAllComment = function(success, error){
        app.makeRequest("GET", this.url + 'Comment/', null, success, error);
    };

    Comment.prototype.postPost = function(data, success, error){
        app.makeRequest("POST", this.url + 'Comment/', data, success, error);
    };

    Comment.prototype.editPost = function(id, data, success, error){
        app.makeRequest("PUT", this.url + 'Comment/' + id, data, success, error);
    };

    Comment.prototype.deletePost = function(id, success, error){
        app.makeRequest("DELETE", this.url + 'Comment/' + id, success, error);
    };

    app.module.comment = Comment;
}());