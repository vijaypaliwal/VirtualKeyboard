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

                   alert("success Item found");


                 
                       alert("into data" + response.length);
                       $scope.InventoryItems = response;
                       $scope.$apply();

                       for (var i = 0; i < $scope.InventoryItems; i++) {
                           alert($scope.InventoryItems[i].ItemNumber);
                       }




               },
               error: function (err) {

                   alert("error");


               }
           });
    }

}]);