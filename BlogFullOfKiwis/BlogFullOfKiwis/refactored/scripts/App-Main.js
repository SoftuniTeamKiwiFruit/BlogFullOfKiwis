var app = app || {};

(function(){
    var model = app.models.loadModels('https://api.parse.com/1/classes/');
    var viewModel = new app.viewFactory.loadViewFactory(model);
    viewModel.loadPosts();
    viewModel.loadTags();

    //viewModel.showPostVisits('bjFWrj8ZIK');

    var data = JSON.stringify({
       tags: {
           __op: "AddRelation",
           objects: [{
                __type: 'Pointer',
               className : 'Tag',
               objectId: '9yEQ6kAxbQ'
           }]
       }
    });
    var data2 = JSON.stringify({
        post: {
            __op: "AddRelation",
            objects: [{
                __type: 'Pointer',
                className : 'Post',
                objectId: 'CavvKmnrki'
            }]
        }
    });
    //app.makeRequest("PUT", "https://api.parse.com/1/classes/Post/CavvKmnrki", data, function(data){console.log(data)},
    //function(err){console.log(err.responseText)})

    //app.makeRequest("PUT", "https://api.parse.com/1/classes/Tag/J7B83whnWp", data2, function(data){console.log(data)},
        //function(err){console.log(err.responseText)})

}());