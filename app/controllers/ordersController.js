'use strict';
app.controller('ordersController', ['$scope', 'ordersService', 'localStorageService', function ($scope, ordersService, localStorageService) {

    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.isSanned = false;
    $scope.SecurityToken = "";
    $scope.IsActivityOn = false;
    $scope.IsIncreaseActivity = false;
    $scope.IsDecreaseActivity = false;
    $scope.IsUpdateActivity = false;
    $scope.IsMoveActivity = false;
    $scope._IsActivityInProcess = 0;
   
    $scope.TotalLength = 0;
    $scope.CurrentIndex =1;
    $scope.CurrentObject = { ItemNumber: "", Location: "", UOM: "", Status: "", InventoryID: "", Quantity: "", CostPerUnit: "", CustomData: [] };




    $scope.Statuses = [{ StatusValue: "Damaged" }, { StatusValue: "For Production" }, { StatusValue: "On Order" }, { StatusValue: "Sold" }];
    //ordersService.getOrders().then(function (results) {

    //    $scope.orders = results.data;

    //}, function (error) {
    //    //alert(error.data.message);
    //});

    $scope.OpenCloseModal=function()
    {
        
            var _Display = $("#myModal1").css("display");
            if (_Display == "block") {
                $("#myModal1").css("display", "none");
                $(".modal-backdrop").hide();

            }
            else {
                $("#myModal1").css("display", "block");
                $(".modal-backdrop").show();

            }
        
    }

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
        
        $("#AddtoCart").addClass("disabled");  
        $("#AddtoCart").find(".fa").addClass("fa-spin");
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


                       $("#AddtoCart").removeClass("disabled");
                       $("#AddtoCart").find(".fa").removeClass("fa-spin");


               },
               error: function (err) {

                   alert("error");
                   $("#AddtoCart").removeClass("disabled");
                   $("#AddtoCart").find(".fa").removeClass("fa-spin");

               }
           });
    }

    $scope.Clearcart = function ()
    {
        $scope.InventoryItems = [];
        $scope.TotalLength = $scope.InventoryItems.length;
        $scope.CurrentIndex = 1;
        $scope.$apply();
    }

 
    $scope.removeThisItem=function(ID)
    {
        for (var i = 0; i < $scope.InventoryItems.length; i++) {
            if($scope.InventoryItems[i].InventoryID==ID)
            {
                $scope.InventoryItems.splice(i, 1);
            }
        }

        $scope.CurrentIndex = 1;

        $scope.TotalLength = $scope.InventoryItems.length;
        $scope.$apply();
    }
    $scope.Proceed = function () {

        $(".modal-backdrop").remove();
        $scope.CurrentIndex = 1;
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

        $scope.IsIncreaseActivity = true;
        $scope.IsDecreaseActivity = false;
        $scope.IsMoveActivity = false;

    }

    $scope.Proceedfordecrease = function () {
        $(".modal-backdrop").remove();
        $scope.CurrentIndex = 1;
        $("body").removeClass("modal-open");
        if ($scope.InventoryItems.length > 0) {

            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[0].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[0].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[0].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[0].StatusValue;

            $scope.CurrentObject.InventoryID = $scope.InventoryItems[0].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[0].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[0].CostPerUnit;
        }

        $scope.IsActivityOn = true;

        $scope.IsIncreaseActivity = false;
        $scope.IsMoveActivity = false;
        $scope.IsDecreaseActivity = true;

    }

    $scope.Proceedformove = function () {
        $(".modal-backdrop").remove();
        $scope.CurrentIndex = 1;
        $("body").removeClass("modal-open");
        if ($scope.InventoryItems.length > 0) {

            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[0].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[0].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[0].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[0].StatusValue;

            $scope.CurrentObject.InventoryID = $scope.InventoryItems[0].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[0].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[0].CostPerUnit;
        }

        $scope.IsActivityOn = true;
        $scope.IsMoveActivity = true;
        $scope.IsIncreaseActivity = false;
        $scope.IsDecreaseActivity = false;

    }
    $scope.Proceedforupdate = function () {
        $(".modal-backdrop").remove();
        $scope.CurrentIndex = 1;
        $("body").removeClass("modal-open");
        if ($scope.InventoryItems.length > 0) {

            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[0].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[0].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[0].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[0].StatusValue;

            $scope.CurrentObject.InventoryID = $scope.InventoryItems[0].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[0].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[0].CostPerUnit;
        }
        $scope.IsUpdateActivity = true;
        $scope.IsActivityOn = true;
        $scope.IsMoveActivity = false;
        $scope.IsIncreaseActivity = false;
        $scope.IsDecreaseActivity = false;

    }
    
    $scope.ApplyTransaction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope._IsActivityInProcess = 1;
        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/AddInventory',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InventoryID": $scope.CurrentObject.InventoryID, "Quantity": $scope.CurrentObject.Quantity, "CostPerUnit": $scope.CurrentObject.CostPerUnit, "CustomData": $scope.CurrentObject.CustomData }),
               success: function (response) {
                   var _TransID = response.AddInventoryResult.Payload;
                   $scope._IsActivityInProcess = 0;
                   if (_TransID > 0) {

                       alert("inventory item successfully increased.");

                     
                       
                       if ($scope.TotalLength == $scope.CurrentIndex)
                       {
                           $scope.InventoryItems = [];
                           $scope.TotalLength = 0;
                           $scope.CurrentIndex = 1;
                           $scope.IsActivityOn = false;
                           $scope._IsActivityInProcess = 0;
                           $scope.$apply();

                       }

                       $scope.GoToNextItem();
                   }
                   else {
                       alert(response.Message);
                   }
                   $scope.$apply();





               },
               error: function (err) {

                   alert("error");
                   $scope._IsActivityInProcess = 0;

                   if ($scope.TotalLength == $scope.CurrentIndex) {
                       $scope.InventoryItems = [];
                       $scope.TotalLength = 0;
                       $scope.CurrentIndex = 1;
                       $scope.IsActivityOn = false;
                       $scope._IsActivityInProcess = 0;
                       $scope.$apply();

                   }

                   $scope.GoToNextItem();

                   $scope.$apply();
               }
           });
    }

    $scope.ApplyDecreaseTransaction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope._IsActivityInProcess = 1;

        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/SubtractInventory',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InventoryID": $scope.CurrentObject.InventoryID, "Quantity": $scope.CurrentObject.Quantity, "CostPerUnit": $scope.CurrentObject.CostPerUnit, "CustomData": $scope.CurrentObject.CustomData }),
               success: function (response) {
                   var _TransID = response.SubtractInventoryResult.Payload;
                   $scope._IsActivityInProcess = 0;
                   if (_TransID > 0) {

                       alert("Inventory item successfully Decreased.");
                       $scope.GoToNextItem();
                       
                       if ($scope.TotalLength == $scope.CurrentIndex) {
                           $scope.InventoryItems = [];
                           $scope.TotalLength = 0;
                           $scope.CurrentIndex = 1;
                           $scope.IsActivityOn = false;

                           $scope.$apply();

                       }

                       $scope.GoToNextItem();
                   }
                   else {
                       alert(response.Message);
                   }
                   $scope.$apply();





               },
               error: function (err) {

                   alert("error");
                   $scope._IsActivityInProcess = 0;
                   $scope.$apply();
               }
           });
    }


    $scope.ApplyMoveTransaction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope._IsActivityInProcess = 1;
        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/MoveInventory',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InventoryID": $scope.CurrentObject.InventoryID, "NewLocationID": 663546, "Quantity": $scope.CurrentObject.Quantity, "CostPerUnit": $scope.CurrentObject.CostPerUnit, "CustomData": $scope.CurrentObject.CustomData }),
               success: function (response) {
                   var _TransID = response.MoveInventoryResult.Payload;
                   $scope._IsActivityInProcess = 0;
                   if (_TransID > 0) {

                       alert("Inventory item successfully Moved.");
                       if ($scope.TotalLength == $scope.CurrentIndex) {
                           $scope.InventoryItems = [];
                           $scope.TotalLength = 0;
                           $scope.CurrentIndex = 1;
                           $scope.IsActivityOn = false;

                           $scope.$apply();

                       }

                       $scope.GoToNextItem();

                   }
                   else {
                       alert(response.Message);
                   }
                   $scope.$apply();





               },
               error: function (err) {

                   alert("error");
                   $scope._IsActivityInProcess = 0;
                   $scope.$apply();
               }
           });
    }


    $scope.ApplyUpdateTransaction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope._IsActivityInProcess = 1;
        $.ajax
           ({
               type: "POST",
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/StatusUpdateInventory',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "InventoryID": $scope.CurrentObject.InventoryID, "NewStatus": $scope.CurrentObject.Status, "Quantity": $scope.CurrentObject.Quantity, "CustomData": $scope.CurrentObject.CustomData }),
               success: function (response) {
                   var _TransID = response.StatusUpdateInventoryResult.Payload;
                   $scope._IsActivityInProcess = 0;
                   if (_TransID > 0) {

                       alert("Inventory item successfully updated.");
                       if ($scope.TotalLength == $scope.CurrentIndex) {
                           $scope.InventoryItems = [];
                           $scope.TotalLength = 0;
                           $scope.CurrentIndex = 1;
                           $scope.IsActivityOn = false;

                           $scope.$apply();

                       }

                       $scope.GoToNextItem();

                   }
                   else {
                       alert(response.Message);
                   }
                   $scope.$apply();





               },
               error: function (err) {

                   alert("error");
                   $scope._IsActivityInProcess = 0;
                   $scope.$apply();
               }
           });
    }
    $scope.GoToBackItem = function () {

        $scope.CurrentIndex = $scope.CurrentIndex - 1;

        if ($scope.CurrentIndex>=1) {
            var _toMapIndex = $scope.CurrentIndex - 1;
            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[_toMapIndex].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[_toMapIndex].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[_toMapIndex].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[_toMapIndex].StatusValue;

            $scope.CurrentObject.InventoryID = $scope.InventoryItems[_toMapIndex].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[_toMapIndex].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[_toMapIndex].CostPerUnit;
        }
        $scope.$apply();
    }

    $scope.GoToNextItem = function () {
        $scope.CurrentIndex = $scope.CurrentIndex + 1;

        if ($scope.InventoryItems.length >= $scope.CurrentIndex) {
            var _toMapIndex = $scope.CurrentIndex - 1;
            $scope.CurrentObject.ItemNumber = $scope.InventoryItems[_toMapIndex].ItemNumber;
            $scope.CurrentObject.Location = $scope.InventoryItems[_toMapIndex].Location;
            $scope.CurrentObject.UOM = $scope.InventoryItems[_toMapIndex].UOM;
            $scope.CurrentObject.Status = $scope.InventoryItems[_toMapIndex].StatusValue;

            $scope.CurrentObject.InventoryID = $scope.InventoryItems[_toMapIndex].InventoryID;
            $scope.CurrentObject.Quantity = $scope.InventoryItems[_toMapIndex].CurrentQuantity;
            $scope.CurrentObject.CostPerUnit = $scope.InventoryItems[_toMapIndex].CostPerUnit;
        }
        $scope.$apply();
    }
}]);