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

    var _currentPage = 1;
    var _sortColumn = "iLastITID";
    var _sortDir = "ASC";
    $scope._areImagesShown = false;
    $scope._HasImages = false;
    //var _areZeroRecordsShown = true;
    var _currentPage = 0;
    var _PageSize = 30;
    var _PreviousPageSize = 50;
    var _IsFilterOn = 0;
    var _IsClearFilter = 0;
    var _IsClearSorting = 0;
    var _IsActuallySorting = 0;
    var _IsActuallySearching = 0;
    var _IsSetSelectedIfAny = 0;
    var SelectedCartItemIds = [];
    var _IsFilterCartItems = 0;
 
    var _IsLazyLoading = 0;
    var _TotalRecordsCurrent = 0;
    var _IsLazyLoadingUnderProgress = 0;
    $scope._areZeroRecordsShown = false;


    $scope.CurrentImgID = "";
    $scope.SearchFromData = "All"
    $scope.SearchFromText = "Search";
    $scope.SearchValue = "";
    $scope.Statuses = ["For Production", "Damaged", "On Order", "Sold", "Reserved"];
    $scope.CurrentObj = {};
    $scope.UOM = ["box/es", "carton/s", "cup/s", "dozen", "ea.", "gallon/s", "lbs.", "pc(s)"];

    $scope.Locations = ["Bin 100", "In Stock", "New location", "Refridgerator one", "Refridgerator two", "Pantry, Rack 1, Shelf 1-L", "Pantry, Rack 1, Shelf 1-M", "Storage Room A"];

    function ResetInvObj() {
        $scope.InvObject = {
            InventoryID: 0, CurrentQuantity: "", AvgCostPerUnit: "", Uncontrolled: "", UniqueTag: "",
            ItemID: "", ItemNumber: "", ItemDescription: 0, UomID: 0, UOM: 0, LocationID: 0, Location: 0,
            LocationZone: "", LastTransactionID: 0, StatusValue: "", LastQuantityChange: 0, LastDateChange: "",
            CustomData: []
        };
    }

    _CurrentUrl = "FindItems";

    $scope.searchstring = "";

    var pressTimer

    $("#mylist").mouseup(function () {
        clearTimeout(pressTimer)
        // Clear timeout
        return false;
    }).mousedown(function () {
        // Set timeout
        pressTimer = window.setTimeout(function () {
            $("#myModalforlist").modal('show');
        }, 700)
        return false;
    });

    function GetRandomData(Type) {
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

    $scope.UpdateInventory = function () {

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


    $scope.UploadImg = function (id, _obj) {

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



    $scope.ClearFilter = function () {
        $scope.SearchValue = '';
        $scope.PopulateInventoryItems();
        $scope.SearchFromData = "All"
        $scope.SearchFromText = "Search";
        $(".norecords").hide();

    }





    $scope.SearchInventory = function () {

      
        $scope.GetInventories();
      
    }


    $scope.Showhideimage = function (isshow)
    {

        $scope._areImagesShown = isshow;
        $scope._HasImages = isshow;

     

        debugger;
     

        $scope.$apply();

        $scope.GetInventories();
    }

    $scope.showhidezerorecord = function (showzero) {

        debugger;

        $scope._areZeroRecordsShown = showzero;
        $scope.$apply();

        $scope.GetInventories();

    }

    $(window).scroll(function () {
        var _SearchValue = $.trim($("#MasterSearch").val());

        debugger;
        if (_IsLazyLoadingUnderProgress === 0) {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {

                debugger;


                    _PageSize = _TotalRecordsCurrent + 10;
                  

                    $scope.GetInventories();
               
            }
        }
    });







    $scope.searchfunction = function (Byvalue) {
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
    var FilterArray = [
        { ColumnName: 'pPart', FilterOperator: 'cn', SearchValue: $('#pPart-filter').val() },
        { ColumnName: 'pDescription', FilterOperator: 'cn', SearchValue: $('#pDescription-filter').val() },
        { ColumnName: 'iQty', FilterOperator: 'num-eq', SearchValue: $('#iQty-filter').val() },
        { ColumnName: 'uomUOM', FilterOperator: 'in', SearchValue: $('#uomUOM-filter').val() },
        { ColumnName: 'lLoc', FilterOperator: 'cn', SearchValue: $('#lLoc-filter').val() },
        { ColumnName: 'iStatusValue', FilterOperator: 'in', SearchValue: $('#iStatusValue-filter').val() },
        { ColumnName: 'iReqValue', FilterOperator: 'cn', SearchValue: $('#iReqValue-filter').val() },
        { ColumnName: 'pCountFrq', FilterOperator: 'cn', SearchValue: $('#pCountFrq-filter').val() },
        { ColumnName: 'lZone', FilterOperator: 'cn', SearchValue: $('#lZone-filter').val() },
        { ColumnName: 'iCostPerUnit', FilterOperator: 'num-eq', SearchValue: $('#iCostPerUnit-filter').val() },

        { ColumnName: 'iUniqueDate', FilterOperator: 'date-eq', SearchValue: $('#iUniqueDate-filter').val() },
        { ColumnName: 'iUnitDate2', FilterOperator: 'date-eq', SearchValue: $('#iUnitDate2-filter').val() },
        { ColumnName: 'iUnitNumber1', FilterOperator: 'num-eq', SearchValue: $('#iUnitNumber1-filter').val() },
        { ColumnName: 'iUnitNumber2', FilterOperator: 'num-eq', SearchValue: $('#iUnitNumber2-filter').val() },
        { ColumnName: 'iUnitTag2', FilterOperator: 'cn', SearchValue: $('#iUnitTag2-filter').val() },
        { ColumnName: 'iUnitTag3', FilterOperator: 'cn', SearchValue: $('#iUnitTag3-filter').val() },
        { ColumnName: 'string_1', FilterOperator: 'cn', SearchValue: $('#string_1-filter').val() },
        { ColumnName: 'string_2', FilterOperator: 'cn', SearchValue: $('#string_2-filter').val() },
        { ColumnName: 'string_3', FilterOperator: 'cn', SearchValue: $('#string_3-filter').val() },
        { ColumnName: 'string_4', FilterOperator: 'cn', SearchValue: $('#string_4-filter').val() },
        { ColumnName: 'string_5', FilterOperator: 'cn', SearchValue: $('#string_5-filter').val() },
        { ColumnName: 'string_6', FilterOperator: 'cn', SearchValue: $('#string_6-filter').val() },
        { ColumnName: 'string_7', FilterOperator: 'cn', SearchValue: $('#string_7-filter').val() },
        { ColumnName: 'string_8', FilterOperator: 'cn', SearchValue: $('#string_8-filter').val() },
        { ColumnName: 'string_9', FilterOperator: 'cn', SearchValue: $('#string_9-filter').val() },
        { ColumnName: 'string_10', FilterOperator: 'cn', SearchValue: $('#string_10-filter').val() },
        { ColumnName: 'string_11', FilterOperator: 'cn', SearchValue: $('#string_11-filter').val() },
        { ColumnName: 'string_12', FilterOperator: 'cn', SearchValue: $('#string_12-filter').val() },
        { ColumnName: 'string_13', FilterOperator: 'cn', SearchValue: $('#string_13-filter').val() },
        { ColumnName: 'string_14', FilterOperator: 'cn', SearchValue: $('#string_14-filter').val() },
        { ColumnName: 'string_15', FilterOperator: 'cn', SearchValue: $('#string_15-filter').val() },
        { ColumnName: 'string_16', FilterOperator: 'cn', SearchValue: $('#string_16-filter').val() },
        { ColumnName: 'string_17', FilterOperator: 'cn', SearchValue: $('#string_17-filter').val() },
        { ColumnName: 'string_18', FilterOperator: 'cn', SearchValue: $('#string_18-filter').val() },
        { ColumnName: 'string_19', FilterOperator: 'cn', SearchValue: $('#string_19-filter').val() },
        { ColumnName: 'string_20', FilterOperator: 'cn', SearchValue: $('#string_20-filter').val() },
        { ColumnName: 'string_21', FilterOperator: 'cn', SearchValue: $('#string_21-filter').val() },
        { ColumnName: 'string_22', FilterOperator: 'cn', SearchValue: $('#string_22-filter').val() },
        { ColumnName: 'string_23', FilterOperator: 'cn', SearchValue: $('#string_23-filter').val() },
        { ColumnName: 'string_24', FilterOperator: 'cn', SearchValue: $('#string_24-filter').val() },
        { ColumnName: 'number_1', FilterOperator: 'num-eq', SearchValue: $('#number_1-filter').val() },
        { ColumnName: 'number_2', FilterOperator: 'num-eq', SearchValue: $('#number_2-filter').val() },
        { ColumnName: 'number_3', FilterOperator: 'num-eq', SearchValue: $('#number_3-filter').val() },
        { ColumnName: 'number_4', FilterOperator: 'num-eq', SearchValue: $('#number_4-filter').val() },
        { ColumnName: 'number_5', FilterOperator: 'num-eq', SearchValue: $('#number_5-filter').val() },
        { ColumnName: 'number_6', FilterOperator: 'num-eq', SearchValue: $('#number_6-filter').val() },
        { ColumnName: 'number_7', FilterOperator: 'num-eq', SearchValue: $('#number_7-filter').val() },
        { ColumnName: 'number_8', FilterOperator: 'num-eq', SearchValue: $('#number_8-filter').val() },
        { ColumnName: 'number_9', FilterOperator: 'num-eq', SearchValue: $('#number_9-filter').val() },
        { ColumnName: 'number_10', FilterOperator: 'num-eq', SearchValue: $('#number_10-filter').val() },
        { ColumnName: 'number_11', FilterOperator: 'num-eq', SearchValue: $('#number_11-filter').val() },
        { ColumnName: 'number_12', FilterOperator: 'num-eq', SearchValue: $('#number_12-filter').val() },
        { ColumnName: 'date_1', FilterOperator: 'date-eq', SearchValue: $('#date_1-filter').val() },
        { ColumnName: 'date_2', FilterOperator: 'date-eq', SearchValue: $('#date_2-filter').val() },
        { ColumnName: 'date_3', FilterOperator: 'date-eq', SearchValue: $('#date_3-filter').val() },
        { ColumnName: 'date_4', FilterOperator: 'date-eq', SearchValue: $('#date_4-filter').val() },
        { ColumnName: 'date_5', FilterOperator: 'date-eq', SearchValue: $('#date_5-filter').val() },
        { ColumnName: 'date_6', FilterOperator: 'date-eq', SearchValue: $('#date_6-filter').val() },
        { ColumnName: 'bool_1', FilterOperator: 'bool', SearchValue: $('#bool_1-filter').val() },
        { ColumnName: 'bool_2', FilterOperator: 'bool', SearchValue: $('#bool_2-filter').val() },
        { ColumnName: 'bool_3', FilterOperator: 'bool', SearchValue: $('#bool_3-filter').val() },
        { ColumnName: 'bool_4', FilterOperator: 'bool', SearchValue: $('#bool_4-filter').val() },
        { ColumnName: 'bool_5', FilterOperator: 'bool', SearchValue: $('#bool_5-filter').val() },
        { ColumnName: 'bool_6', FilterOperator: 'bool', SearchValue: $('#bool_6-filter').val() }
    ];


    /// Get filters of inventory grid

    function GetFilters() {
        return FilterArray;
    }
    $scope.GetInventories = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        debugger;
        var _masterSearch = $scope.SearchValue;

        $.ajax({
            type: "POST",
            url: serviceBase + 'GetInventories',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: GetFilters(), SelectedCartIDs: SelectedCartItemIds, masterSearch: _masterSearch, showImage: $scope._areImagesShown, showZeroRecords: $scope._areZeroRecordsShown, PageSize: _PageSize }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                debugger;
                log.success("into inventory Success");
                console.log(result.GetInventoriesResult.Payload);
                $scope.InventoryItems = result.GetInventoriesResult.Payload[0].Data;

                _TotalRecordsCurrent = result.GetInventoriesResult.Payload[0].Data.length;

                $scope.$apply();
            },
            error: function (req) {
                log.error("error during get inventory Success");
                console.log(req);
            },
            complete: function () {


            }
        });
    }



    $scope.PopulateInventoryItems = function () {

        //$scope.InventoryItems = ordersService.PopulateInventoryItems();

        //$scope.$apply();


        $scope.GetInventories();
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