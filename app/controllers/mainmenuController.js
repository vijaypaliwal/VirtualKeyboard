'use strict';



app.controller('mainmenuController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

  

    $scope.loginData = {
        userName: "",
        password: "",
        account:"",
        useRefreshTokens: false
    };
 
 
    $scope.message = "";


    _CurrentUrl = "MainMenu";
    $scope.logOut = function () {

   
        authService.logOut();
        $location.path('/login');
        $scope.$apply();
    }

    $scope.authentication = authService.authentication.isAuth;


   

  




    $scope.afterlogout = function () {
        $location.path('/login');

        log.error("You are Logged Out (You can't Go back further)");

    }


    if ($scope.authentication == false) {
     //   $scope.afterlogout();
    }

    debugger;

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/orders');

        },
         function (err) {
             $scope.message = err.error_description;
         });
    };

   
}]);
