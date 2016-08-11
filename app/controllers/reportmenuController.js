'use strict';
app.controller('reportmenuController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
 

    $scope.mainObjectToSend = [];
    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");

        $scope.MyinventoryFieldsNames = localStorageService.get("unitdatafieldsobject");

        
        console.log($scope.MyinventoryFieldsNames);
        $scope.itemlabel = $scope.CurrentInventory.pPart
     
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.GoTo = function (url) {

        $location.path(url);
    }

}]);