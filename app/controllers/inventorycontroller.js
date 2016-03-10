'use strict';
app.controller('inventoryController', ['$scope', '$location', 'authService', 'ordersService', 'localStorageService', 'log', '$compile', function ($scope, $location, authService, ordersService, localStorageService, log, $compile) {
    ''
    $scope.orders = [];
    $scope.MyinventoryFields = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.StatusList = [];
    $scope.InventoryObject = {
        IsFullPermission: true, AutoID: false, PID: 0, ItemID: "", Description: "", Quantity: 0, Uom: "", UomID: 0, Location: "", lZone: "", LocationID: 0, UniqueTag: "", Cost: 0,
        UpdateDate: "/Date(1320825600000-0800)/", Status: "", ItemGroup: "", UniqueDate: "/Date(1320825600000-0800)/", UnitDate2: "/Date(1320825600000-0800)/", UnitNumber1: 0, UnitNumber2: 0, UnitTag2: "",
        UnitTag3: "", CustomPartData: [], CustomTxnData: []
    };



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
        $scope.$apply();
    }

    $scope.authentication = authService.authentication.isAuth;

    $scope.SearchItemValue = "";
    $scope.ItemSearching = "";
    $scope.SearchList = [];

    $scope.SearchLocationValue = "";
    $scope.LocationSearching = "";
    $scope.LocationSearchList = [];

    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";


    if (deviceType == 'iPhone') {
        $(".iosbtn").show()
        $(".androidbtn").hide()
    }
    else {
        $(".androidbtn").show()
        $(".iosbtn").hide()
    }

    $('#switch-change').on('switchChange', function (e, data) {



    });


    $scope.afterlogout = function () {
        $location.path('/login');

        log.error("You are Logged Out (You can't Go back further)");

    }


    if ($scope.authentication == false) {
        //  $scope.afterlogout();
    }




    $scope.GetLastValueCustom = function (id, Type) {

        debugger;

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
    $scope.GetLastValue = function (field, id) {

        debugger;


        var _value = "";
        var _toCheckValue = localStorageService.get(field);
        if (_toCheckValue != null && _toCheckValue != undefined) {
            _value = _toCheckValue;

            if (id == "#UOM") {
                $scope.InventoryObject.UOM = _value;


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




    $scope.SetItemData = function (obj) {

        $scope.InventoryObject.ItemID = obj.ItemID;

        $scope.InventoryObject.Description = obj.ItemDescription;

        $scope.InventoryObject.Location = obj.DefaultLocation;

        $scope.InventoryObject.LocationID = obj.DefaultLocationID;

        $scope.InventoryObject.UomID = obj.DefaultUomID;
        $scope.InventoryObject.Uom = obj.DefaultUom;

        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $scope.$apply();
    }


    $scope.LocationSetItemData = function (obj) {

        debugger;

        $scope.InventoryObject.Location = obj.LocationName;

        $scope.InventoryObject.LocationID = obj.LocationID;

        $("#itemlistmodal").modal('hide');

        $("#locationlistmodal").modal('hide');
        $scope.$apply();
    }



    $scope.OnChangeItemNameFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

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
                debugger;
                if (data.SearchItemsResult != null && data.SearchItemsResult.Payload != null) {
                    $scope.ItemSearching = false;
                    $scope.SearchList = data.SearchItemsResult.Payload;
                    $scope.$apply();
                    //try {

                    //    response($.map(data.SearchItemsResult.Payload, function (item) {
                    //        return {
                    //            label: item.ItemID,         // tblPart.pPart : tblPart.pDescription
                    //            value: item.ItemID,         // tblPart.pPart : tblPart.pDescription
                    //            part: item.ItemID,             // tblPart.pPart
                    //            name: item.ItemID,    // tblPart.pDescription
                    //            id: item.pID,                  // tblPart.pID
                    //            uom: item.DefaultUom,          // tblUom.uomUOM
                    //            uomid: item.DefaultUomID,      // tblUom.uomID
                    //            loc: item.DefaultLocation,     // tblLocation.lLoc
                    //            locid: item.DefaultLocationID, // tblLocation.lID
                    //            cost: item.DefaultCost,        // tblPart.pDefaultCost
                    //            itemgroup: item.ItemGroup,        // tblPart.cCountFrq
                    //            locgroup: item.DefaultLocationGroup
                    //        };
                    //    }));
                    //} catch (_ex) {

                    //}
                }
            }
        });
    }




    $scope.OnChangeLocationNameFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

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
                    $scope.$apply();

                }
            }
        });
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

    }
    $scope.CheckRequiredField = function () {
        if ( $scope.InventoryObject.ItemID == "" || $scope.InventoryObject.Location == "" && $scope.InventoryObject.Uom == "") {
            return true;
        }

        for (var i = 0; i < $scope.InventoryObject.CustomPartData.length; i++) {

            if ($scope.IsRequired($scope.InventoryObject.CustomPartData[i].cfdID) && $scope.InventoryObject.CustomPartData[i].Value == "") {
                return false;
            }

        }

        for (var i = 0; i < $scope.InventoryObject.CustomTxnData.length; i++) {
            if ($scope.IsRequired($scope.InventoryObject.CustomTxnData[i].cfdID) && $scope.InventoryObject.CustomTxnData[i].Value == "") {
                return false;
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
    }

    $scope.addinventory = function () {
        debugger;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $('#addinventories').addClass("disabled");
        $('#addinventories').find(".fa").addClass("fa-spin");


        var _TempObj = $scope.InventoryObject;

        // $scope.InventoryObject.Location = $scope.InventoryObject.Location.length > 0 ? $scope.InventoryObject.Location[0] : ""
        var ImageData = $("#list123").find("img").attr("src");
        $.each(_TempObj, function (datakey, datavalue) {

            if (datakey != "CustomPartData" && datakey != "CustomPartData") {

                datakey = "Inv_" + datakey;
                localStorageService.set(datakey, "");
                localStorageService.set(datakey, datavalue);
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

        ordersService.AddInventory(_TempObj, ImageData);
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'AddInventoryData',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Data": $scope.InventoryObject }),
              success: function (response) {
                  debugger;
                  log.success("Inventory item added successfully.");
                  $scope.getstep(0);
                  $scope.resetObject();
                  $scope.$apply();
                  $location.path("/FindItems");
                  $('#addinventories').removeClass("disabled");
                  $('#addinventories').find(".fa").removeClass("fa-spin");
              },
              error: function (err) {
                  debugger;

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


    // function applyAutoComplete() {

    //     var authData = localStorageService.get('authorizationData');
    //     if (authData) {
    //         $scope.SecurityToken = authData.token;
    //     }





    //     $('#ItemName').typeahead({
    //         source: function (request, response) {
    //             $.ajax({

    //                 type: "POST",
    //                 url: serviceBase + "SearchItems",
    //                 contentType: 'application/json; charset=utf-8',

    //                 dataType: 'json',

    //                 data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $('#ItemName').val() }),
    //                 error: function () {
    //                     log.error('There is a problem with the service!');
    //                 },

    //                 success: function (data) {
    //                     if (data.SearchItemsResult != null && data.SearchItemsResult.Payload != null) {

    //                         debugger;
    //                         try {

    //                             response($.map(data.SearchItemsResult.Payload, function (item) {
    //                                 return {
    //                                     label: item.ItemID,         // tblPart.pPart : tblPart.pDescription
    //                                     value: item.ItemID,         // tblPart.pPart : tblPart.pDescription
    //                                     part: item.ItemID,             // tblPart.pPart
    //                                     name: item.ItemID,    // tblPart.pDescription
    //                                     id: item.pID,                  // tblPart.pID
    //                                     uom: item.DefaultUom,          // tblUom.uomUOM
    //                                     uomid: item.DefaultUomID,      // tblUom.uomID
    //                                     loc: item.DefaultLocation,     // tblLocation.lLoc
    //                                     locid: item.DefaultLocationID, // tblLocation.lID
    //                                     cost: item.DefaultCost,        // tblPart.pDefaultCost
    //                                     itemgroup: item.ItemGroup,        // tblPart.cCountFrq
    //                                     locgroup: item.DefaultLocationGroup
    //                                 };
    //                             }));
    //                         } catch (_ex) {

    //                         }
    //                     }
    //                 }
    //             });
    //         },
    //         updater: function (item) {
    //             return item.name;
    //         }

    //     });




    //     //$('#Location').typeahead({
    //     //    source: function (request, response) {
    //     //        $.ajax({

    //     //            type: "POST",
    //     //            url: serviceBase + "SearchLocationAutoComplete",
    //     //            contentType: 'application/json; charset=utf-8',

    //     //            dataType: 'json',

    //     //            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $('#Location').val() }),

    //     //            success: function (data) {
    //     //                if (data.SearchLocationAutoCompleteResult != null && data.SearchLocationAutoCompleteResult.Payload != null) {

    //     //                    debugger;

    //     //                    try {

    //     //                        response($.map(data.SearchLocationAutoCompleteResult.Payload, function (item) {
    //     //                            return {
    //     //                                name: item.LocationName,  // tblLocation.lLoc
    //     //                                value: item.LocationName,     // tblLocation.lID
    //     //                          //locgroup: item.LocationGroupName  // tblLocation.lZone
    //     //                            };
    //     //                        }));
    //     //                    } catch (_ex) {

    //     //                        debugger;

    //     //                    }
    //     //                }
    //     //            },


    //     //            error: function (err) {

    //     //                debugger;


    //     //                log.error('There is a problem with the service!');
    //     //            },
    //     //        });
    //     //    }

    //     //});
    ////     var $select2Elm1 = $('#ItemName');



    ////     $select2Elm1.select2({
    ////         minimumInputLength: 1,
    ////         multiple: true,
    ////         maximumSelectionSize: 1,
    ////         selectOnBlur:true,

    ////         ajax: {
    ////             type: "POST",
    ////             url: serviceBase + "SearchItems",
    ////             contentType: 'application/json; charset=utf-8',

    ////             dataType: 'json',
    ////             data: function (term) {
    ////                 return JSON.stringify({
    ////                     SecurityToken: $scope.SecurityToken,
    ////                     SearchValue: term.term
    ////                 }

    ////                 );
    ////             },

    ////             processResults: function (data, page) {
    ////                 debugger;
    ////                 if (data.SearchItemsResult != null && data.SearchItemsResult.Payload != null) {

    ////                     return {
    ////                         results: $.map(data.SearchItemsResult.Payload, function (item) {
    ////                             return {
    ////                                 text: item.ItemID,
    ////                                 id: item.ItemID
    ////                             }
    ////                         })
    ////                     };
    ////                 }
    ////             },


    ////         }

    ////     }).on("change", function (e) {
    ////         console.log(e);

    ////         var select21 = $select2Elm1.data('select2'),
    ////// get the select2 input tag
    ////$select2Input1 = $('.select2-input', select21.searchContainer),
    ////// get the useless tag
    ////$tagToRemove1 = $('li', select21.selection).eq(0),
    ////newValue1 = $.trim($tagToRemove1.text());

    ////         // append the value chosen into the select2 text input
    ////         $select2Input1.val(newValue1);
    ////         $select2Input1.trigger('keyup');
    ////         // set the new value to the original text field
    ////         $select2Elm1.val(newValue1);
    ////         // remove the useless tag
    ////         $tagToRemove1.remove();

    ////     });





    //     var $select2Elm = $('#Location');

    //     $select2Elm.select2({
    //         minimumInputLength: 1,
    //         multiple: true,
    //         maximumSelectionSize: 1,


    //         ajax: {
    //             type: "POST",
    //             url: serviceBase + "SearchLocationAutoComplete",
    //             contentType: 'application/json; charset=utf-8',

    //             dataType: 'json',
    //             data: function (term) {
    //                 return JSON.stringify({
    //                     SecurityToken: $scope.SecurityToken,
    //                     SearchValue: term.term
    //                 }

    //                 );
    //             },

    //             processResults: function (data, page) {
    //                 if (data.SearchLocationAutoCompleteResult != null && data.SearchLocationAutoCompleteResult.Payload != null) {
    //                     return {
    //                         results: $.map(data.SearchLocationAutoCompleteResult.Payload, function (item) {
    //                             return {
    //                                 text: item.LocationName,
    //                                 id: item.LocationName
    //                             }
    //                         })
    //                     };
    //                 }
    //             },


    //         }

    //     }).on("change", function (e) {
    //         console.log(e);

    //         var select2 = $select2Elm.data('select2'),
    //// get the select2 input tag
    //$select2Input = $('.select2-input', select2.searchContainer),
    //// get the useless tag
    //$tagToRemove = $('li', select2.selection).eq(0),
    //newValue = $.trim($tagToRemove.text());

    //         // append the value chosen into the select2 text input
    //         $select2Input.val(newValue);
    //         $select2Input.trigger('keyup');
    //         // set the new value to the original text field
    //         $select2Elm.val(newValue);
    //         // remove the useless tag
    //         $tagToRemove.remove();

    //     });



    // }


    $scope.itemlist = function () {

        $("#locationlistmodal").modal('hide');

        $("#itemlistmodal").modal('show');

        $scope.SearchList = [];
        $scope.SearchItemValue = "";
    }

    $scope.locationlist = function () {

        $("#itemlistmodal").modal('hide');
        $("#locationlistmodal").modal('show');

        $scope.LocationSearchList = [];
        $scope.SearchLocationValue = "";
    }




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
                  debugger;
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
                  $scope.$apply();
                  // Custom Item Field 

                  $scope.CustomItemDataList = response.GetAllDataResult.Payload[0].CustomItemField;
                  $scope.$apply();
                  for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
                      $scope.InventoryObject.CustomPartData.push({ CfdID: $scope.CustomItemDataList[i].cfdID, Value: $scope.CustomItemDataList[i].cfdDefaultValue, DataType: $scope.CustomItemDataList[i].cfdDataType });
                  }
                  $scope.$apply();
                  // Custom Activity Field 

                  $scope.CustomActivityDataList = response.GetAllDataResult.Payload[0].CustomActivityField;
                  $scope.$apply();

                  for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
                      $scope.InventoryObject.CustomTxnData.push({ CfdID: $scope.CustomActivityDataList[i].cfdID, Value: $scope.CustomActivityDataList[i].cfdDefaultValue, DataType: $scope.CustomActivityDataList[i].cfdDataType });
                  }
                  $scope.$apply();
                  // Unit Of Measure
                  $scope.UOMList = response.GetAllDataResult.Payload[0].UnitOfMeasure;
                  $scope.$apply();
                  // Status
                  $scope.StatusList = response.GetAllDataResult.Payload[0].Status;
                  $scope.$apply();
                  console.log("all Data in one call");
                  console.log(_TempArray);
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
                  debugger;
                  var _TempArray = response.GetMyInventoryColumnsResult.Payload;

                  for (var i = 0; i < _TempArray.length; i++) {
                      var _ColName = _TempArray[i].ColumnName.split("#");
                      _TempArray[i].ColumnName = _ColName[0];
                      if (_TempArray[i].Show == "True") {
                          $scope.MyinventoryFields.push(_TempArray[i]);
                      }
                  }
                  $scope.$apply();

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
                   debugger;
                   $scope.StatusList = response.GetStatusResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

                   log.error(err.Message);

               }
           });

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
                   debugger;
                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
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

                   debugger;

                   $scope.LocationList = response.GetLocationsResult.Payload;
                   $scope.$apply();
               },
               error: function (response) {

                   debugger;
                   console.log(response);

                   //$scope.InventoryObject.Location = 678030;

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
                   $scope.$apply();
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
                   $scope.$apply();
               },
               error: function (response) {



               }
           });
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
                   debugger;
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


                       $scope.$apply();


                   }

                   $scope.$apply();
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


                var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
                var compilehtml = $compile(crossicon)($scope);




                return function (e) {
                    // Render thumbnail.
                    var span = document.createElement('span');
                    span.innerHTML =
                    [
                      '<img id="' + id + '" style="height: 75px; width:75px; border: 1px solid #ccc; margin:10px; margin-top:0px;" src="',
                      e.target.result,
                      '" title="', escape(theFile.name),
                      '"/> ' + compilehtml[0].outerHTML + ''
                    ].join('');

                    document.getElementById('list123').insertBefore(span, null);

                    var imagepath = '<span><img  id="' + id + '" style="height: 60px; width:60px; border: 1px solid #ccc; margin:0px; margin-top:0px; position:absolute;" src="' + e.target.result + '"></span>'


                    $("#list321").append(imagepath);

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }

        setTimeout(function () {
            $(".removeImage").bind("click", function () {

                removeImage($(this).attr("altid"));
            });
        }, 100);



    }




    function removeImage(_this) {



        $("#" + _this).each(function () {

            $(this).parent("span").remove();
        });




        removeImage(_this)

    }

    function init() {
        $scope.GetAllData();

        //$scope.GetMyinventoryColumns();
        //$scope.GetCustomDataField(0);
        //$scope.GetActiveUnitDataField();
        //$scope.GetCustomDataField(1);
        //$scope.getuom();
        //$scope.getstatus();
        //   $scope.getlocation();

        // $scope.getitems();

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


    //#region select2 options





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


    $scope.ScanNew = function () {

        var _id = "#" + $scope.scanfieldID;

        var ControlID = $scope.scanfieldID;
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {


            if (ControlID == "pPartForm") {

                var resultvalue = result.text;

                if (resultvalue != "") {

                    $scope.InventoryObject.ItemID = resultvalue;
                    $(_id).val(resultvalue);

                    mySwiper.swipeNext();

                    $scope.$apply();


                }

                else {
                    //log.error("Item not found in list !!");
                }


            }
            else if (ControlID == "Location") {

                var resultvalue = $scope.GetLocaValuefromArray(result.text)

                if (resultvalue != "") {

                    $scope.InventoryObject.Location = resultvalue;
                    $(_id).val(resultvalue);
                    mySwiper.swipeNext();

                    $scope.$apply();


                }

                else {
                    //log.error("Location not found in list !!");
                }

            }
            else {
                $scope.InventoryObject.Description = resultvalue;

                var resultvalue = result.text;

                if (resultvalue != "") {

                    $scope.InventoryObject.Description = result.text;

                    $(_id).val(result.text);
                    mySwiper.swipeNext();

                    $scope.$apply();


                }

                else {
                    //log.error("Item not found in list !!");
                }

            }





        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }


    $scope.UpDownValue = function (value, IsUp) {
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

                $scope.$apply();

            }
        });

    }




    var mySwiper;

    $scope.changeNav = function () {

        //  $("#myform .swiper-slide input").removeAttr("autofocus");
        $("#myform .swiper-slide-active input:first").focus();
        $("#myform .swiper-slide-active input:first").trigger("click");
        $("#myform .swiper-slide-active input:first").trigger("keypress");
        SoftKeyboard.show();
        //    $scope.$apply();

    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.slidenumber = function (slidenumber) {

        debugger;

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

        $scope.$apply();
    }


    $scope.getstep = function (currentstep) {



        mySwiper.swipeTo(currentstep);

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
        //   applyAutoComplete();
        setTimeout(function () {

            mySwiper = new Swiper('.swiper-container', {
                //Your options here:
                initialSlide: 0,
                speed: 500,
                effect: 'flip',

                allowSwipeToPrev: false,


                onSlideChangeEnd: function (swiperHere) {


                    $scope.slide = swiperHere.activeIndex;



                    var swiperPage = swiperHere.activeSlide()

                    $scope.slidenumber(swiperHere.activeIndex);


                    if (swiperHere.activeIndex != 3 && swiperHere.activeIndex != 6) {

                        $scope.changeNav();

                    }

                    else {

                        SoftKeyboard.hide();

                    }

                }


            });

            debugger;

            $scope.laststepindex = mySwiper.slides.length;
        }, 10)
    }


    $('.arrow-left').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipePrev()



    })
    $('.arrow-right').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipeNext()

    })


    $scope.$watch("InventoryObject.AutoID", function () {
        console.log($scope.InventoryObject.AutoID)
        if($scope.InventoryObject.AutoID)
        {
            $scope.InventoryObject.ItemID = "Automated";
        }
        else {
            $scope.InventoryObject.ItemID = "";
        }
        $scope.$apply();

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
                    element.bootstrapSwitch();

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

