'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', function ($scope, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        userName: "QAT9872",
        password: "QAT9872",
        account: "QAT9872",
        useRefreshTokens: false
    };

 
    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {
            $scope.GetProfileData();
            $location.path('/mainmenu');

        },
         function (err) {
             $scope.message = err.error_description;
             playBeep();

         });
    };


}]);
