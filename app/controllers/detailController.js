'use strict';
app.controller('detailController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};

    $scope.IsEditMode = false;
    function init()
    {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);
        $scope.$apply();
    }

    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');
        }
        else {
            $("#myModal2").modal('show');
        }
    }

    $scope.CancelEdit = function () {
        $scope.IsEditMode = false;

        $scope.$apply();

    }

    init();




    $scope.Scanitem = function () {


     
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.CurrentInventory.pPart = result.text;

            $scope.$apply();
      

        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.Scandescription = function () {


     
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.CurrentInventory.pDescription = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }


    

}]);