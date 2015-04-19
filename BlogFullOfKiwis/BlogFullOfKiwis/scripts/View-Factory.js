var app = app || {};

(function(){

    function ViewFactory(model){
        this.model = model;
    }

    ViewFactory.prototype.loadPosts = function(){
        this.model.Post.getAllPosts(function(data){
            for(var i = 0; i < data.results.length; i++){
                var post = $("<article/>").attr('id', data.results[i].objectId);
                post.append("<h3>" + data.results[i].title +"</h3>")
                    .append("<p>" + data.results[i].content +"</p>");
                $('#sideBar').append(post);
            }
        },
        function(err){console.log(err.responseText)});
    };



    if(sessionStorage.sessionToken){
        $('#loginForm').remove();
    }

    app.module.ViewFactory =  ViewFactory;
}());
