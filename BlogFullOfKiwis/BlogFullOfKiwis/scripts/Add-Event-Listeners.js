var app = app || {};

(function(){
    function addEventListeners(module){
        $('#loginButton').on('click',app.login);
        $('#addPost').on('click', post);

        function post(){
            var title = $('#postTitle').val();
            var content = $('#postContent').val();
            var data = JSON.stringify({
                'title': title,
                'content': content,
                ACL: {
                    "*": {"read": true, "write": true}
                }
            });
            module.Post.postPost(data,function(){
                    location.reload();
                },
                function(err){console.log(err.responseText)});
        }
    }

    app.addEventListeners = addEventListeners;
}());