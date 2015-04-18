var app = app || {};

(function(){
    function login(){
        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            method: 'GET',
            headers: {
                'X-Parse-Application-Id' : 'mnDVAKQjjyFUimhjtoIiJe9b64eoglNuBXPUlGHq',
                'X-Parse-REST-API-Key' : 'AxRofCko80JSRyaZRoip8SU1B40UmbYTEKGwhSCc'
            },
            url: 'https://api.parse.com/1/login?username=' + username + '&password=' + password
        }).success(function(data){
            sessionStorage['sessionToken'] = data.sessionToken;
            location.reload();
        }).error(function(err){
                console.log(err.responseText);
                console.log(err.responseText);
            })
    }

    app.login = login
}());