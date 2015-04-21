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
                    .append(showCommentButton);
                $('#sideBar').append(post);
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

    if(sessionStorage.sessionToken){
        $('#loginForm').remove();
    }

    return {
        loadViewFactory: function (model) {
            return new ViewFactory(model);
        }
    }
}());
