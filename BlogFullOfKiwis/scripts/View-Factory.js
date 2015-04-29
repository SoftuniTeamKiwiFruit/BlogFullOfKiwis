var app = app || {};

app.viewFactory = (function(){

    function ViewFactory(model){
        this.model = model;
        this.attachEventListeners(this);
    }

    ViewFactory.prototype.loadSinglePost = function(data, postData, index, selector){
        var postId = data.objectId;
        var _this = this;
        var post = $("<article/>").attr('data-id', postId);
        var showCommentButton = $('<button>Show comments</button>').attr('class', 'show-comments')
            .on('click', function(ev){
                if(ev.target.innerText == 'Show comments') {
                    _this.showComments(ev)
                }
                else if(ev.target.innerText == 'Hide comments') {
                    _this.hideComments(ev);
                }
            });
        var commentButton = $('<button id = "addComment" >Add Comment</button>');
        commentButton.attr('class', 'show-comments');

        commentButton.on('click', function(ev){
            var id = ev.target.parentNode.getAttribute("data-id");
            var name = $('<input type="text" placeholder="Enter Name" id="commentName"> ');
            var content = $('<input type="text" placeholder="Enter Content" id="commentTitle"> ');
            var email = $('<input type="text" placeholder="Enter Email" id="commentEmail"> ');
            var button = $('<button>Add Comment</button>');
            button.on('click', function(){
                var commentData = JSON.stringify({
                    visitorName : name.val(),
                    email: email.val(),
                    content: content.val(),
                    postPointer : {"__type":"Pointer","className":"Post","objectId": id}
                });
                _this.model.comments.addComment(commentData ,function(data){
                    location.reload();
                }, function(err){console.log(err.responseText)})
            });
            $('#'+id)
                .append(name)
                .append(content)
                .append(email)
                .append(button);
        });

        var deleteBtn = $('<button id = "delete" class="show-comments">Delete</button>');
        deleteBtn.on('click',function(ev){
            var id = ev.target.parentNode.getAttribute("data-id");
            _this.model.posts.deletePost(id,function(data){console.log(data)},function(err){console.log(err.responseText)});
            setTimeout(function(){location.reload()},1000);
        });
        post.append($('<h3>').text(data.title).on('click', function(ev) {
            var id = $(ev.target).parent().data('id');
            _this.showSinglePost(id);
        }))
            .append("<p>" + data.content +"</p>")
            .append($('<span class="visits">'))
            .append($('<p id = ' + postId + '></p>'))
            .append(showCommentButton)
            .append(commentButton);
        if(sessionStorage.sessionToken){
            post.append(deleteBtn);
        }
        $(selector).append(post);


        this.showPostVisits(postId);
        this.model.tags.getAddedTags(postId,
            function(data){
                for(var i = 0; i < data.results.length; i++){
                    $('#'+postData.results[index].objectId).append(' #' + data.results[i].name);
                }
            },
            function(err){console.log(err.responseText)})
    };

    ViewFactory.prototype.loadPosts = function(){
        var _this = this;
        this.model.posts.getAllPosts(function(data){
            var postData = data;
            _this.postData = data;
            for(var i = 0; i < data.results.length; i++){
                _this.loadSinglePost(data.results[i], postData, i, '#sideBar');
            }
        },
        function(err){console.log(err.responseText)});
    };

    ViewFactory.prototype.addPost = function(){
        var title = $('#postTitle').val();
        var content = $('#postContent').val();
        var tags = $('#addTags').val().split(/[ #,]+/);
        tags = tags.filter(function(n){ return n != '' });
        var ids = this.model.tags.getIds(tags);
        var data = JSON.stringify({
            'title': title,
            'content': content,
            ACL: {
                "*": {"read": true, "write": true}
            }
        });
        var _this = this;
        this.model.posts.addPost(data,function(data){
                var id = data.objectId;
                _this.model.posts.addTags(id, ids, function(data){console.log(data)},function(err){console.log(err.responseText)});
                _this.model.tags.addPostToTags(id, ids, function(data){console.log(data)}, function(err){console.log(err.responseText)});
                _this.model.visits.initVisits(id, function(data){console.log(data)},function(err){console.log(err.responseText)});
                setTimeout(function(){location.reload()},1000);
            },
            function(err){console.log(err.responseText)});
    };

    ViewFactory.prototype.showComments = function(ev) {
        var clickedElement = ev.target;
        var articleId = $(clickedElement).parent().data('id');
        var querryUrl = '/?where={ "postPointer":{"__type": "Pointer","className": "Post","objectId": "' + articleId + '"}}';

        this.model.comments.getSpecifyComment(querryUrl, success, error);

        function success(data) {
            $(clickedElement).text('Hide comments');
            var commentHolder = $('<div>').addClass('comments-holder').appendTo($('[data-id="' + articleId + '"]'));
            for (var i = 0; i < data.results.length; i++) {
                console.log(data.results[i])
                var content,
                    visitorName,
                    idIndex,
                    contentHolder,
                    currentItem = data.results[i];
                idIndex = i;
                content = currentItem.content;
                visitorName = 'from ' + currentItem.visitorName + ': ';
                contentHolder = $('<section>').attr('class', 'comments-' + idIndex).text(visitorName + content);
                commentHolder.append(contentHolder);
            }
        }

        function error(err) {
            console.log(err.responseText);
        }
    };

    ViewFactory.prototype.hideComments = function(ev) {
        var clickedElement = $(ev.target);
        clickedElement.parent().find('.comments-holder').remove();
        clickedElement.text('Show comments');
    };

    ViewFactory.prototype.loginView = function() {
        var username = $('#username').val();
        var password = $('#password').val();

        this.model.users.login(username, password, function(data){
            sessionStorage.sessionToken = data.sessionToken;
            location.reload();
        }, function(err){
            console.log(err.responseText);
        })

    };

    ViewFactory.prototype.logoutView = function() {
        this.model.users.logout();
        location.reload();
    };

    ViewFactory.prototype.attachEventListeners = function (viewFactory) {
        var _this = this;
        $('#addPost').on('click', function(){
            viewFactory.addPost();
        });

        $('#loginButton').on('click',function(){
            viewFactory.loginView()
        });

        $('#logoutButton').on('click', function(){
            viewFactory.logoutView();
        });

        $('#backToAllPosts').on('click', function(){
            viewFactory.backToAllPosts();
        });

        $('#searchBtn').on('click', function(){
            var tags = $('#search').val();
            var tagNames = tags.split(/[ #,]+/);
            var ids = _this.model.tags.getIds(tagNames);
            _this.model.posts.searchByTags(ids);
            setTimeout(function(){
                var result = _this.model.posts.searchResults;
                $('#searchResult').empty();
                var index = 0;
                result.forEach(function(post){
                    _this.loadSinglePost(post, _this.postData, index, '#searchResult');
                    index++;
                })
            },1500);
        });

    };

    ViewFactory.prototype.showSinglePost = function (objectId) {
        var _this = this;
        this.model.posts.getPostById(objectId, function(data){
            _this.model.visits.getPostVisits(objectId,
                function(data){
                    var visits = data.results[0].postVisits,
                        visitId = data.results[0].objectId;
                    _this.model.visits.incrementPostVisit(visitId, visits, function(data){console.log(data), function(err){console.log(err.responseText)}})
                },
                function(err){
                    console.log(err.responseText);
                });

            $('#sideBar').empty();

            printPost(data);


            }, function(err) {
            console.log(err.responseText)
        })
    };

    ViewFactory.prototype.showPostVisits = function (objectId) {
        this.model.visits.getPostVisits(objectId,
            function(data){
                returnVisits(data, objectId)
            },
            function(err){
                console.log(err.responseText);
            });
    };

    function returnVisits(data, objectId) {
        var visits,
            postContainer = $('[data-id="' + objectId + '"]'),
            visitsContainer = postContainer.find('.visits');

        if (data.results.length>0) {
            visits = data.results[0].postVisits;
        }
        else {
            visits = 0;
        }
        visitsContainer.text(visits);
    }

    ViewFactory.prototype.incrementPostVisit = function (objectId) {

    }

    ViewFactory.prototype.loadTags = function(){
        this.model.tags.getTags(function(data){
                data.results.forEach(function(tag){
                    $('#tags').append(" #" + tag.name );
                })
            },
            function(err){
                console.log(err.responseText);
            });
    };

    if(sessionStorage.sessionToken){
        $('.loginUsername').addClass('hidden');
        $('.loginPassword').addClass('hidden');
        $('#greeting').html('Hello, Admin');    
    }
    else{
        $('#logoutButton').remove();
        $('#createPostForm').remove();
    }

    function printPost(data) {
        var _this = this,
            postId = data.objectId,
            postTitle = data.title,
            postContent = data.content;

        var post = $("<article/>").attr('data-id', postId);
        var showCommentButton = $('<button>Show comments</button>').attr('class', 'show-comments')
            .on('click', function(ev){
                if(ev.target.innerText == 'Show comments') {
                    _this.showComments(ev)
                }
                else if(ev.target.innerText == 'Hide comments') {
                    _this.hideComments(ev);
                }
            });
        var deleteBtn = $('<button id = "delete" >Delete</button>');
        deleteBtn.on('click',function(ev){
            var id = ev.target.parentNode.getAttribute("data-id");
            _this.model.posts.deletePost(id,function(data){console.log(data)},function(err){console.log(err.responseText)});
            setTimeout(function(){location.reload()},1000);
        });
        post.append("<h3>" + postTitle +"</h3>")
            .append("<p>" + postContent +"</p>")
            .append($('<span class="visits">'))
            .append($('<p id = ' + postId + '></p>'))
            .append(showCommentButton)
            .append(deleteBtn);
        $('#sideBar').append(post);

        _this.showPostVisits(postId);
    }

    ViewFactory.prototype.backToAllPosts = function() {
        $('#sideBar').empty();
        this.loadPosts();
    };

    return {
        loadViewFactory: function (model) {
            return new ViewFactory(model);
        }
    }
}());
