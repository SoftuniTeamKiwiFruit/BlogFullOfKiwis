var app = app || {};

app.models = (function() {
    function Models(baseUrl) {
        this.baseUrl = baseUrl;
        this.posts = new Posts(this.baseUrl);
        this.comments = new Comments(this.baseUrl);
        this.users = new Users(this.baseUrl);
        this.visits = new Visits(this.baseUrl);
        this.tags = new Tags(this.baseUrl);
    }

    var Posts = (function(){
        function Posts(baseUrl) {
            this.serviceUrl = baseUrl + 'Post'
        }

        Posts.prototype.getAllPosts = function(success, error){
            app.makeRequest("GET", this.serviceUrl, null, success, error)
        };

        Posts.prototype.getPostById = function(id, success, error){
            app.makeRequest("GET", this.serviceUrl + '/' + id, null, success, error);
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

        Posts.prototype.addTags = function(id, tags, sucess, error){

            for(var i = 0; i <= tags.length; i++){
                var data = JSON.stringify({
                    tags: {
                        __op: "AddRelation",
                        objects: [{
                            __type: 'Pointer',
                            className : 'Tag',
                            objectId: tags[i]
                        }]
                    }
                });
                app.makeRequest("PUT", "https://api.parse.com/1/classes/Post/" + id, data, function(data){console.log(data)},
                function(err){console.log(err.responseText)})
            }
        };
        Posts.prototype.getAddedTags = function(id, success, error){
            app.makeRequest('GET',
                'https://api.parse.com/1/classes/Tag?where={"$relatedTo":{"object":{"__type":"Pointer","className":"Post","objectId":"' + id + '"},"key":"tags"}}',
                null, success, error);
        };

        Posts.prototype.searchByTags = function(tags){
            var _this = this;
            var result = [];
            this.getAllPosts(function(data){
                    var posts = data.results;
                    posts.forEach(function(post){
                        _this.getAddedTags(post.objectId, function(data){
                            data.results.forEach(function(tag){
                                tags.forEach(function(id){
                                        if(id == tag.objectId){
                                            result.push(post);
                                        }
                                })
                            })

                            },
                            function(err){console.log(err.responseText)});
                    });
                    setTimeout(function(){_this.searchResults = result},1000);
                },
            function(err){console.log(err.responseText)});
        };

        return Posts;
    }());

    var Comments = (function(){
        function Comments(baseUrl) {
            this.serviceUrl = baseUrl + 'Comment';
        }

        Comments.prototype.getSpecifyComment = function(querryUrl, success, error){
            app.makeRequest("GET", this.serviceUrl + '/' + querryUrl, null, success, error);
        };

        Comments.prototype.addComment = function(data, success, error){
            //to-do pointer to the post -- data
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

    var Users = (function(){
        function Users(){
            this.serviceUrl = 'https://api.parse.com/1/';
        }

        Users.prototype.signUp = function(data, success, error) {
            app.makeRequest('POST', this.serviceUrl + 'users', JSON.stringify(data), success, error);
        };

        Users.prototype.getAllUsers = function(success, error) {
            app.makeRequest('GET', this.serviceUrl + 'users', data, success, error);
        };

        Users.prototype.login = function(username, password, success, error) {
            app.makeRequest('GET', this.serviceUrl + 'login' + '?username=' + username + '&password=' + password, {}, success, error);
        };

        Users.prototype.logout = function() {
            sessionStorage.clear();
        };

        Users.prototype.deteleUser = function(userId, success, error) {
            app.makeRequest('DELETE', this.serviceUrl + 'users/' + userId, success, error);
        };
        return Users;
    }());

    var Tags = (function(){
        function Tags(baseUrl){
            this.serviceUrl = baseUrl + "Tag";
        }

        Tags.prototype.getTags = function(success, error){
            app.makeRequest('GET', this.serviceUrl, null, success, error);
        };

        Tags.prototype.getAddedTags = function(id, success, error){
            app.makeRequest('GET',
this.serviceUrl + '?where={"$relatedTo":{"object":{"__type":"Pointer","className":"Post","objectId":"' + id + '"},"key":"tags"}}',
            null, success, error);
        };

        Tags.prototype.addPostToTags = function(postId, tagids, success, error){
            var data = JSON.stringify({
                post: {
                    __op: "AddRelation",
                    objects: [{
                        __type: 'Pointer',
                        className : 'Post',
                        objectId: postId
                    }]
                }
            });
            tagids.forEach(function(tagId){
                app.makeRequest("PUT", "https://api.parse.com/1/classes/Tag/" + tagId, data, success, error)
            });

        };

        Tags.prototype.getIds = function(tagNames){
            var Ids = [];
            $.ajax({
                method: "GET",
                async: false,
                headers:{
                    'X-Parse-Application-Id' : 'mnDVAKQjjyFUimhjtoIiJe9b64eoglNuBXPUlGHq',
                    'X-Parse-REST-API-Key' : 'AxRofCko80JSRyaZRoip8SU1B40UmbYTEKGwhSCc'
                },
                url: 'https://api.parse.com/1/classes/Tag'
            }).success(function(data){
                tagNames.forEach(function(tagName){
                    data.results.forEach(function(tag){
                        if(tagName == tag.name){
                            Ids.push(tag.objectId);
                        }
                    })
                });
            }).error(function(err){console.log(err.responseText)})
            return Ids;
        };

        return Tags;
    }());

    var Visits = (function(){
        function Visits(baseUrl) {
            this.serviceUrl = baseUrl + 'Visit';
        }

        Visits.prototype.initVisits = function(postId, success, error) {
            var data = JSON.stringify({
                'postVisits': 0,
                'postPointer': {
                    "__type": "Pointer",
                    "className": "Post",
                    "objectId": postId
                }
            });
            app.makeRequest("POST", this.serviceUrl, data, success, error);
        };

        Visits.prototype.getPostVisits = function(postId, success, error) {
            var querryUrl = '/?where={ "postPointer":{"__type": "Pointer","className": "Post","objectId": "' + postId + '"}}';
            app.makeRequest('GET', this.serviceUrl + querryUrl, null, success, error);
        };

        Visits.prototype.incrementPostVisit = function(visitId, currentVisits, success, error){
            var newVisits = currentVisits + 1,
                data = JSON.stringify({
                    'postVisits': newVisits
                });
            console.log(data);

            app.makeRequest("PUT", this.serviceUrl + '/' + visitId, data, success, error);
        };

        return Visits;
    }());

    return {
        loadModels: function(baseUrl) {
            return new Models(baseUrl);
        }
    }
}());