'use strict';
app.controller('loginController', ['$scope','localStorageService', '$location', 'authService', 'ngAuthSettings', function ($scope,localStorageService, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        userName: "QAT9872",
        password: "QAT9872",
        account: "QAT9872",
        useRefreshTokens: false
    };
 
    $scope.message = "";

    $scope.InIt = function ()
    {
        var authLocalData = localStorageService.get('lastlogindata');

        console.log("auth local Data");
        console.log(authLocalData);
        if (authLocalData != null && authLocalData != undefined)
        {
            $scope.loginData.account = authLocalData.AccountName;
            $scope.loginData.userName = authLocalData.userName;
            $scope.loginData.password = authLocalData.Password;
        }

    }

    $scope.InIt();

    $scope.login = function ()
    {
        
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");
        localStorageService.set("lastlogindata", "");


        authService.login($scope.loginData).then(function (response)
        {
           
            $scope.GetProfileData();
            $location.path('/mainmenu');

        },
         function (err) {
             $scope.message = err.error_description;
             playBeep();
         });
    };

   
   
}]);
