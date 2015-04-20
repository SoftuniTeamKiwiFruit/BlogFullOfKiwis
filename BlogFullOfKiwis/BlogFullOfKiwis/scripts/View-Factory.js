var app = app || {};

(function(){

    function ViewFactory(model){
        this.model = model;
    }

    ViewFactory.prototype.loadPosts = function(){
        this.model.Post.getAllPosts(function(data){
            for(var i = 0; i < data.results.length; i++){
                var post = $("<article/>").attr('id', data.results[i].objectId);
                var showCommentButton = $('<button>Show comments</button>').attr('id', 'show-comments' + i);
                post.append("<h3>" + data.results[i].title +"</h3>")
                    .append("<p>" + data.results[i].content +"</p>")
                    .append(showCommentButton);
                $('#sideBar').append(post);
            }
        },
        function(err){console.log(err.responseText)});
    };

    if(sessionStorage.sessionToken){
        $('#login').remove();
    }
    else{
        $('#adminForm').remove();
    }

    app.module.ViewFactory =  ViewFactory;
}());
