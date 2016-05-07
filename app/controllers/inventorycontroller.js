﻿'use strict';
app.controller('inventoryController', ['$scope', '$location', 'authService', 'localStorageService', 'log', '$compile', function ($scope, $location, authService, localStorageService, log, $compile) {
    ''
    $scope.orders = [];
    $scope.MyinventoryFields = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.StatusList = [];
    $scope.UOMSearching = false;
    $scope.CurrentActiveField = "";
    $scope.CurrentActiveFieldDatatype = "";
    $scope.Totalslides = 0;
    $scope.InventoryObject = {
        IsFullPermission: true, AutoID: false, PID: 0, ItemID: "", Description: "", Quantity: "", Uom: "", UomID: 0, Location: "", lZone: "", LocationID: 0, UniqueTag: "", Cost: 0,
        UpdateDate: "/Date(1320825600000-0800)/", Status: "", ItemGroup: "", UniqueDate: "/Date(1320825600000-0800)/", UnitDate2: "/Date(1320825600000-0800)/", UnitNumber1: 0, UnitNumber2: 0, UnitTag2: "",
        UnitTag3: "", CustomPartData: [], CustomTxnData: []
    };

    $scope.CommonArray = ['iUnitNumber1', 'iUnitNumber2', 'iUnitTag3', 'iUnitTag2', 'iReqValue', 'pPart', 'pDescription', 'iQty', 'lLoc', 'lZone', 'iStatusValue', 'uomUOM', 'pCountFrq', 'iCostPerUnit'];

    $scope.LocationList = [{ LocationName: "dhdd", LocationZone: "", LocationID: 678325 },
                           { LocationName: "Here", LocationZone: "", LocationID: 678323 },
                           { LocationName: "in store", LocationZone: "", LocationID: 678030 },
                           { LocationName: "New gallon location", LocationZone: "", LocationID: 678363 },
                           { LocationName: "New loc", LocationZone: "", LocationID: 678542 },
                           { LocationName: "Random", LocationZone: "", LocationID: 678370 },
                           { LocationName: "Stock", LocationZone: "", LocationID: 678361 },
                           { LocationName: "there", LocationZone: "", LocationID: 663546 },
                           { LocationName: "Trade", LocationZone: "", LocationID: 678546 },
                           { LocationName: "BLC1009", LocationZone: "", LocationID: 123 }];
    $scope.UOMList = [];
    $scope.ItemList = [];
    $scope.ImageList = [];

    $scope.Quantity = "N/A";
    $scope.ItemName = "N/A";
    $scope.Description = "N/A";
    $scope.Location = "N/A";
    $scope.Status = "N/A";
    $scope.UOM = "N/A";
    $scope.scanfieldID = "pPartForm";
    $scope.UnitDataList = [];
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.laststepindex = 0;
    _CurrentUrl = "Inventory";
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply()
    }
    var _colid = "";

    $scope.SearchItemValue = "";
    $scope.ItemSearching = "";
    $scope.SearchList = [];
    $scope.SearchLocationValue = "";
    $scope.LocationSearching = "";
    $scope.LocationSearchList = [];

    $scope.isnoitemmsg = false;
    $scope.isnolocationmsg = false;
    $scope.isnouommsg = false;
    $scope.slide = 1000;

    var FileName = "";
    var StreamData = "";

    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";


    if (deviceType == 'iPhone') {
        $(".iosbtn").show()
        $(".androidbtn").hide()
    }
    else {
        $(".androidbtn").show()
        $(".iosbtn").hide()
    }

    

    $scope.CheckInCommonArray = function (Column) {
        for (var i = 0; i < $scope.CommonArray.length ; i++) {
            if ($scope.CommonArray[i] == Column) {
                return true;
            }
        }
        return false;
    }


    $scope.GetLastValueCustom = function (id, Type) {



        var field = "Inv_" + id;
        var _fieldid = "";

        switch (Type) {
            case 1:
                _fieldid = "#CustomItem_" + id;
                break;
            case 2:
                _fieldid = "#CustomActivity_" + id;
                break;
            default:

        }

        var _value = "";
        var _toCheckValue = localStorageService.get(field);
        if (_toCheckValue != null && _toCheckValue != undefined) {
            _value = _toCheckValue;


            $(_fieldid).val(_value);
            $(_fieldid).trigger('change');
        }
        else {

            $(_fieldid).val(_value);
            $(_fieldid).trigger('change');

        }


    }
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    //var rString = randomString(10, '0123456789');
    $scope.GetLastValue = function (field, id) {




        var _value = "";
        var _toCheckValue = localStorageService.get(field);




        if (_toCheckValue != null && _toCheckValue != undefined) {
            _value = _toCheckValue;

            if (id == "#UOM") {
                $scope.InventoryObject.Uom = _value;
                $scope.$apply();

                $(id).trigger('change');


            }
            else if (id == "#Location") {
                $scope.InventoryObject.Location = _value;
            }
            else {
                $(id).val(_value);

                $(id).trigger('change');
            }
        }
        else {

            $(id).val(_value);
            $(id).trigger('change');

        }
        CheckScopeBeforeApply()

    }

    $scope.$watch('InventoryObject', function () {



        var _TempObj = $scope.InventoryObject;

        $.each(_TempObj, function (datakey, datavalue) {


            switch (datakey) {
                case "ItemName":
                    $scope.ItemName = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "Description":
                    $scope.Description = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "Status":
                    $scope.Status = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "Quantity":

                    $scope.Quantity = datavalue != null && datavalue != undefined && datavalue != "" ? datavalue : "N/A";
                    break;
                case "UOM":
                    $scope.UOM = datavalue != null && datavalue != undefined && datavalue != "" ? $scope.GetUOMfromArray(datavalue) : "N/A";
                    break;
                case "Location":
                    $scope.Location = datavalue != null && datavalue != undefined && datavalue != "" ? $scope.GetLocaTextfromArray(datavalue) : "N/A";
                    break;
                default:

            }

        });



    }, true);


    $scope.fillitem = function () {

        $scope.InventoryObject.ItemID = $scope.SearchItemValue;
        $("#itemlistmodal").modal('hide');
        CheckScopeBeforeApply()

    }

    $scope.filllocation = function () {

        $scope.InventoryObject.Location = $scope.SearchLocationValue;
        $("#locationlistmodal").modal('hide');
        CheckScopeBeforeApply()

    }

    $scope.filluom = function () {

        $scope.InventoryObject.Uom = $scope.SearchUOMValue;
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()

    }




    $scope.SetItemData = function (obj) {

        $scope.InventoryObject.ItemID = obj.ItemID;

        $scope.InventoryObject.Description = obj.ItemDescription;

        $scope.InventoryObject.Location = obj.DefaultLocation;

        $scope.InventoryObject.LocationID = obj.DefaultLocationID;

        $scope.InventoryObject.UomID = obj.DefaultUomID;
        $scope.InventoryObject.Uom = obj.DefaultUom;

        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()
    }


    $scope.LocationSetItemData = function (obj) {

        $scope.InventoryObject.Location = obj.LocationName;

        $scope.InventoryObject.LocationID = obj.LocationID;

        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()
    }



    $scope.UOMSetItemData = function (obj) {

        $scope.InventoryObject.Uom = obj.UnitOfMeasureName;


        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('hide');
        CheckScopeBeforeApply()
    }


    $scope.OnChangeUOMFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        if ($.trim($scope.SearchUOMValue) != "") {

            $scope.UOMSearching = true;

            $.ajax({

                type: "POST",
                url: serviceBase + "SearchUOMAutoComplete",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchUOMValue }),
                error: function () {

                    $scope.UOMSearching = false;
                    log.error('There is a problem with the service!');
                },

                success: function (data) {

                    if (data.SearchUOMAutoCompleteResult != null && data.SearchUOMAutoCompleteResult.Payload != null) {
                        $scope.UOMSearching = false;
                        $scope.UOMSearchList = data.SearchUOMAutoCompleteResult.Payload;


                        if ($scope.UOMSearchList.length == 0)
                            $scope.isnouommsg = true
                        else
                            $scope.isnouommsg = false

                        CheckScopeBeforeApply()

                    }



                }
            });
        }
        else {
            $scope.UOMSearchList = [];
            $scope.isnouommsg = true
            CheckScopeBeforeApply();
        }
    }

    $scope.TrimValue = function (value) {
        return $.trim(value);
    }

    $scope.OnChangeItemNameFunction = function () {



        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        if ($.trim($scope.SearchItemValue) != "") {
            $scope.ItemSearching = true;
            $.ajax({

                type: "POST",
                url: serviceBase + "SearchItems",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchItemValue }),
                error: function () {

                    $scope.ItemSearching = false;
                    log.error('There is a problem with the service!');
                },

                success: function (data) {

                    if (data.SearchItemsResult != null && data.SearchItemsResult.Payload != null) {
                        $scope.ItemSearching = false;
                        $scope.SearchList = data.SearchItemsResult.Payload;

                        if ($scope.SearchList.length == 0)
                            $scope.isnoitemmsg = true;
                        else
                            $scope.isnoitemmsg = false;


                        CheckScopeBeforeApply()

                    }
                }
            });
        }
        else {
            $scope.SearchList = [];
            $scope.isnoitemmsg = true;

            CheckScopeBeforeApply();
        }
    }




    $scope.OnChangeLocationNameFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        if ($.trim($scope.SearchLocationValue) != "") {

            $scope.LocationSearching = true;
            $.ajax({

                type: "POST",
                url: serviceBase + "SearchLocationAutoComplete",
                contentType: 'application/json; charset=utf-8',

                dataType: 'json',

                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchLocationValue }),
                error: function () {

                    $scope.LocationSearching = false;
                    log.error('There is a problem with the service!');
                },

                success: function (data) {
                    debugger;
                    if (data.SearchLocationAutoCompleteResult != null && data.SearchLocationAutoCompleteResult.Payload != null) {
                        $scope.LocationSearching = false;
                        $scope.LocationSearchList = data.SearchLocationAutoCompleteResult.Payload;


                        if ($scope.LocationSearchList.length == 0)
                            $scope.isnolocationmsg = true
                        else
                            $scope.isnolocationmsg = false

                        CheckScopeBeforeApply()

                    }



                }
            });
        }
        else {
            $scope.LocationSearchList = [];
            $scope.isnolocationmsg = true
            CheckScopeBeforeApply()
        }
    }





    $scope.GetLocalStoargeVarID = function (id) {
        return "Inv_" + id;
    }

    $scope.GetCustomItemDivID = function (id) {
        return "#CustomItem_" + id;
    }


    $scope.GetCustomActivityDivID = function (id) {
        return "#CustomItem_" + id;
    }




    $scope.IsRequired = function (id, type) {
        var _CustomFieldArray = [];
        switch (type) {
            case 1:
                _CustomFieldArray = $scope.CustomItemDataList;
                break;
            case 2:
                _CustomFieldArray = $scope.CustomActivityDataList;
                break;

            default:

        }


        for (var i = 0; i < _CustomFieldArray.length; i++) {
            if (_CustomFieldArray[i].cfdIsRequired == true && _CustomFieldArray[i].cfdID == id) {
                return true;
            }
        }

        return false;

    }
    $scope.CheckRequiredField = function () {

        if ($scope.InventoryObject.ItemID == "" || $scope.InventoryObject.Location == "" || $scope.InventoryObject.Uom == "") {
            return true;

        }

        return false;
    }

    $scope.CheckCustomRequiredFields = function () {


        for (var i = 0; i < $scope.InventoryObject.CustomPartData.length; i++) {

            if ($scope.IsRequired($scope.InventoryObject.CustomPartData[i].CfdID, 1) == true && $scope.InventoryObject.CustomPartData[i].Value == "") {
                return true;
            }

        }
        for (var i = 0; i < $scope.InventoryObject.CustomTxnData.length; i++) {
            if ($scope.IsActiveTransactionField($scope.InventoryObject.CustomTxnData[i].CfdID) == true && $scope.IsRequired($scope.InventoryObject.CustomTxnData[i].CfdID, 2) == true && $scope.InventoryObject.CustomTxnData[i].Value == "") {
                return true;
            }
        }

        return false;
    }

   
    $scope.resetObject = function () {
        $scope.InventoryObject = {
            IsFullPermission: true, AutoID: false, PID: 0, ItemID: "", Description: "", Quantity: 0, Uom: "", UomID: 0, Location: "", lZone: "", LocationID: 0, UniqueTag: "", Cost: 0,
            UpdateDate: "/Date(1320825600000-0800)/", Status: "", ItemGroup: "", UniqueDate: "/Date(1320825600000-0800)/", UnitDate2: "/Date(1320825600000-0800)/", UnitNumber1: 0, UnitNumber2: 0, UnitTag2: "",
            UnitTag3: "", CustomPartData: [], CustomTxnData: []
        };
        $scope.ImageList = [];

        $("#defaultimg").remove();
        $('#list321').html('<img id="defaultimg" ng-click="getstep(9,\&#39;Image\&#39;)" style="height:100px; width:95px; border:1px solid #ccc;" src="img/default.png" alt="Alternate Text">');
        $('#list123').html('');
    }

    $scope.addinventory = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $('#addinventories').addClass("disabled");
        $('#addinventories').find(".fa").addClass("fa-spin");


        var _TempObj = $scope.InventoryObject;

        var ImageData = $("#list123").find("img").attr("src");
        $.each(_TempObj, function (datakey, datavalue) {

            if (datakey != "CustomPartData" && datakey != "CustomTxnData") {
                if (datakey == "ItemID" && _TempObj.AutoID == true) {


                    datakey = "Inv_" + datakey;
                    localStorageService.set(datakey, "");

                }
                else {
                    datakey = "Inv_" + datakey;
                    localStorageService.set(datakey, "");
                    localStorageService.set(datakey, datavalue);
                }

            }

            else {
                if (datavalue.length > 0) {
                    for (var i = 0; i < datavalue.length; i++) {

                        datakey = "Inv_" + datavalue[i].CfdID;
                        localStorageService.set(datakey, "");
                        localStorageService.set(datakey, datavalue[i].Value);

                    }

                }
            }
        });

        $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity == "" ? 0 : $scope.InventoryObject.Quantity;

        var _sum = 0;
        for (var i = 0; i < $scope.ImageList.length; i++) {

            if ($scope.ImageList[i].bytestring != null && $scope.ImageList[i].bytestring != undefined) {
                $scope.ImageList[i].bytestring = removePaddingCharacters($scope.ImageList[i].bytestring);
                if ($scope.ImageList[i].size != null && $scope.ImageList[i].size != undefined) {

                    _sum = _sum + parseFloat($scope.ImageList[i].size);
                }
            }

        }

        if (_sum > 5000000) {
            log.warning("You are trying to upload more than one image, it may take some time to upload, please be patient.")
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'AddInventoryData',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Data": $scope.InventoryObject, "ImageList": $scope.ImageList }),
              success: function (response) {

                  ShowSuccess("Saved");

                  $scope.resetObject();

                  movetolist();
                  // $location.path('/inventory');

                  CheckScopeBeforeApply()

                  $('#addinventories').removeClass("disabled");
                  $('#addinventories').find(".fa").removeClass("fa-spin");
              },
              error: function (err) {


                  console.log(err);
                  log.error("Error Occurred during operation");

                  $('#addinventories').removeClass("disabled");
                  $('#addinventories').find(".fa").removeClass("fa-spin");

              }
          });


    }


    $scope.IsAvailableMyInventoryColumn = function (ColumnName) {
        var i = 0;
        for (i = 0; i < $scope.MyinventoryFields.length; i++) {
            if ($scope.MyinventoryFields[i].ColumnName == ColumnName) {
                return true;
            }
        }

        return false;
    }


    $scope.itemlist = function () {

        $("#locationlistmodal").modal('hide');

        $("#itemlistmodal").modal('show');

        $scope.SearchList = [];
        $scope.SearchItemValue = "";
        $scope.isnoitemmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);

    }

    $scope.UOMlist = function () {

        $("#itemlistmodal").modal('hide');
        $("#locationlistmodal").modal('hide');
        $("#uomlistmodal").modal('show');
        $scope.UOMSearchList = [];
        $scope.SearchUOMValue = "";
        $scope.isnoUOMmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);


    }

    $scope.locationlist = function () {

        $("#itemlistmodal").modal('hide');
        $("#locationlistmodal").modal('show');

        $scope.LocationSearchList = [];
        $scope.SearchLocationValue = "";
        $scope.isnolocationmsg = false
        $('html,body').animate({ scrollTop: 0 }, 800);


    }


    $(document)
 .on('focus', 'input', function () {


     $('.topheader').css("position", "absolute");

 })
 .on('blur', 'input', function () {

     $('.topheader').css("position", "absolute");
     $('.iteminfopanel').css('margin-top', '80px');

 });


    $scope.GetAllData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllData',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {

                  var _TempArray = response.GetAllDataResult.Payload;

                  // MY inventory column region
                  var _TempArrayMyInventory = response.GetAllDataResult.Payload[0].MyInventoryColumns;

                  for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                      var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                      _TempArrayMyInventory[i].ColumnName = _ColName[0];
                      if (_TempArrayMyInventory[i].Show == "True") {
                          $scope.MyinventoryFields.push(_TempArrayMyInventory[i]);
                      }
                  }
                  CheckScopeBeforeApply()
                  // Custom Item Field 

                  $scope.CustomItemDataList = response.GetAllDataResult.Payload[0].CustomItemField;
                  CheckScopeBeforeApply();

                  for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                      $scope.InventoryObject.CustomPartData.push({ CfdID: $scope.CustomItemDataList[i].cfdID, Value: $scope.CustomItemDataList[i].cfdDefaultValue, DataType: $scope.CustomItemDataList[i].cfdDataType });
                  }
                  CheckScopeBeforeApply()
                  // Custom Activity Field 

                  $scope.CustomActivityDataList = response.GetAllDataResult.Payload[0].CustomActivityField;
                  CheckScopeBeforeApply()

                  for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                      $scope.InventoryObject.CustomTxnData.push({ CfdID: $scope.CustomActivityDataList[i].cfdID, Value: $scope.CustomActivityDataList[i].cfdDefaultValue, DataType: $scope.CustomActivityDataList[i].cfdDataType });
                  }
                  CheckScopeBeforeApply()
                  // Unit Of Measure
                  $scope.UOMList = response.GetAllDataResult.Payload[0].UnitOfMeasure;
                  CheckScopeBeforeApply()
                  // Status
                  $scope.StatusList = response.GetAllDataResult.Payload[0].Status;
                  CheckScopeBeforeApply()
                  AfterLoadedData();

              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");


              }
          });
    }

    $scope.GetMyinventoryColumns = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetMyInventoryColumns',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {

                  var _TempArray = response.GetMyInventoryColumnsResult.Payload;

                  for (var i = 0; i < _TempArray.length; i++) {
                      var _ColName = _TempArray[i].ColumnName.split("#");
                      _TempArray[i].ColumnName = _ColName[0];
                      if (_TempArray[i].Show == "True") {
                          $scope.MyinventoryFields.push(_TempArray[i]);
                      }
                  }
                  CheckScopeBeforeApply()

              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");


              }
          });

    }

    $scope.getstatus = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetStatus',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   $scope.StatusList = response.GetStatusResult.Payload;
                   CheckScopeBeforeApply()
               },
               error: function (err) {

                   log.error(err.Message);

               }
           });

    }




    $scope.HighLightTerm = function (term, Text) {
        if ($.trim(term) != "") {

            var src_str = Text;
            var term = term;
            term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
            var pattern = new RegExp("(" + term + ")", "gi");

            src_str = src_str.replace(pattern, "<mark>$1</mark>");
            src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");

            return src_str;
        }
        else {
            return Text;
        }
    }

    $scope.getuom = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {

                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   CheckScopeBeforeApply()
               },
               error: function (err) {

                   log.error(err.Message);

               }
           });

    }

    $scope.getlocation = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetLocations',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {



                   $scope.LocationList = response.GetLocationsResult.Payload;
                   CheckScopeBeforeApply()
               },
               error: function (response) {


                   console.log(response);


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
               url: serviceBase + 'GetItems',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {



                   $scope.ItemList = response.GetItemsResult.Payload;
                   CheckScopeBeforeApply()
               },
               error: function (err) {

                   log.error(err.Message);

               }
           });

    }

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
    $scope.IsActiveTransactionField = function (cfdid) {


        $scope.CurrentOperation = "Increase";
        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].cfdCustomFieldType == "Inventory" && $scope.CustomActivityDataList[i].cfdID == cfdid) {
                switch ($scope.CurrentOperation) {
                    case "Increase":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnAdd) {

                            return true;
                        }
                        break;
                    case "Decrease":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnSubtract) {
                            return true;
                        }
                        break;
                    case "Move":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnMove) {
                            return true;
                        }
                        break;
                    case "Apply":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnApply) {
                            return true;
                        }
                        break;
                    case "Update":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnStatus) {
                            return true;
                        }
                        break;
                    case "Convert":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnConvert) {
                            return true;
                        }
                        break;

                    default:
                        return true;
                        break;

                }
            }
        }
    }
    $scope.GetCustomDataField = function (Type) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetCustomFieldsData',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type }),
               success: function (response) {


                   if (Type == 0) {
                       $scope.CustomItemDataList = response.GetCustomFieldsDataResult.Payload;

                       for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                           $scope.InventoryObject.CustomPartData.push({ CfdID: $scope.CustomItemDataList[i].cfdID, Value: $scope.CustomItemDataList[i].cfdDefaultValue, DataType: $scope.CustomItemDataList[i].cfdDataType });
                       }

                   }
                   else if (Type == 1) {
                       $scope.CustomActivityDataList = response.GetCustomFieldsDataResult.Payload;


                       for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                           $scope.InventoryObject.CustomTxnData.push({ CfdID: $scope.CustomActivityDataList[i].cfdID, Value: $scope.CustomActivityDataList[i].cfdDefaultValue, DataType: $scope.CustomActivityDataList[i].cfdDataType });
                       }

                       //  setTimeout(function () { $scope.swiperfunction(); }, 2000);


                       CheckScopeBeforeApply()


                   }

                   CheckScopeBeforeApply()
               },
               error: function (response) {

                   //     $scope.InventoryObject.Location = 678030;

               }
           });
    }

    $scope.OpenBox = function () {
        $("#files").trigger("click");
    }

    $scope.triggerFileClick = function () {
        $("#files").trigger("click");
        $("#myModalforlist").modal("hide");
    }


    $scope.OpenBoxAndroid = function () {
        $("#myModalforlist").modal("show");
    }



    $("#files").on('change', function (event) {
        $scope.handleFileSelect(event);
    });


    $scope.handleFileSelect = function (evt) {
        var files = evt.target.files;
        FileName = "";
        StreamData = "";
        var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {

                var id = randomString(5, '0123456789');
                _ImgObj.ImageID = id;

                var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
                var compilehtml = $compile(crossicon)($scope);




                return function (e) {
                    // Render thumbnail.
                    FileName = theFile.name;
                    StreamData = e.target.result;
                    _ImgObj.FileName = FileName;
                    _ImgObj.bytestring = e.target.result;
                    _ImgObj.Size = theFile.size;
                    var span = document.createElement('span');
                    span.innerHTML =
                    [
                      '<img id="' + id + '" style="height: 75px; width:75px; border: 1px solid #ccc; margin:10px; margin-top:0px;" src="',
                      e.target.result,
                      '" title="', escape(theFile.name),
                      '"/> ' + compilehtml[0].outerHTML + ''
                    ].join('');

                    document.getElementById('list123').insertBefore(span, null);

                    var imagepath = '<span><img  id="' + id + '" style="height: 100px;width: 95px; border: 1px solid #ccc; margin:0px; margin-top:0px; position:absolute;" src="' + e.target.result + '"></span>'


                    $("#list321").append(imagepath);

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }

        setTimeout(function () {

            $scope.ImageList.push(_ImgObj);
            $(".removeImage").bind("click", function () {

                removeImage($(this).attr("altid"));
            });
        }, 100);



    }




    function removeImage(_this) {



        $("#" + _this).each(function () {

            $(this).parent("span").remove();
        });

        for (var i = 0; i < $scope.ImageList.length; i++) {
            if ($scope.ImageList[i].ImageID == _this) {
                $scope.ImageList.splice(i, 1);
                break;
            }

        }


        removeImage(_this)

    }

    function init() {
        $scope.GetAllData();
        

    }

  

    function ConvertDatetoDate(_stringDate)
    {
        var today = new Date(_stringDate);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        today = yyyy + '-' + mm + '-' + dd;

        return today;
    }

    init();
    $scope.GetValueFromArrray = function (ItemNumber) {
        if ($.trim(ItemNumber) != "") {

            for (var i = 0; i < $scope.ItemList.length; i++) {
                if ($scope.ItemList[i].ItemNumber == ItemNumber) {
                    return $scope.ItemList[i].ItemID;
                }

            }
        }
        return "";
    }
    $scope.GetLocaValuefromArray = function (Location) {
        if ($.trim(Location) != "") {

            for (var i = 0; i < $scope.LocationList.length; i++) {
                if ($scope.LocationList[i].LocationName == Location) {
                    return $scope.LocationList[i].LocationID;
                }

            }
        }
        return "";

    }







    $scope.GetLocaTextfromArray = function (Location) {
        if ($.trim(Location) != "") {

            for (var i = 0; i < $scope.LocationList.length; i++) {
                if ($scope.LocationList[i].LocationID == Location) {
                    return $scope.LocationList[i].LocationName;
                }

            }
        }
        return "";

    }


    $scope.GetUOMfromArray = function (UOMID) {
        if ($.trim(UOMID) != "") {

            for (var i = 0; i < $scope.UOMList.length; i++) {
                if ($scope.UOMList[i].UnitOfMeasureID == UOMID) {
                    return $scope.UOMList[i].UnitOfMeasureName;
                }

            }
        }
        return "";
    }


    $scope.ScanNewsearch = function () {



        $scope.SearchItemValue = "";
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.SearchItemValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeItemNameFunction();
                CheckScopeBeforeApply()
            }, 500);

            vibrate()




        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.ScanLocationsearch = function () {
        $scope.SearchLocationValue = "";
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.SearchLocationValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeLocationNameFunction();
                CheckScopeBeforeApply()
            }, 100);

            vibrate()


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.ScanUOMsearch = function () {
        $scope.SearchLocationValue = "";
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.SearchUOMValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeUOMFunction();
                CheckScopeBeforeApply()
            }, 100);

            vibrate()


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.IsinavailableInventoryField = function (field) {
        var _FieldArray = ["iReqValue", "iUnitTag2", "iUnitTag3", "iUniqueDate", "iUnitDate2", "iUnitNumber1", "iUnitNumber2", "pDescription", "pPart", "lLoc", "uomUOM", "iQty", "iStatusValue","pCountFrq","lZone"]



        for (var i = 0; i < _FieldArray.length; i++) {
            if (_FieldArray[i] == field) {
                return true;
            }
        }
        return false;
    }

    function GetFieldType(fieldName)
    {
        switch (fieldName) {


          
            case "iUniqueDate":
            case "iUnitDate2":
                return 3;
                break;
            case "iQty":
            case "iUnitNumber1":
            case "iUnitNumber2":
                return 1;
                break;
            default:
                return 4;
                break;
        }
    }
    $scope.ScanNew = function () {



        var _id = "#";

        var ControlID = $scope.CurrentActiveField;
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            var resultvalue = result.text;
            var _fieldType = GetFieldType(ControlID);
            if (_fieldType != 4) {

                resultvalue = $scope.Validation(resultvalue, _fieldType) == true ? resultvalue : "";
            }
            if (resultvalue != "") {
                switch (ControlID) {
                    case "pPart":
                        _id = "#ItemName";
                        $scope.InventoryObject.ItemID = resultvalue;
                        break;
                    case "lLoc":
                        _id = "#Location";
                        $scope.InventoryObject.Location = resultvalue;
                        break;
                    case "uomUOM":
                        _id = "#UOM";
                        $scope.InventoryObject.Uom = resultvalue;
                        break;
                    case "iQty":
                        _id = "#iQty";
                        $scope.InventoryObject.Quantity = resultvalue;
                        break;
                    case "iStatusValue":
                        break;
                    case "pDescription":
                        _id = "#pDescriptionForm";
                        $scope.InventoryObject.Description = resultvalue;
                        break;
                    case "iReqValue":
                        _id = "#UniqueTag";
                        $scope.InventoryObject.UniqueTag = resultvalue;
                        break;
                    case "iUnitTag2":
                        _id = "#UnitTag2";
                        $scope.InventoryObject.UnitTag2 = resultvalue;
                        break;
                    case "iUnitTag3":
                        _id = "#UnitTag3";
                        $scope.InventoryObject.UnitTag3 = resultvalue;
                        break;
                    case "iUniqueDate":
                        _id = "#UniqueDate";
                        resultvalue = ConvertDatetoDate(resultvalue);
                        $scope.InventoryObject.UniqueDate = resultvalue;
                        break;
                    case "iUnitDate2":
                        _id = "#UnitDate2";
                        resultvalue = ConvertDatetoDate(resultvalue);
                        $scope.InventoryObject.UnitDate2 = resultvalue;
                        break;
                    case "iUnitNumber1":
                        _id = "#UnitNumber1";
                        $scope.InventoryObject.UnitNumber1 = resultvalue;
                        break;
                    case "iUnitNumber2":
                        _id = "#UnitNumber2";
                        $scope.InventoryObject.UnitNumber2 = resultvalue;
                        break;
                    case "pCountFrq":
                        _id = "#itemgroup";
                        $scope.InventoryObject.ItemGroup = resultvalue;
                        break;
                    case "lZone":
                        _id = "#lZone";
                        $scope.InventoryObject.lZone = resultvalue;
                        break;
                    default:

                }



                $(_id).val(resultvalue);

                mySwiper.swipeNext();

                CheckScopeBeforeApply();


            }

            else {

                $scope.ShowScanError(_fieldType);
            }



            vibrate();



        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }
    $scope.ShowScanError=function(type)
    {
        switch (type) {
            case 1:
                log.error("Scanned value is not proper number value.");
                break;
            case 2:
                log.error("Scanned value is not proper boolean value.");
                break;
            case 3:
                log.error("Scanned value is not proper date value.");
                break;
            default:
                break;

        }
    }
    $scope.GetCustomDataType=function(Type)
    {
        switch (Type) {
            case "string":
                return 4;
                break;
            case "date":
            case "datetime":
                return 3;
                break;
            case "checkbox":
                return 2;
                break;
            case "number":
            case "money":
            case "decimal":
            case "currency":
                return 1;
                break;
            default:
                return 4;
                break;


           
        }
    }
    $scope.ScanNewCustom = function () {
        var _id = "#" + _colid;

        var _colarray = _colid.split("_");
        var ControlID = $scope.CurrentActiveField;
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

       
        scanner.scan(function (result) {


            var resultvalue = result.text;

            var _fieldType = $scope.GetCustomDataType($scope.CurrentActiveFieldDatatype);
            if (_fieldType != 4) {

                resultvalue = $scope.Validation(resultvalue, _fieldType) == true ? resultvalue : "";
            }

            if (resultvalue != "") {


                var _Arraytoupdate = [];
                var _Type = _colarray[0];
                if (_Type != null && _Type != undefined && _Type != "") {

                    if ($scope.CurrentActiveFieldDatatype != null && $scope.CurrentActiveFieldDatatype != undefined) {

                        if ($scope.CurrentActiveFieldDatatype == "date" || $scope.CurrentActiveFieldDatatype == "datetime") {
                            resultvalue = ConvertDatetoDate(resultvalue);
                        }

                    }
                    if (_Type == "CustomItem") {


                        for (var i = 0; i < $scope.InventoryObject.CustomPartData.length; i++) {

                            if ($scope.InventoryObject.CustomPartData[i].CfdID == _colarray[1]) {
                                $scope.InventoryObject.CustomPartData[i].Value = resultvalue;
                                break;

                            }

                        }
                    }
                    else if (_Type == "CustomActivity") {


                        for (var i = 0; i < $scope.InventoryObject.CustomTxnData.length; i++) {

                            if ($scope.InventoryObject.CustomTxnData[i].CfdID == _colarray[1]) {
                                $scope.InventoryObject.CustomTxnData[i].Value = resultvalue;
                                break;

                            }

                        }
                    }
                }



                $(_id).val(resultvalue);

                mySwiper.swipeNext();

                CheckScopeBeforeApply();


            }

            else {

                $scope.ShowScanError(_fieldType);
            }


            vibrate()



        }, function (error) {
            log.error("Scanning failed: ", error);
        });

    }
    function removePaddingCharacters(bytes) {
        bytes = bytes.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

        return bytes;
    }
    $scope.UploadImage = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        StreamData = StreamData.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "");

        if (StreamData != null && StreamData != "" && StreamData != undefined) {

            $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'UploadImage',
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'text json',

                  data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "FileName": FileName, "stream": StreamData }),
                  success: function (response) {
                      log.success("image success");


                      CheckScopeBeforeApply()
                  },
                  error: function (response) {
                      //  log.error("Into error");
                      console.log(response);

                  }
              });
        }
    }

    $scope.UpDownValue = function (value, IsUp) {
        if ($.trim($scope.InventoryObject.Quantity) == "") {

            $scope.InventoryObject.Quantity = 0;

        }

        switch (value) {
            case "Quantity":
                if (!IsUp) {
                    if ($scope.InventoryObject.Quantity > 0) {

                        $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity + (IsUp ? 1 : -1);
                    }
                }
                else if (IsUp) {
                    $scope.InventoryObject.Quantity = $scope.InventoryObject.Quantity + (IsUp ? 1 : -1);
                }
                break;
            default:

        }
    }


    $scope.movetoback = function () {


        bootbox.confirm("Are you sure to exit ?", function (result) {
            if (result) {

                $location.path('/mainmenu');

                CheckScopeBeforeApply()

            }
        });

    }




    var mySwiper;

    $scope.changeNav = function () {

        $("#myform .swiper-slide-active input:first").focus();
        $("#myform .swiper-slide-active input:first").not("input[type='checkbox']").trigger("click");
        $("#myform .swiper-slide-active input:first").not("input[type='checkbox']").trigger("keypress");
        SoftKeyboard.show();

    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.slidenumber = function (slidenumber) {



        switch (slidenumber) {
            case 0:
                $scope.scanfieldID = "pPartForm"
                break;
            case 1:
                $scope.scanfieldID = "pDescriptionForm"
                break;
            case 2:
                $scope.scanfieldID = "forquantity";
                break;
            case 3:
                $scope.scanfieldID = "Location"
                break;
            case 4:
                $scope.scanfieldID = "";
                break;
            case 5:

                $scope.scanfieldID = "";
            case 6:
                $scope.scanfieldID = "";
                break;
            case 7:
                $scope.scanfieldID = "";
                break;
            case 8:
                $scope.scanfieldID = "";
                break;

            case 9:
                $scope.scanfieldID = "laststep";
                break;
            default:
                $scope.scanfieldID = "";
                break;

        }

        CheckScopeBeforeApply()
    }


    $scope.getstep = function (currentstep, ColumnName) {


        if (ColumnName != "" && ColumnName != null) {
            $(".myCols").each(function () {

                if ($(this).attr("data-column") == ColumnName) {
                    mySwiper.swipeTo($(this).index(), 1000, false);

                    $scope.slide = $(this).index();
                    $scope.CurrentActiveField = ColumnName;
                    CheckScopeBeforeApply();
                    return false;
                }

            });
        }
        else {
            mySwiper.swipeTo(currentstep);

        }

    }





    $scope.$on('ngRepeatFinished', function () {




    });

    $scope.$on('ngRepeatFinished1', function () {




    });
    $scope.$on('ngRepeatFinished2', function () {




    });

    $scope.$on('ngRepeatFinished3', function () {


    });




    function AfterLoadedData() {
        $('.probeProbe').bootstrapSwitch('state', true);

        if (deviceType == 'iPhone') {
            $(".iosbtn").show()
            $(".androidbtn").hide()
        }
        else {
            $(".androidbtn").show()
            $(".iosbtn").hide()
        }

        $(".swiper-container").show();


        $(".spinner").hide();
        setTimeout(function () {

            mySwiper = new Swiper('.swiper-container', {
                initialSlide: 0,
                speed: 500,
                effect: 'flip',

                allowSwipeToPrev: false,


                onSlideChangeEnd: function (swiperHere) {


                    $scope.slide = swiperHere.activeIndex;

                    $scope.Totalslides = swiperHere.slides.length - 1;
                    var _colName = $(".swiper-slide-active").attr("data-column");
                    var _colType = $(".swiper-slide-active").attr("data-type");
                    _colid = $(".swiper-slide-active").attr("data-id");
                    $scope.CurrentActiveField = _colName != undefined && _colName != "" ? _colName : "";
                    $scope.CurrentActiveFieldDatatype = _colType;
                    var swiperPage = swiperHere.activeSlide();


                    $scope.slidenumber(swiperHere.activeIndex);


                    if (swiperHere.activeIndex != 3 && swiperHere.activeIndex != 6) {

                        $scope.changeNav();

                    }

                    else {

                        SoftKeyboard.hide();

                    }

                }

            });


            setTimeout(function () {
                var _TempcolName = $(".swiper-slide-active").attr("data-column");
                $scope.CurrentActiveField = _TempcolName != undefined && _TempcolName != "" ? _TempcolName : "";
                CheckScopeBeforeApply()
            }, 10)


            $scope.laststepindex = mySwiper.slides.length;
        }, 10)
    }

    function onConfirmInv(buttonIndex) {



        if (buttonIndex == 1 || buttonIndex == "1") {

            $location.path('/mainmenu');
            vibrate()
            CheckScopeBeforeApply();
        }
        else {

        }
    }


    function onConfirmmove(buttonIndex) {
        if (buttonIndex == 2 || buttonIndex == "2") {
            $location.path('/FindItems');
            vibrate()
            CheckScopeBeforeApply();
        }
        else if (buttonIndex == 1 || buttonIndex == "1") {
            //  $scope.getstep(0);
            window.location.reload();
            //$location.path('/inventory');
        }

    }


    function showConfirmInventory() {
        navigator.notification.confirm(
            'Are you sure you want to leave this page ?', // message
             onConfirmInv,            // callback to invoke with index of button pressed
            'Are you sure',           // title
            ['Yes', 'No']         // buttonLabels
        );
    }

    function movetolist() {
        navigator.notification.confirm(
            'Press yes to continue', // message
             onConfirmmove,            // callback to invoke with index of button pressed
            'Do you want to add more?',           // title
            ['Yes', 'No']         // buttonLabels
        );
    }


    $('.arrow-left').on('click', function (e) {
        e.preventDefault()

        if ($scope.slide == 0 || $scope.slide == 1000) {
            showConfirmInventory();

        }
        else {
            mySwiper.swipePrev();

        }



    })
    $('.arrow-right').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipeNext()

    })


    $scope.$watch("InventoryObject.AutoID", function () {
        if ($scope.InventoryObject.AutoID) {
            $scope.InventoryObject.ItemID = "Automated";
            $scope.InventoryObject.PID = 0;
        }
        else {
            $scope.InventoryObject.ItemID = "";
            $scope.InventoryObject.PID = 0;
        }
        CheckScopeBeforeApply()

    });


}]);


app.directive('selectpicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ctrl) {

            element.select2();


            var refreshSelect = function () {

                element.trigger('change');
            };


            scope.$watch(attrs.ngModel, refreshSelect);


        }
    };
});

app.directive('endRepeat', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished');
            }
        }
    }
}]);
app.directive('endRepeat1', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished1');
            }
        }
    }
}]);
app.directive('endRepeat2', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished2');
            }
        }
    }
}]);
app.directive('endRepeat3', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {

                scope.$emit('ngRepeatFinished3');
            }
        }
    }
}]);


app.directive('bootstrapSwitch', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    var _id = element[0].id;


                    element.bootstrapSwitch({
                        onText: _id == 'AutoID' ? 'Auto' : 'On',
                        offText: _id == 'AutoID' ? 'Manual' : 'Off'
                    });
                    element.on('switchChange.bootstrapSwitch', function (event, state) {
                        if (ngModel) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(state);
                            });
                        }
                    });

                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        if (newValue) {
                            element.bootstrapSwitch('state', true, true);
                        } else {
                            element.bootstrapSwitch('state', false, true);
                        }
                    });
                }
            };
        }
]);

