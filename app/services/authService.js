'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', 'log', function ($http, $q, localStorageService, ngAuthSettings, log) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false,
    };

    var _UserInfo = {
        username: "",
        myprofileimage: "",
        picURl:"",
    }

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
        ShowLoginSuccess();
        $.ajax
        ({
            type: "POST",
            url: serviceBase + 'Login',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text json',
            data: JSON.stringify({ "UserName": loginData.userName, "Password": loginData.password, "AccountName": loginData.account }),
            success: function (response) {

                debugger;

                $("#loginBtn").removeClass("disabled");
                $("#loginBtn").find(".fa").removeClass("fa-spin fa-spinner").addClass("fa-sign-in");
                $("#myloginModal").removeClass('bounceIn').addClass('bounceOut');
                $(".side-nav").show();
                if (response.LoginResult.Success == true) {


                    if (loginData.useRefreshTokens) {
                        localStorageService.set('authorizationData', { token: response.LoginResult.Payload, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                        localStorageService.set('lastlogindata', { userName: loginData.userName, Password: loginData.password, AccountName: loginData.account });

                    }
                    else {
                        localStorageService.set('authorizationData', { token: response.LoginResult.Payload, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                        localStorageService.set('lastlogindata', { userName: loginData.userName, Password: loginData.password, AccountName: loginData.account });
                    }
                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    _authentication.useRefreshTokens = loginData.useRefreshTokens;

                    _Getuserinfo();

                    deferred.resolve(response);

                }
                else {
                    $("#myloginModal").removeClass('bounceIn').addClass('bounceOut');

                    playBeep();
                    log.error(response.LoginResult.Message);

                }


            },
            error: function (err) {

                debugger;

                $("#myloginModal").removeClass('bounceIn').addClass('bounceOut');

                playBeep();
                $("#loginBtn").removeClass("disabled");
                $("#loginBtn").find(".fa").removeClass("fa-spin fa-spinner").addClass("fa-sign-in");
                $(".side-nav").show();
                _logOut();
                deferred.reject(err);

            }
        });



        return deferred.promise;

    };



    var _Getuserinfo = function () {
        var SecurityToken = "";
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + "GetUserInfo",
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": SecurityToken }),
               success: function (response) {


                   debugger;
                   _UserInfo.username = response.GetUserInfoResult.Payload[0].UserName
                   _UserInfo.myprofileimage = response.GetUserInfoResult.Payload[0].ProfilePic;

                   if (response.GetUserInfoResult.Payload[0].ProfilePic != null && response.GetUserInfoResult.Payload[0].ProfilePic != "") {

                       _UserInfo.picURl = serviceBaseUrl + "Logos/" + response.GetUserInfoResult.Payload[0].ProfilePic
                       
                   }

                   else {

                       _UserInfo.picURl = "img/dummy-user48.png";

                   }

                   console.log(_UserInfo);
                   localStorageService.set('UserInfoData', {
                       username: _UserInfo.username,
                       myprofileimage: _UserInfo.myprofileimage,
                       picURl: _UserInfo.picURl,
                   });

               },
               error: function (err) {


               }
           });

    }
    var _logOut = function () {



        localStorageService.remove('authorizationData');
        localStorageService.remove('UserInfoData');

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
    authServiceFactory.GetuserInfo = _Getuserinfo;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.UserInfo = _UserInfo;
    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);