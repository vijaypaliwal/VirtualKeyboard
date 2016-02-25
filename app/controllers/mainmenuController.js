'use strict';



app.controller('mainmenuController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

    $scope.loginData = {
        userName: "",
        password: "",
        account:"",
        useRefreshTokens: false
    };
 
 
    $scope.message = "";



    $scope.logOut = function () {

        alert("Logout");
        authService.logOut();
        $location.path('/login');
        $scope.$apply();
    }

    $scope.authentication = authService.authentication.isAuth; alert($scope.authentication);




    $scope.afterlogout = function () {
        $location.path('/login');

        log.error("You are Logged Out (You can't Go back further)");

    }


    if ($scope.authentication == false) {
        $scope.afterlogout();
    }

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/orders');

        },
         function (err) {
             $scope.message = err.error_description;
         });
    };

   
}]);
