'use strict';
app.controller('FindItemsController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {

    $scope.InventoryItems = [];
    $scope.SecurityToken = "";
    $scope.InvObject = {
        InventoryID: 0, CurrentQuantity: "", AvgCostPerUnit: "", Uncontrolled: "", UniqueTag: "",
        ItemID: "", ItemNumber: "", ItemDescription: 0, UomID: 0, UOM: 0, LocationID: 0, Location: 0,
        LocationZone: "", LastTransactionID: 0, StatusValue: "", LastQuantityChange: 0, LastDateChange: "",
        CustomData: []
    };


    $scope.CurrentImgID = "";
    $scope.SearchFromData="All"
    $scope.SearchFromText = "Search";
    $scope.SearchValue = "";
    $scope.Statuses = ["For Production", "Damaged", "On Order", "Sold", "Reserved"];
    $scope.CurrentObj = {};
    $scope.UOM = ["box/es", "carton/s", "cup/s", "dozen", "ea.", "gallon/s", "lbs.", "pc(s)"];

    $scope.Locations = ["Bin 100", "In Stock", "New location", "Refridgerator one", "Refridgerator two", "Pantry, Rack 1, Shelf 1-L", "Pantry, Rack 1, Shelf 1-M", "Storage Room A"];

    function ResetInvObj()
    {
        $scope.InvObject = {
            InventoryID: 0, CurrentQuantity: "", AvgCostPerUnit: "", Uncontrolled: "", UniqueTag: "",
            ItemID: "", ItemNumber: "", ItemDescription: 0, UomID: 0, UOM: 0, LocationID: 0, Location: 0,
            LocationZone: "", LastTransactionID: 0, StatusValue: "", LastQuantityChange: 0, LastDateChange: "",
            CustomData: []
        };
    }

    _CurrentUrl = "FindItems";

    var pressTimer

    $("#mylist").mouseup(function () {
        clearTimeout(pressTimer)
        // Clear timeout
        return false;
    }).mousedown(function () {
        // Set timeout
        pressTimer = window.setTimeout(function () {
            bootbox.confirm("Are you sure to exit App ?", function (result) {
                if (result) {
                    (navigator.app && navigator.app.exitApp()) || (device && device.exitApp())

                }
            });
        }, 1000)
        return false;
    });

    function GetRandomData(Type)
    {
        switch (Type) {
            case 1:
                return $scope.Statuses[Math.floor(Math.random() * $scope.Statuses.length)];
                break;
            case 2:
                return $scope.UOM[Math.floor(Math.random() * $scope.UOM.length)];
                break;
            case 3:
                return $scope.Locations[Math.floor(Math.random() * $scope.Locations.length)];
                break;
            default:
                return "";

        }

     
        
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function makedescription() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 55; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    $scope.handleFileSelect = function (evt) {

        var files = evt.target.files;

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                 

                var id = theFile.lastModified;


                return function (e) {
                    // Render thumbnail.
                   
                    $($scope.CurrentImgID).attr("src", e.target.result);

                    $scope.CurrentObj.ImagePath = e.target.result;
                    $scope.UpdateInventory();

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }

      



    }

    $scope.UpdateInventory=function()
    {

        ordersService.UpdateInventory($scope.CurrentObj);
        $scope.CurrentObj = {};
        $scope.InventoryItems = [];
        $scope.$apply();
        $scope.PopulateInventoryItems();
    }
    $scope.logOut = function () {

      
        authService.logOut();
        $location.path('/login');
        $scope.$apply();
    }

    $scope.authentication = authService.authentication.isAuth;

   
    $scope.UploadImg = function (id,_obj) {
         
        $scope.CurrentImgID = "#Img_" + id;
        $scope.CurrentObj = _obj;
        $("#myfile").trigger("click");
    }
    $("#myfile").on('change', function (event) {

        $scope.handleFileSelect(event);
    });
    $scope.afterlogout = function () {
        $location.path('/login');

        log.error("You are Logged Out (You can't Go back further)");
        
    }


    if ($scope.authentication == false) {
      //  $scope.afterlogout();
    }


    
    $scope.ClearFilter=function()
    {
        $scope.SearchValue = '';
        $scope.PopulateInventoryItems();
        $scope.SearchFromData = "All"
        $scope.SearchFromText = "Search";
        $(".norecords").hide();

    }


    


    $scope.SearchInventory=function()
    {
        


        var _tempArray = [];
        switch ($scope.SearchFromData) {
            case "iStatusValue":

                for (var i = 0; i < $scope.InventoryItems.length; i++) {

                    var v = $scope.InventoryItems[i];
                    if (v.StatusValue.toLowerCase() === $scope.SearchValue.toLowerCase() || v.StatusValue.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0) {
                        _tempArray.push(v);
                    }

                }

                break
            case "lLoc":
                for (var i = 0; i < $scope.InventoryItems.length; i++) {

                    var v = $scope.InventoryItems[i];
                    if (v.Location.toLowerCase() === $scope.SearchValue.toLowerCase() || v.Location.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0) {
                        _tempArray.push(v);
                    }

                }
                break
            case "pPart":

                for (var i = 0; i < $scope.InventoryItems.length; i++) {

                    var v = $scope.InventoryItems[i];
                    if (v.ItemNumber.toLowerCase() === $scope.SearchValue.toLowerCase() || v.ItemNumber.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0) {
                        _tempArray.push(v);
                    }

                }
                break
            case "All":

                for (var i = 0; i < $scope.InventoryItems.length; i++) {

                    var v = $scope.InventoryItems[i];
                    if (v.ItemNumber.toLowerCase() === $scope.SearchValue.toLowerCase() || v.ItemNumber.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0
                        || v.Location.toLowerCase() === $scope.SearchValue.toLowerCase() || v.Location.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0
                        || v.StatusValue.toLowerCase() === $scope.SearchValue.toLowerCase() || v.StatusValue.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0
                        || v.UniqueTag.toLowerCase() === $scope.SearchValue.toLowerCase() || v.UniqueTag.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0) {
                        _tempArray.push(v);
                    }

                }
                break
            case "iReqValue":

                for (var i = 0; i < $scope.InventoryItems.length; i++) {

                    var v = $scope.InventoryItems[i];
                    if (v.UniqueTag.toLowerCase() === $scope.SearchValue.toLowerCase() || v.UniqueTag.toLowerCase().indexOf($scope.SearchValue.toLowerCase()) >= 0) {
                        _tempArray.push(v);
                    }

                }
                break
            default:

        }


     


        $scope.InventoryItems = _tempArray;

       
        if (_tempArray.length == 0) {

            $(".norecords").show();

        }
       

        $scope.$apply();


    }
    $scope.searchfunction=function(Byvalue)
    {
        $scope.PopulateInventoryItems();
        if ($.trim($scope.SearchValue) != "") {
            $scope.SearchFromData = Byvalue;
            var _tempArray = [];
            switch (Byvalue) {
                case "iStatusValue":
                    
                    $scope.SearchFromText = "Status";
                 

                    break
                case "lLoc":
                    $scope.SearchFromText = "Location";
                 
                    break
                case "pPart":
                  $scope.SearchFromText = "Items";
               
                 
                    break
                case "All":
                    $scope.SearchFromText = "All";
                    break
                case "iReqValue":
                  
                    $scope.SearchFromText = "Unique Tag";
                  
                    break
                default:

            }


        }
    }

    $scope.PopulateInventoryItems = function () {

        $scope.InventoryItems = ordersService.PopulateInventoryItems();
    
        $scope.$apply();
    }

    $scope._updateImg = function (src) {
         
        $scope.selectedImage = src;
        $("#myModal1").modal('show');
    }
  
    $scope.PopulateInventoryItems();

  

    $scope.ScanItemSearch = function () {
        $scope.isSanned = false;

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {



            $scope.SearchValue = result.text;

            $scope.$apply();

            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");

          

        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    }
}]);