'use strict';
app.controller('inventoryController', ['$scope', '$location', 'authService', 'ordersService', 'localStorageService', 'log', '$compile', function ($scope, $location, authService, ordersService, localStorageService, log, $compile) {
    ''
    $scope.orders = [];
    $scope.InventoryItems = [];
    $scope.scannerText = "";
    $scope.SecurityToken = "";
    $scope.InventoryObject = { ItemName: "", Description: "", LocationText: "", UOMText: "", Location: "", UOM: "", Status: "", Quantity: 1, uniquetag: "", CostPerUnit: 0, CustomData: [] };
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
    $scope.UOMList = [{ UnitOfMeasureID: 1, UnitOfMeasureName: "box/es" },
               { UnitOfMeasureID: 2, UnitOfMeasureName: "carton/s" },
                { UnitOfMeasureID: 3, UnitOfMeasureName: "cup/s" },
               { UnitOfMeasureID: 4, UnitOfMeasureName: "dozen" },
               { UnitOfMeasureID: 5, UnitOfMeasureName: "ea." },
               { UnitOfMeasureID: 6, UnitOfMeasureName: "gallon/s" },
               { UnitOfMeasureID: 7, UnitOfMeasureName: "lbs." },
               { UnitOfMeasureID: 8, UnitOfMeasureName: "pc(s)" }];


    $scope.Quantity = "N/A";
    $scope.ItemName = "N/A";
    $scope.Description = "N/A";
    $scope.Location = "N/A";
    $scope.Status = "N/A";
    $scope.UOM = "N/A";


    $scope.logOut = function () {

        alert("Logout");
        authService.logOut();
        $location.path('/login');
        $scope.$apply();
    }

    $scope.authentication = authService.authentication.isAuth;




    $scope.afterlogout = function () {
        $location.path('/login');

        log.error("You are Logged Out (You can't Go back further)");

    }


    if ($scope.authentication == false) {
      $scope.afterlogout();
    }

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

                   //     $scope.InventoryObject.Location = 678030;

               }
           });

    }

    $scope.GetLastValue = function (field, id) {
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

                    $scope.Quantity = datavalue != null && datavalue != undefined && datavalue!=""?datavalue:"N/A";
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


    $scope.addinventory = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $('#addinventories').addClass("disabled");
        $('#addinventories').find(".fa").addClass("fa-spin");


        var _TempObj = $scope.InventoryObject;
        _TempObj.Images = $("#list123").find("img").attr("src");
        $.each(_TempObj, function (datakey, datavalue) {
            datakey = "Inv_" + datakey;
            localStorageService.set(datakey, "");
            localStorageService.set(datakey, datavalue);
        });
        for (var i = 0; i < $scope.LocationList.length; i++) {
            if ($scope.LocationList[i].LocationID == _TempObj.Location) {
                _TempObj.LocationText = $scope.LocationList[i].LocationName;
                break;

            }
        }

        for (var i = 0; i < $scope.UOMList.length; i++) {
            if ($scope.UOMList[i].UnitOfMeasureID == _TempObj.UOM) {
                _TempObj.UOMText = $scope.UOMList[i].UnitOfMeasureName;
                break;

            }
        }


        var _IsAdded = ordersService.AddInventory(_TempObj);

        if (_IsAdded) {
            log.success("Inventory item successfully added.");
            $location.path('/FindItems');

        }
        else {
            log.error("Error during add operation.");
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
               url: 'https://app.clearlyinventory.com/API/ClearlyInventoryAPI.svc/GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

                   log.error(err.Message);

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

                   log.error(err.Message);

               }
           });

    }

    $scope.OpenBox = function () {
        $("#files").trigger("click");
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

                debugger;

                var id = theFile.lastModified;


                var crossicon = '<a class="btn btn-danger removeImage" altid="'+id+'" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
                var compilehtml = $compile(crossicon)($scope);


              

                return function (e) {
                    // Render thumbnail.
                    var span = document.createElement('span');
                    span.innerHTML =
                    [
                      '<img id="' + id + '" style="height: 75px; width:75px; border: 1px solid #ccc; margin:10px; margin-top:0px;" src="',
                      e.target.result,
                      '" title="', escape(theFile.name),
                      '"/> ' + compilehtml[0].outerHTML+ ''
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
        },100);

       

    }

    


   


    function removeImage (_this) {



        $("#" + _this).each(function () {
            
            $(this).parent("span").remove();
        });

        


        removeImage(_this)

    }
  

    $scope.getlocation();
    $scope.getuom();
    $scope.getitems();

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
    $scope.GetUOMfromArray = function (UOMID)
    {
        if ($.trim(UOMID) != "") {

            for (var i = 0; i < $scope.UOMList.length; i++) {
                if ($scope.UOMList[i].UnitOfMeasureID == UOMID) {
                    return $scope.UOMList[i].UnitOfMeasureName;
                }

            }
        }
        return "";
    }

    $scope.ScanNew = function (ControlID) {

        var _id = "#" + ControlID;
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {


            if (ControlID == "pPartForm") {

                var resultvalue = result.text;

                if (resultvalue != "") {

                    $scope.InventoryObject.ItemName = resultvalue;
                    $(_id).val(resultvalue);
                 

                }

                else {
                    log.error("Item not found in list !!");
                }


            }
            else if (ControlID == "Location") {

                var resultvalue = $scope.GetLocaValuefromArray(result.text)

                if (resultvalue != "") {

                    $scope.InventoryObject.Location = resultvalue;
                    $(_id).val(resultvalue);
                   

                }

                else {
                    log.error("Location not found in list !!");
                }

            }
            else {
                $scope.InventoryObject.Description = resultvalue;

                $(_id).val(result.text);

            }

            mySwiper.swipeNext();

            $scope.$apply();



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

                debugger;
                $location.path('/mainmenu');

                $scope.$apply();

            }
        });

    }


    var mySwiper = new Swiper('.swiper-container', {

        initialSlide: 0,
        speed: 200,
        effect:'flip',
      

        onSlideChangeEnd: function (swiperHere) {

            var swiperPage = mySwiper.activeSlide()

            $scope.changeNav();

            console.log(swiperPage);
        }
    });


    $scope.changeNav = function () {

      //  $("#myform .swiper-slide input").removeAttr("autofocus");
           $("#myform .swiper-slide-active input:first").focus();
           $("#myform .swiper-slide-active input:first").trigger("click");

           SoftKeyboard.show();
    //    $scope.$apply();

    }


    $scope.getstep = function (currentstep) {

        mySwiper.swipeTo(currentstep);

    }


  

    $('.arrow-left').on('click', function (e) {

        e.preventDefault()
        mySwiper.swipePrev()



    })
    $('.arrow-right').on('click', function (e) {
        debugger;

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