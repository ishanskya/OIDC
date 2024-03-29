function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);


var config = {
    authority: "https://demo.identityserver.io/",
    client_id: "interactive.public",
    redirect_uri: "http://localhost:18622/callback.html",
    response_type: "code",
    scope:"openid profile",
    post_logout_redirect_uri: "http://localhost:18622/index.html",
};
var mgr = new Oidc.UserManager(config);
Oidc.Log.logger = console;
Oidc.Log.logger.level = Oidc.Log.INFO;

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = "https://demo.identityserver.io/connect/userinfo";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}