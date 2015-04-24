var app = app || {};

(function(){
    var model = app.models.loadModels('https://api.parse.com/1/classes/');
    var viewModel = new app.viewFactory.loadViewFactory(model);
    viewModel.loadPosts();
    viewModel.loadTags();

    //This on works ->
    // viewModel.showSinglePost('Whhzo7kNut');
}());