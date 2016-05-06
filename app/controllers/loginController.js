'use strict';
app.controller('loginController', ['$scope','localStorageService', '$location', 'authService', 'ngAuthSettings', function ($scope,localStorageService, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        userName: "QAT9872",
        password: "QAT9872",
        account: "QAT9872",
        useRefreshTokens: false
    };

 
    $scope.message = "";

    $scope.login = function () {

        debugger;
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");

        authService.login($scope.loginData).then(function (response) {

            debugger;
            $scope.GetProfileData();
            $location.path('/mainmenu');

        },
         function (err) {
             $scope.message = err.error_description;
             playBeep();

         });
    };


}]);
