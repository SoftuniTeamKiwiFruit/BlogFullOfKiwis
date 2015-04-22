var app = app || {};

(function(){

    var MakeRequest = function(method, baseUrl, data, success, error){
        $.ajax({
            method: method,
            headers:{
                'X-Parse-Application-Id' : 'mnDVAKQjjyFUimhjtoIiJe9b64eoglNuBXPUlGHq',
                'X-Parse-REST-API-Key' : 'AxRofCko80JSRyaZRoip8SU1B40UmbYTEKGwhSCc',
                'X-Parse-Session-Token' : sessionStorage.sessionToken
            },
            url: baseUrl,
            data: data
        }).success(success).error(error)
    };

    app.makeRequest = MakeRequest;
}());