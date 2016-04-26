'use strict';



app.controller('mainmenuController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

  



    _CurrentUrl = "MainMenu";
    $scope.logOut = function () {

   
        authService.logOut();
        $location.path('/login');
        $scope.$apply();
    }


    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

 

   
}]);
