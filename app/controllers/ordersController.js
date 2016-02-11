'use strict';
app.controller('ordersController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.isSanned = false;
    $scope.SecurityToken = "";
    $scope.IsActivityOn = false;
    $scope.TotalLength = 0;
    $scope.CurrentIndex = 0;
    $scope.CurrentObject = { ItemNumber: "", Location: "", UOM: "", Status: "", InventoryID: 0, Quantity: 0, CostPerUnit: 0, CustomData: [] };
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

                       $scope.TotalLength = $scope.InventoryItems.length;
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

    $scope.Proceed = function () {
        $(".modal-backdrop").remove();

        $("body").removeClass("modal-open");
        if($scope.InventoryItems.length >0)
        {

            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[0].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[0].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[0].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[0].StatusValue;
            
            $scope.CurrentObject.InventoryID = $scope.InventoryItems[0].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[0].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[0].CostPerUnit;
        }
        
        $scope.IsActivityOn = true;

    }

    $scope.ApplyTransaction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/AddInventory',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InventoryID": $scope.CurrentObject.InventoryID, "Quantity": $scope.CurrentObject.Quantity, "CostPerUnit": $scope.CurrentObject.CostPerUnit, "CustomData": $scope.CurrentObject.CustomData }),
               success: function (response) {
                   alert("success called");
                   var _TransID = response.AddInventoryResult.Payload;

                   if (_TransID > 0) {

                       alert(_TransID);
                      
                       alert("inventory item successfully increased.");
                   }
                   else {
                       alert(response.Message);
                   }
                   $scope.$apply();





               },
               error: function (err) {

                   alert("error");


               }
           });
    }
    $scope.GoToNextItem = function () {

        $scope.CurrentIndex = $scope.CurrentIndex + 1;
        

        if ($scope.InventoryItems.length >= $scope.CurrentIndex) {

            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[$scope.CurrentIndex].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[$scope.CurrentIndex].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[$scope.CurrentIndex].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[$scope.CurrentIndex].StatusValue;

            $scope.CurrentObject.InventoryID = $scope.InventoryItems[$scope.CurrentIndex].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[$scope.CurrentIndex].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[$scope.CurrentIndex].CostPerUnit;
        }
        $scope.$apply();
    }
}]);