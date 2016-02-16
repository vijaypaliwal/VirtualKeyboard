﻿'use strict';
app.controller('inventoryController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.InventoryObject = { ItemName: "", Location: "", UOM: "", Status: "", Quantity: 0, uniquetag: "", CostPerUnit: 0, CustomData: [] };
    $scope.LocationList = [];
    $scope.UOMList = [];
    $scope.ItemList = [];

    $scope.getlocation = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetLocations',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   $scope.LocationList = response.GetLocationsResult.Payload;
                   $scope.$apply();
               },
               error: function (response) {

                   $scope.InventoryObject.Location = 678030;

                  
                
               }
           });
      
    }
    
  

    $scope.addinventory = function ()
    {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $('#addinventories').addClass("disabled");
        $('#addinventories').find(".fa").addClass("fa-spin");

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/AddInventoryRow',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "LocationID": $scope.InventoryObject.Location, "PartID": $scope.InventoryObject.ItemName, "UnitOfMeasureID": $scope.InventoryObject.UOM, "Quantity": $scope.InventoryObject.Quantity, "CostPerUnit": $scope.InventoryObject.CostPerUnit, "UniqueTag": $scope.InventoryObject.uniquetag, "CustomData": $scope.InventoryObject.CustomData }),
               success: function (response) {
                   $('#addinventories').removeClass("disabled");
                   $('#addinventories').find(".fa").removeClass("fa-spin");

                   alert("Inventory item successfully added.");
              

                   var _TransID = response.AddInventoryResult.Payload;

                   if (_TransID > 0) {

                       alert("Inventory item successfully added.");

                     
                       $scope.InventoryObject = { ItemName: "", Location: "", UOM: "", Status: "", Quantity: 0, uniquetag: "", CostPerUnit: 0, CustomData: [] };
                       $scope.$apply();

                   }
                   else {
                       $('#addinventories').removeClass("disabled");
                       $('#addinventories').find(".fa").removeClass("fa-spin");
                       alert(response.AddInventoryResult.Message);
                   }


                   $scope.InventoryObject = { ItemName: "", Location: "", UOM: "", Status: "", Quantity: 0, uniquetag: "", CostPerUnit: 0, CustomData: [] };
                   $scope.$apply();

               },
               error: function (err) {

                   alert("error occurred");
                   $('#addinventories').removeClass("disabled");
                   $('#addinventories').find(".fa").removeClass("fa-spin");
               }
           });
    }

    $scope.getuom = function ()
    {
       

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

                   alert(err.Message);

               }
           });

    }

    $scope.getitems = function () {

     
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetItems',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                 
                   $scope.ItemList = response.GetItemsResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

                   alert(err.Message);

               }
           });

    }

   
        $scope.getlocation();
        $scope.getuom();
        $scope.getitems();
   

   
  
}]);