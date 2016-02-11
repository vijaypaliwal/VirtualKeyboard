'use strict';
app.controller('transactionController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.isSanned = false;
    $scope.SecurityToken = "";
    debugger;
    console.log(localStorageService.get('InventoryData'));
    //ordersService.getOrders().then(function (results) {

    //    $scope.orders = results.data;

    //}, function (error) {
    //    //alert(error.data.message);
    //});

    $scope.Scan = function () {
    
    }

    $scope.AddtoCart = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetCurrentInventoryByItemNumber',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ItemNumber": $scope.scannerText }),
               success: function (response) {
                   var _invData=response.GetCurrentInventoryByItemNumberResult.Payload;

                   if (_invData.length > 0) {

                       if ($scope.InventoryItems.length <= 0) {

                           $scope.InventoryItems = _invData;
                       }
                       else {
                           if (_invData.length > 0) {
                               for (var i = 0; i < _invData.length; i++) {
                                   $scope.InventoryItems.push(_invData[i]);
                               }
                           }

                       }
                       alert("inventory item successfully added.");
                   }
                   else {
                       alert("this item not found,please add into your inventory.");
                   }
                       $scope.$apply();





               },
               error: function (err) {

                   alert("error");


               }
           });
    }

}]);