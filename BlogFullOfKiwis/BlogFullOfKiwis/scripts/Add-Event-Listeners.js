var app = app || {};

(function(){
    function addEventListeners(module){
        $('#loginButton').on('click',app.login);
        $('#addPost').on('click', post);
        $(document).on('click', $('button'), showComments);
        $('#logoutButton').on('click', logout);

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

        function showComments() {
            var buttonId ='#' + ($(this).context.activeElement.id);
            var articleId = $(buttonId).parent().attr('id');
            var querryUrl = '/?where={ "postPointer":{"__type": "Pointer","className": "Post","objectId": "' + articleId + '"}}';
            module.Comment.getSpecifyComment(querryUrl, success, error);

            function success(data) {
                for (var i = 0; i < data.results.length; i++) {
                    var content,
                        visitorName,
                        idIndex,
                        contentHolder;
                    idIndex = i;
                    content = data.results[i].content;
                    visitorName = 'from ' + data.results[i].visitorName + ': ';
                    contentHolder = $('<section>').attr('id', 'comments-' + idIndex).html(visitorName + content);
                    contentHolder.attr('class', 'comment-holder');
                    $('#' + articleId).append(contentHolder);
                }
            }

            function error(err) {
                console.log(err.responseText);
            }
        }

        function logout(){
            sessionStorage.clear();
            location.reload();
        }
    }

    app.addEventListeners = addEventListeners;
}());