﻿'use strict';
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

    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";


    if (deviceType == 'iPhone') {
        $(".iosbtn").show()
        $(".androidbtn").hide()
    }
    else {
        $(".androidbtn").show()
        $(".iosbtn").hide()
    }


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
        if ($scope.InventoryObject.ItemID == "" || $scope.InventoryObject.Location == "" && $scope.InventoryObject.Uom == "") {
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
        $scope.GetActiveUnitDataField();
        $scope.getlocation();
        $scope.GetMyinventoryColumns();
        $scope.getuom();
        $scope.getitems();
        $scope.getstatus();
        $scope.GetCustomDataField(0);
        $scope.GetCustomDataField(1);
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
        },10)

    });

    $('.arrow-left').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipePrev()



    })
    $('.arrow-right').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipeNext()

    })



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