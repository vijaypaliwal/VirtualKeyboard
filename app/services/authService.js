'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', 'log', function ($http, $q, localStorageService, ngAuthSettings,log) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };

    var _login = function (loginData) {

        var data = "UserName=" + loginData.userName + "&Password=" + loginData.password + "&AccountName=" + loginData.account;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }
        $("#loginBtn").addClass("disabled");
        $("#loginBtn").find(".fa").removeClass("fa-sign-in").addClass("fa-spin fa-spinner");
        var deferred = $q.defer();
        
            $.ajax
            ({
                type: "POST",
                url: 'http://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/Login',
                contentType: 'application/json; charset=utf-8',
                dataType: 'text json',
                data: JSON.stringify({ "UserName": loginData.userName, "Password": loginData.password, "AccountName": loginData.account }),
                success: function (response) {
                    $("#loginBtn").removeClass("disabled");
                    $("#loginBtn").find(".fa").removeClass("fa-spin fa-spinner").addClass("fa-sign-in");

                    if (response.LoginResult.Success == true) {
                      

                            if (loginData.useRefreshTokens) {
                                localStorageService.set('authorizationData', { token: response.LoginResult.Payload, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                            }
                            else {
                                localStorageService.set('authorizationData', { token: response.LoginResult.Payload, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                            }
                            _authentication.isAuth = true;
                            _authentication.userName = loginData.userName;
                            _authentication.useRefreshTokens = loginData.useRefreshTokens;



                            deferred.resolve(response);

                    }
                    else {
                        log.error(response.LoginResult.Message);

                    }
                  

                },
                error: function (err) {
                    $("#loginBtn").removeClass("disabled");
                    $("#loginBtn").find(".fa").removeClass("fa-spin fa-spinner").addClass("fa-sign-in");
                    _logOut();
                      deferred.reject(err);
                    
                }
            });
        
      

        return deferred.promise;

    };

    var _logOut = function () {

        alert("In");

        debugger;

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };
   
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);