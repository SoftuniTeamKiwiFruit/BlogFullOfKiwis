var app = app || {};

(function(){

    function ViewFactory(model){
        this.model = model;
    }

    ViewFactory.prototype.loadPosts = function(){
        this.model.getAllPosts(function(data){
            console.log(data);
            for(var i = 0; i < data.results.length; i++){
                console.log(i);
                var post = $("<article/>").attr('id', data.results[i].objectId);
                post.append("<h3>" + data.results[i].title +"</h3>")
                    .append("<p>Content: " + data.results[i].content +"</p>");
                console.log($('#sideBar'));
                console.log(post);
                $('#sideBar').append(post);
            }
        },
        function(err){console.log(err.responseText)});
    };



    app.module.ViewFactory = ViewFactory;
}());
