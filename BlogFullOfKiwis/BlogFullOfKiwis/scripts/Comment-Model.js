var app = app || {};

(function(){

    var Comment = function(url){
        this.url = url;
    };

    Comment.prototype.getSpecifyComment = function(querryUrl, success, error){
        app.makeRequest("GET", this.url + querryUrl, null, success, error);
    };

    Comment.prototype.postComment = function(data, success, error){
        app.makeRequest("POST", this.url, data, success, error);
    };

    Comment.prototype.editComment = function(id, data, success, error){
        app.makeRequest("PUT", this.url + id, data, success, error);
    };

    Comment.prototype.deleteComment = function(id, success, error){
        app.makeRequest("DELETE", this.url + id, success, error);
    };

    app.module.Comment = new Comment('https://api.parse.com/1/classes/Comment/');
}());