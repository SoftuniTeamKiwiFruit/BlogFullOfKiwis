var app = app || {};

app.viewFactory = (function(){

    function ViewFactory(model){
        this.model = model;
        this.attachEventListeners(this);
    }

    ViewFactory.prototype.loadPosts = function(){
        var _this = this;
        this.model.posts.getAllPosts(function(data){
            for(var i = 0; i < data.results.length; i++){
                var post = $("<article/>").attr('data-id', data.results[i].objectId);
                var showCommentButton = $('<button>Show comments</button>').attr('class', 'show-comments')
                    .on('click', function(ev){
                        if(ev.target.innerText == 'Show comments') {
                            _this.showComments(ev)
                        }
                        else if(ev.target.innerText == 'Hide comments') {
                            _this.hideComments(ev);
                        }
                    });
                post.append("<h3>" + data.results[i].title +"</h3>")
                    .append("<p>" + data.results[i].content +"</p>")
                    .append($('<span class="visits">'))
                    .append(showCommentButton);
                $('#sideBar').append(post);
                _this.showPostVisits(data.results[i].objectId);
            }
        },
        function(err){console.log(err.responseText)});
    };

    ViewFactory.prototype.addPost = function(){
        var title = $('#postTitle').val();
        var content = $('#postContent').val();
        var data = JSON.stringify({
            'title': title,
            'content': content,
            ACL: {
                "*": {"read": true, "write": true}
            }
        });
        this.model.posts.addPost(data,function(){
                //tova ne trqbva da e s reload, a po skoro prosto da ima funciq addToDom i da se izpylni.
                location.reload();
            },
            function(err){console.log(err.responseText)});
    }

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
        };

        function error(err) {
            console.log(err.responseText);
        }
    }

    ViewFactory.prototype.hideComments = function(ev) {
        var clickedElement = $(ev.target);
        clickedElement.parent().find('.comments-holder').remove();
        clickedElement.text('Show comments');
    }

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

    ViewFactory.prototype.attachEventListeners = function (viewFactory) {
        $('#addPost').on('click', function(){
            viewFactory.addPost();
        });

        $('#loginButton').on('click',function(){
            viewFactory.loginView()
        });

    };

    ViewFactory.prototype.showSinglePost = function (objectId) {
        var _this = this;
        this.model.posts.getPostById(objectId, function(data){
            var visitsPlusPlus = data.visits+1;
            var newData = JSON.stringify({'visits': visitsPlusPlus});

            _this.model.posts.editPost(objectId,
                newData,
                function(){console.log('success')},
                function(err){console.log(err.responseText)});

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
        console.log('visits returned ' + visits)
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
        $('#loginForm').remove();
    }

    return {
        loadViewFactory: function (model) {
            return new ViewFactory(model);
        }
    }
}());
