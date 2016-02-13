'use strict';
app.controller('itemController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.ItemObject = { ItemID: 0, ItemNumber: "", ItemDescription: "", ItemGroup: "", ItemNote: "", DefaultLocation:"",DefaultUOM:"",TargetLevel: 0, ReorderLevel: 0, DefaultCost: 0, DefaultUOMID: 0, DefaultLocationID: 0, CustomData: [] };
  
    $scope.UOMList = [];
  
    

    $scope.additem = function ()
    {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/CreateItem',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "NewItem": $scope.ItemObject }),
               success: function (response) {

                   alert("item successfully added in.");
              

                   var _Item = response.CreateItemResult.Payload;

                   if (_Item != null && _Item!=undefined) {

                       alert("item successfully added .");

                     
                       $scope.ItemObject = { ItemID: 0, ItemNumber: "", ItemDescription: "", ItemGroup: "", ItemNote: "", DefaultLocation: "", DefaultUOM: "", TargetLevel: 0, ReorderLevel: 0, DefaultCost: 0, DefaultUOMID: 0, DefaultLocationID: 0, CustomData: [] };
                       $scope.$apply();

                   }
                   else {
                       alert(response.CreateItemResult.Message);
                   }

                   $scope.ItemObject = { ItemID: 0, ItemNumber: "", ItemDescription: "", ItemGroup: "", ItemNote: "", DefaultLocation: "", DefaultUOM: "", TargetLevel: 0, ReorderLevel: 0, DefaultCost: 0, DefaultUOMID: 0, DefaultLocationID: 0, CustomData: [] };
                   $scope.$apply();





               },
               error: function (err) {

                   alert(response.CreateItemResult.Message);


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

  
}]);