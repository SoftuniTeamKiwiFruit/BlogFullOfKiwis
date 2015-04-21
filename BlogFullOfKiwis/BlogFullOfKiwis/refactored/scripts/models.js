var app = app || {};

app.models = (function() {
    function Models(baseUrl) {
        this.baseUrl = baseUrl;
        this.posts = new Posts(this.baseUrl);
        this.comments = new Comments(this.baseUrl);
    }

    var Posts = (function(){
        function Posts(baseUrl) {
            this.serviceUrl = baseUrl + 'Post'
        }

        Posts.prototype.getAllPosts = function(success, error){
            app.makeRequest("GET", this.serviceUrl, null, success, error)
        };

        Posts.prototype.addPost = function(data, success, error){
            app.makeRequest("POST", this.serviceUrl, data, success, error);
        };

        Posts.prototype.editPost = function(id, data, success, error){
            app.makeRequest("PUT", this.serviceUrl + '/' + id, data, success, error);
        };

        Posts.prototype.deletePost = function(id, success, error){
            app.makeRequest("DELETE", this.serviceUrl + '/' +  id, success, error);
        };

        return Posts;
    }());

    var Comments = (function(){
        function Comments(baseUrl) {
            this.serviceUrl = baseUrl + 'Comment'
        }

        Comments.prototype.getSpecifyComment = function(querryUrl, success, error){
            app.makeRequest("GET", this.serviceUrl + '/' + querryUrl, null, success, error);
        };

        Comments.prototype.postComment = function(data, success, error){
            app.makeRequest("POST", this.serviceUrl, data, success, error);
        };

        Comments.prototype.editComment = function(id, data, success, error){
            app.makeRequest("PUT", this.serviceUrl + id, data, success, error);
        };

        Comments.prototype.deleteComment = function(id, success, error){
            app.makeRequest("DELETE", this.serviceUrl + id, success, error);
        };

        return Comments;
    }());

    return {
        loadModels: function(baseUrl) {
            return new Models(baseUrl);
        }
    }
}());