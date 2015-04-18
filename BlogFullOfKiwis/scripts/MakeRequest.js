var app = app || {};

(function(){
    var MakeRequest = function(method, baseUrl, data, success, error) {
        $.ajax({
            method: method,
            headers: {
                'X-Parse-Application-Id': '5k4RvSznrQPfvnd87PjLJNfIDgIHtJyN0F46Vg75',
                'X-Parse-REST-API-Key': 'LXyzL8F0gvdHLwMhGkhE6BJIQb9ilAQQBJBwRLyE'
            },
            url: baseUrl,
            data: data
        }).success(success).error(error);
    };

    app.makeRequest = MakeRequest;
    app.module = {};
}());