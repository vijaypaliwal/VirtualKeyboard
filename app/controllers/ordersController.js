'use strict';
app.controller('ordersController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.isSanned = false;
    $scope.SecurityToken = "";

    //ordersService.getOrders().then(function (results) {

    //    $scope.orders = results.data;

    //}, function (error) {
    //    //alert(error.data.message);
    //});

    $scope.Scan = function () {
        $scope.isSanned = false;

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {



            $scope.scannerText = result.text;

            $scope.isSanned = true;
            $scope.$apply();

            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");

            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    }

    $scope.AddtoCart = function () {
        alert("add to cart");
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        alert($scope.SecurityToken);

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetCurrentInventoryByItemNumber',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ItemNumber": $scope.scannerText }),
               success: function (response) {
                   var _invData=response.GetCurrentInventoryByItemNumberResult.Payload;


                   if ($scope.InventoryItems.length <= 0) {

                       $scope.InventoryItems = _invData;
                   }
                   else {
                       if (_invData.length > 0)
                       {
                           for (var i = 0; i < _invData.length; i++) {
                               $scope.InventoryItems.push(_invData[i]);
                           }
                       }

                   }
                       $scope.$apply();





               },
               error: function (err) {

                   alert("error");


               }
           });
    }

}]);