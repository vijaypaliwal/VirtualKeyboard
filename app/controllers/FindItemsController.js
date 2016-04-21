﻿'use strict';
app.controller('FindItemsController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {

    $scope.InventoryItems = [];
    $scope.SecurityToken = "";
    $scope.InvObject = {
        InventoryID: 0, CurrentQuantity: "", AvgCostPerUnit: "", Uncontrolled: "", UniqueTag: "",
        ItemID: "", ItemNumber: "", ItemDescription: 0, UomID: 0, UOM: 0, LocationID: 0, Location: 0,
        LocationZone: "", LastTransactionID: 0, StatusValue: "", LastQuantityChange: 0, LastDateChange: "",
        CustomData: []
    };
    var _CanAct = 'True';
    var _CartObjLimit = 25;
    $scope.Cart = [];
    $scope.mainObjectToSend = [];
    $scope._Currentobj = {};
    var _IsOpenModal = false;

    var _currentPage = 1;
    var _sortColumn = "iLastITID";
    var _sortDir = "DESC";
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
    $scope.UnitDataList = [];
    $scope.CurrentActiveClass = "";

    var _IsLazyLoading = 0;
    var _TotalRecordsCurrent = 0;
    var _IsLazyLoadingUnderProgress = 0;
    $scope._areZeroRecordsShown = false;

    $scope.myinventoryColumnLoaded = false;

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


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

    //$("#mylist").mouseup(function () {
    //    clearTimeout(pressTimer)
    //    // Clear timeout
    //    return false;
    //}).mousedown(function () {
    //    // Set timeout
    //    pressTimer = window.setTimeout(function () {
    //        $("#myModalforlist").modal('show');
    //    }, 700)
    //    return false;
    //});


    $scope.ShowOptionModal = function () {
        if (_IsOpenModal == true) {
            $("#myModalforlist").modal('show');

            _IsOpenModal = false;
        }
    };

    $scope.SetCurrentObject = function (CurrentObj) {
        $scope._Currentobj = CurrentObj;
        CheckScopeBeforeApply();
        _IsOpenModal = true;
    }





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

    $scope.GoToDetailPage = function (obj) {
        localStorageService.set("CurrentDetailObject", obj);
        $location.path("/detail");
        console.log(localStorageService.get("CurrentDetailObject"));
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
        CheckScopeBeforeApply();
        $scope.PopulateInventoryItems();
    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
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


        ClearFilterArray();
        $scope.SearchValue = '';
        $scope.PopulateInventoryItems();
        $scope.SearchFromData = "All"
        $scope.SearchFromText = "Search";
        $(".norecords").hide();
        $("#btnMasterSearch").removeClass("bgm-red");


    }


    $scope.SearchInventory = function () {
        var _Value=$.trim($('#MasterSearch').val());
        if (_Value !== "") {
            $scope.myinventoryColumnLoaded = false;
            CheckScopeBeforeApply();
            $scope.GetInventories();
        }
    }


    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');

            $(".Addbtn .fa").removeClass('rotate');


        }
        else {
            $("#myModal2").modal('show');
            $(".Addbtn .fa").addClass('rotate');
        }
    }


    $scope.Showhideimage = function (isshow) {
        $scope.myinventoryColumnLoaded = false;
        CheckScopeBeforeApply();

        $scope._areImagesShown = isshow;
        $scope._HasImages = isshow;



        $("#myModal2").modal('hide');

        CheckScopeBeforeApply();

        $scope.GetInventories();
    }





    $scope.showhidezerorecord = function (showzero) {


        $scope.myinventoryColumnLoaded = false;
        CheckScopeBeforeApply();



        $scope._areZeroRecordsShown = showzero;
        CheckScopeBeforeApply();
        $("#myModal2").modal('hide');
        $scope.GetInventories();

    }

    $(window).scroll(function () {
        var _SearchValue = $.trim($("#MasterSearch").val());

        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                _IsLazyLoadingUnderProgress = 1;
                _PageSize = _TotalRecordsCurrent + 10;
                $scope.myinventoryColumnLoaded = false;
                CheckScopeBeforeApply();
                $scope.GetInventories();

            }
        }
    });



    function ClearFilterArray() {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";

        }
        CheckScopeBeforeApply();
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };


    $scope.GetActiveUnitDataField = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetActiveUnitDataFields',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   $scope.UnitDataList = response.GetActiveUnitDataFieldsResult.Payload;
                   CheckScopeBeforeApply()
               },
               error: function (response) {



               }
           });
    }
    function UpdateFilterArray(Field, Value) {

        for (var i = 0; i < $scope.FilterArray.length; i++) {
            if ($scope.FilterArray[i].ColumnName == Field) {
                $scope.FilterArray[i].SearchValue = Value;
                break;
            }

        }

        console.log("After updating data");
        console.log($scope.FilterArray);

        CheckScopeBeforeApply();
    }

    $scope.searchfunction = function (Byvalue) {

        ClearFilterArray();
        if ($.trim($scope.SearchValue) != "") {
            $scope.SearchFromData = Byvalue;
            var _tempArray = [];
            switch (Byvalue) {
                case "iStatusValue":

                    $scope.SearchFromText = "Status";
                    UpdateFilterArray("iStatusValue", $.trim($scope.SearchValue));

                    break
                case "lLoc":
                    $scope.SearchFromText = "Location";
                    UpdateFilterArray("lLoc", $.trim($scope.SearchValue));
                    break
                case "pPart":
                    $scope.SearchFromText = "Items";

                    UpdateFilterArray("pPart", $.trim($scope.SearchValue));
                    break
                case "All":
                    $scope.SearchFromText = "All";

                    break
                case "iReqValue":

                    $scope.SearchFromText = "Unique Tag";
                    UpdateFilterArray("iReqValue", $.trim($scope.SearchValue));
                    break
                default:
                    break;

            }
            $scope.PopulateInventoryItems();



        }
    }
    $scope.FilterArray = [
        { ColumnName: 'pPart', FilterOperator: 'cn', SearchValue: $('#pPart-filter').val() },
        { ColumnName: 'pDescription', FilterOperator: 'cn', SearchValue: $('#pDescription-filter').val() },
        { ColumnName: 'iQty', FilterOperator: 'num-eq', SearchValue: $('#iQty-filter').val() },
        { ColumnName: 'uomUOM', FilterOperator: 'cn', SearchValue: $('#uomUOM-filter').val() },
        { ColumnName: 'lLoc', FilterOperator: 'cn', SearchValue: $('#lLoc-filter').val() },
        { ColumnName: 'iStatusValue', FilterOperator: 'cn', SearchValue: $('#iStatusValue-filter').val() },
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
        return $scope.FilterArray;
    }
    $scope.GetInventories = function () {


        $scope.myinventoryColumnLoaded = false;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        var _masterSearch = $scope.SearchFromData == "All" ? $scope.SearchValue : "";

        $.ajax({
            type: "POST",
            url: serviceBase + 'GetInventories',
            data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, SelectedCartIDs: SelectedCartItemIds, masterSearch: _masterSearch, showImage: $scope._areImagesShown, showZeroRecords: $scope._areZeroRecordsShown, PageSize: _PageSize }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {

                $scope._areImagesShown = result.GetInventoriesResult.Payload[0].AreImagesShown
                $scope._areZeroRecordsShown = result.GetInventoriesResult.Payload[0].AreZeroRecords
                console.log(result.GetInventoriesResult.Payload);
                $scope.InventoryItems = result.GetInventoriesResult.Payload[0].Data;

                _TotalRecordsCurrent = result.GetInventoriesResult.Payload[0].Data.length;

                $scope.currentrecord = _TotalRecordsCurrent;
                $scope.totalrecords = result.GetInventoriesResult.Payload[0].TotalRercords;

                if (_TotalRecordsCurrent == 0) {
                    $(".norecords").show();
                    $(".bottomlink").hide();

                }
                else {
                    $(".norecords").hide();
                    $(".bottomlink").show();

                }

                $scope.myinventoryColumnLoaded = true;

                CheckScopeBeforeApply();
            },
            error: function (req) {
                log.error("error during get inventory Success");
                $scope.myinventoryColumnLoaded = true;
                CheckScopeBeforeApply();
                console.log(req);
            },
            complete: function () {
                _IsLazyLoadingUnderProgress = 0;
                SetSelectedIfAny();
            }
        });
    }


    $scope.PopulateInventoryItems = function () {



        $scope.GetInventories();
    }

    $scope._updateImg = function (src) {

        $scope.selectedImage = src;
        $("#myModal1").modal('show');
    }



    $scope.ScanItemSearch = function () {
        $scope.isSanned = false;

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {



            $scope.SearchValue = result.text;

            CheckScopeBeforeApply();

            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");



        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    }


    $("#MasterSearch").keyup(function (e) {
      var  _Value = $.trim($('#MasterSearch').val());
      if (_Value !== "") {

            $('#btnMasterSearch').addClass('bgm-red')
        }
        else {
            $scope.PopulateInventoryItems();
            $('#btnMasterSearch').removeClass('bgm-red')
        }

    });



    $scope.AddToCart = function (obj) {
         
        if (_CanAct == 'True') {


            var originalID = "#actionQty_" + obj.iID;



            //if ($(originalID).hasClass("btn-success"))
            if ($(originalID).find(".fa-check").css("color") == "rgb(0, 150, 136)") {

                $(originalID).find(".fa-check").css("color", "transparent");

                $(originalID).parent(".newlistitem").find(".img").css("opacity", "1")


            }
            else {
                if ($scope.mainObjectToSend.length < _CartObjLimit) {
                    $(originalID).find(".fa-check").css("color", "#009688");
                    $(originalID).parent(".newlistitem").find(".img").css("opacity", "0.4")
                }

            }

            addItemsToCart(obj, obj.iID, originalID);

        }
        else {
            return false;
        }

    }
    $scope.AddToCartSelectAll = function (obj) {

        if (_CanAct == 'True') {


            var originalID = "#actionQty_" + obj.iID;



            //if ($(originalID).hasClass("btn-success"))
            if ($(originalID).find(".fa-check").css("color") == "rgb(0, 150, 136)") {

                $(originalID).find(".fa-check").css("color", "transparent");

                $(originalID).parent(".newlistitem").find(".img").css("opacity", "1")


            }
            else {
                if ($scope.mainObjectToSend.length < _CartObjLimit) {
                    $(originalID).find(".fa-check").css("color", "#009688");
                    $(originalID).parent(".newlistitem").find(".img").css("opacity", "0.4")
                }

            }

            addItemsToCart(obj, obj.iID, originalID);

        }
        else {
            return false;
        }

    }

    $scope.SelectAll = function () {


        for (var i = 0; i < $scope.InventoryItems.length; i++) {
            if (i > _CartObjLimit) {
                break;
            }
            else {
                $scope.AddToCart($scope.InventoryItems[i]);

            }

        }

        $scope.OpentransactionModal();
    }

    $scope.DeselectAll = function () {

        $('#mylist .checkicon').each(function () {
            $(this).parent(".newlistitem").find(".img").css("opacity", "1")
            $(this).find(".fa-check").css("color", "transparent");
        });
        $scope.mainObjectToSend = [];
        localStorageService.set("ActivityCart", "");
        CheckScopeBeforeApply();
    }


    $('#mycartModal').on('hidden.bs.modal', function () {
        // do something…
        $(".cartcrossicon").hide();
        $(".cartcounter").show();


    });
    

    $('#myModal2').on('shown.bs.modal', function () {
        $(".Addbtn .fa").addClass('rotate');
    });

    $('#myModal2').on('hidden.bs.modal', function () {
        $(".Addbtn .fa").removeClass('rotate');
    });

    $('#mycartModal').on('shown.bs.modal', function () {
        // do something…
        $(".cartcrossicon").show();
        $(".cartcounter").hide();
    });
    $scope.OpentransactionModal = function () {


         


        if (_TotalRecordsCurrent != 0) {

            if ($("body").hasClass("modal-open")) {

                $(".transactionbody").removeClass('slideInUp');
                $(".transactionbody").addClass('slideOutDown');
                $(".cartcrossicon").hide();
                $(".cartcounter").show();
                setTimeout(function () { $("#mycartModal").modal('hide'); }, 1000);

            }
            else {

                $(".transactionbody").removeClass('slideOutDown');
                $(".transactionbody").addClass('slideInUp');
                $(".cartcrossicon").show();
                $(".cartcounter").hide();
                $("#mycartModal").modal('show');
            }

        }






    }
    function addItemsToCart(object, IdToSave, originalID) {
         
        var isItemExist = true;
        var TempValue = 0;
        var _zeroCount = 0;

        if ($(originalID).find(".fa-check").css("color") == "rgb(0, 150, 136)" && $scope.mainObjectToSend.length < _CartObjLimit) {

            $.each($scope.InventoryItems, function (i, v) {
                if (v.iID == IdToSave) {
                    isItemExist = true;
                    $.each($scope.mainObjectToSend, function (k, l) {

                        if (l.uId == IdToSave) {
                            isItemExist = false;
                        }
                    });

                    if (isItemExist == true) {



                        TempValue = 1;








                        $scope.mainObjectToSend.push({
                            uId: v.iID,
                            pID: v.pID,
                            pPart: v.pPart,
                            iLID: v.iLID,
                            iUOMID: v.iUOMID,
                            iQty: TempValue,
                            oquantity: v.iQty,
                            uomUOM: v.uomUOM,
                            lLoc: v.lLoc,
                            iStatusValue: v.iStatusValue,
                            pDescription: v.pDescription,
                            Action: '',
                            // CurrentInvObj: v,
                            iUniqueDate_date: v.iUniqueDate,
                            iUnitNumber2: v.iUnitNumber2,
                            iUnitNumber1: v.iUnitNumber1,
                            iUnitDate2_date: v.iUnitDate2,
                            iUnitTag3: v.iUnitTag3,
                            iUnitTag2: v.iUnitTag2,
                            pCountFrq: v.pCountFrq,
                            lZone: v.lZone,
                            ImageThumbPath: v.ImageThumbPath,
                            ImageDisplayName: v.ImageDisplayName,
                            iReqValue: v.iReqValue,
                            iCostPerUnit: v.pDefaultCost,



                        });


                    }
                    else {
                        var k = 0;

                    }


                }
            });

        } else {

            $scope.mainObjectToSend = $scope.mainObjectToSend.filter(function (el) {
                return el.uId != IdToSave;

            });


        }



        $scope.CurrentActiveClass = "bounceIn";
        CheckScopeBeforeApply();

        ResetCurrentActiveClass();

    }




    function ResetCurrentActiveClass() {
        setTimeout(function () {

            $scope.CurrentActiveClass = "";
            CheckScopeBeforeApply();
        }, 500);
    }


    function SetSelectedIfAny() {

        for (var i = 0; i < $scope.mainObjectToSend.length; i++) {

            $scope.AddToCart(GetInventoryItem($scope.mainObjectToSend[i].uId));


        }


    }

    function GetInventoryItem(id) {
        for (var i = 0; i < $scope.InventoryItems.length; i++) {

            if ($scope.InventoryItems[i].iID == id) {
                return $scope.InventoryItems[i];

            }

        }
    }

    function init() {
        var _myItemsList = localStorageService.get("ActivityCart");
        _myItemsList = _myItemsList != null && _myItemsList != undefined ? _myItemsList : [];
        if (_myItemsList.length > 0) {

            var j = 0;
            for (j = 0; j < _myItemsList.length; j++) {
                var v = _myItemsList[j].InventoryDataList;
                $scope.mainObjectToSend.push({
                    uId: v.uId,
                    pID: v.pID,
                    pPart: v.pPart,
                    iLID: v.iLID,
                    iUOMID: v.iUOMID,
                    iQty: v.iQty,
                    oquantity: v.oquantity,
                    uomUOM: v.uomUOM,
                    lLoc: v.lLoc,
                    iStatusValue: v.iStatusValue,
                    pDescription: v.pDescription,
                    Action: '',
                    iUniqueDate_date: v.iUniqueDate,
                    iUnitNumber2: v.iUnitNumber2,
                    iUnitNumber1: v.iUnitNumber1,
                    iUnitDate2_date: v.iUnitDate2,
                    iUnitTag3: v.iUnitTag3,
                    iUnitTag2: v.iUnitTag2,
                    pCountFrq: v.pCountFrq,
                    lZone: v.lZone,
                    ImageThumbPath: v.ImageThumbPath,
                    ImageDisplayName: v.ImageDisplayName,
                    iReqValue: v.iReqValue,
                    iCostPerUnit: v.pDefaultCost,



                });
            }

            CheckScopeBeforeApply();


        }
        $scope.GetActiveUnitDataField();
        $scope.PopulateInventoryItems();

        //SetSelectedIfAny();

    }

    init();
    function GetDataToSend(mainObjectToSend) {
        if (mainObjectToSend.length > 0) {
            for (var i = 0; i < mainObjectToSend.length; i++) {
                $scope.Cart.push({
                    InventoryID: mainObjectToSend[i].uId,
                    IsLineItemData: [],
                    iCostPerItem: mainObjectToSend[i].iCostPerUnit,
                    ItemID: mainObjectToSend[i].pPart,
                    ActionPerformed: $scope.selectedAction,
                    AdjustActionQuantity: "",
                    AdjustCalculation: "",
                    InventoryDataList: mainObjectToSend[i],
                    IncreaseDecreaseVMData: ({ ActionQuantity: "" }),
                    MoveTransactionData: ({ ActionQuantity: "", StatusToUpdate: mainObjectToSend[i].iStatusValue, MoveToLocationText: "", MoveToLocation: "" }),
                    UpdateTransactionData: ({ ActionQuantity: "", StatusToUpdate: mainObjectToSend[i].iStatusValue }),
                    ApplyTransactionData: ({ ActionQuantity: "", UnitTag1: mainObjectToSend[i].iReqValue, UnitTag2: mainObjectToSend[i].iUnitTag2, UnitTag3: mainObjectToSend[i].iUnitTag3, UniqueDate: mainObjectToSend[i].iUniqueDate_date, UnitDate2: mainObjectToSend[i].iUnitDate2_date, UnitNumber1: mainObjectToSend[i].iUnitNumber1, UnitNumber2: mainObjectToSend[i].iUnitNumber2 }),
                    ConvertTransactionData: ({ ActionFromQuantity: "", ActionToQuantity: "", ToUOMID: 0 }),
                });
            }

        }
        return $scope.Cart;
    }



    // Go to next page after select particular activity from list(Increase,decrease,move,convert,tag..)
    $scope.GoToNextMobile = function (selectedAction) {
        $scope.selectedAction = selectedAction;
        var _dataToSend = GetDataToSend($scope.mainObjectToSend);
        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _dataToSend);

        localStorageService.set("SelectedAction", "");
        localStorageService.set("SelectedAction", selectedAction);

        console.log(localStorageService.get("ActivityCart"));
        $("#mycartModal").modal('hide');
        $location.path("/activity");

    }

    $scope.Showhideimage('true');
}]);




app.directive('onLongPress', function ($timeout) {
    //Global variable, to cancel timer on touchend.
    var timer;
    var count = 0;
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {
            $elm.bind('touchstart', function (evt) {
                // Locally scoped variable that will keep track of the long press
                $scope.longPress = true;

                // We'll set a timeout for 600 ms for a long press
                timer = $timeout(function () {
                    if ($scope.longPress) {
                        count++;
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onLongPress)
                        });
                    }
                }, 600);

                timer;
            });

            $elm.bind('touchend', function (evt) {
                // Prevent the onLongPress event from firing
                $scope.longPress = false;

                // Prevent on quick presses, unwanted onLongPress selection.
                $timeout.cancel(timer);

                // If there is an on-touch-end function attached to this element, apply it
                if ($attrs.onTouchEnd) {

                    if (count < 1) {
                        count = 0;
                        //$scope.$apply(function () {
                        //    $scope.$eval($attrs.ngClick)
                        //});
                    }
                    else {
                        count = 0;
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onTouchEnd)
                        });
                    }






                }
            });



        }
    };
})


