'use strict';
app.controller('profileController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
 

 

    init();



  







  

    $scope.Editmode = function () {
        $(".editmode").show();
        $(".detailmode").hide();

    }

    $scope.detailmode = function () {
        $(".editmode").hide();
        $(".detailmode").show();

    }

 



    



 
  

}]);