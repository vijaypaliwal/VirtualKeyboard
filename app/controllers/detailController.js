'use strict';
app.controller('detailController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.CanAddIntoCart = false;

    $scope.mainObjectToSend = [];
    

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');
        }
        else {
            $("#myModal2").modal('show');
        }
    }

    $scope.CancelEdit = function () {
        $scope.IsEditMode = false;

        $scope.$apply();

    }

    $scope.viewhistory = function () {
        $location.path('/InventoryHistory');

        $scope.$apply();

    }

    $scope.showinventory = function () {
        $location.path('/FindItems');

        $scope.$apply();

    }


    init();


    function InitializeSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            speed: 200,
            effect: 'flip',

            allowSwipeToPrev: false,


            onSlideChangeEnd: function (swiperHere) {


                $scope.slide = swiperHere.activeIndex;

                $scope.Totalslides = swiperHere.slides.length;


                $scope.$apply();
            }


        });

        $('.arrow-left').on('click', function (e) {
            e.preventDefault()
            mySwiper.swipePrev();

        })
        $('.arrow-right').on('click', function (e) {
            e.preventDefault()
            mySwiper.swipeNext()

        })
        $scope.Totalslides = mySwiper.slides.length;
        $scope.$apply();

    }


    $scope.showbottomarea = function () {

        $("#overlay").addClass("overlay")


        $(".scaninfo").show();
        $(".scaninfo").css("display", "block");

    }


    $scope.GetUnitDataLabel = function (ColumnName) {
        var i = 0;

        ColumnName = ColumnName.substr(1);
        for (i = 0; i < $scope.MyinventoryFieldsNames.length; i++) {
            if ($scope.MyinventoryFieldsNames[i].ColumnName == ColumnName) {
                return $scope.MyinventoryFieldsNames[i].ColumnLabel;
            }
        }

        return "";
    }


    $scope.Scanitem = function () {

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.itemscanvalue = result.text;

            $scope.$apply();

         

        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.Takeitem = function () {

        $scope.CurrentInventory.pPart = $scope.itemscanvalue;

        $("#overlay").removeClass("overlay");
        $("#scaninfo").hide();
        $scope.$apply();

    }

    $scope.closebottoarea = function () {

        $("#overlay").removeClass("overlay");
        $("#scaninfo").hide();
        $scope.Scanitem();

    }






    $scope.Scandescription = function () {

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.CurrentInventory.pDescription = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }
    $scope.UpdateCartItems = function () {
        var v = angular.copy($scope.CurrentInventory);
        var mainObjectToSend = {
            uId: v.iID,
            pID: v.pID,
            pPart: v.pPart,
            iLID: v.iLID,
            iUOMID: v.iUOMID,
            iQty: 1,
            oquantity: v.iQty,
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
        }
        var _cartData = localStorageService.get("ActivityCart");
        for (var i = 0; i < _cartData.length; i++) {
            if (_cartData[i].InventoryID == $scope.CurrentInventory.iID) {
                _cartData[i].InventoryDataList = mainObjectToSend;
                _cartData[i].ItemID = mainObjectToSend.pPart;
                break;
            }
        }

        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _cartData);
    }
    $scope.UpdateInventory = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                $scope.SavingData = true;
                $scope.$apply();

                var _data = { "IID": $scope.CurrentInventory.iID, "pID": $scope.CurrentInventory.pID, "pPart": $scope.CurrentInventory.pPart, "pDescription": $scope.CurrentInventory.pDescription };
                $.ajax({
                    url: serviceBase + "UpdateInventory",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        if (result.UpdateInventoryResult.Success == true) {

                            if (result.UpdateInventoryResult.Payload == 1) {
                                //log.success("Inventory updated successfully.");
                                ShowSuccess("Updated");
                                $scope.IsEditMode = false;

                                $scope.$apply();
                                localStorageService.set("CurrentDetailObject", $scope.CurrentInventory);
                                $scope.SavingData = false;
                                init();
                                $scope.getitemimage();
                                $scope.UpdateCartItems();
                            }
                            else {
                                log.error(Message);
                            }

                        }
                        else {

                            $scope.ShowErrorMessage("Update Inventory Detail", 3, 1, result.GetInventoriesResult.Message);
                        }

                    },
                    error: function (err) {

                        $scope.SavingData = false;
                   
                        $scope.ShowErrorMessage("Update Inventory Detail", 1, 2, err.statusText);

                    },
                    complete: function () {
                    }
                });
            }



        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("This operation is going to change your item details. ");

        });

    }



   


    $scope.addtocart = function (v) {


        var _cartData = localStorageService.get("ActivityCart");
        if (_cartData == null || _cartData == undefined) {
            _cartData = [];
        }
        var mainObjectToSend = {
            uId: v.iID,
            pID: v.pID,
            pPart: v.pPart,
            iLID: v.iLID,
            iUOMID: v.iUOMID,
            iQty: 1,
            oquantity: v.iQty,
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
        }

        _cartData.push({
            InventoryID: mainObjectToSend.uId,
            IsLineItemData: [],
            iCostPerItem: mainObjectToSend.iCostPerUnit,
            ItemID: mainObjectToSend.pPart,
            ActionPerformed: $scope.selectedAction,
            AdjustActionQuantity: "",
            AdjustCalculation: "",
            InventoryDataList: mainObjectToSend,
            IncreaseDecreaseVMData: ({ ActionQuantity: "" }),
            MoveTransactionData: ({ ActionQuantity: "", StatusToUpdate: mainObjectToSend.iStatusValue, MoveToLocationText: "", MoveToLocation: "" }),
            UpdateTransactionData: ({ ActionQuantity: "", StatusToUpdate: mainObjectToSend.iStatusValue }),
            ApplyTransactionData: ({ ActionQuantity: "", UnitTag1: mainObjectToSend.iReqValue, UnitTag2: mainObjectToSend.iUnitTag2, UnitTag3: mainObjectToSend.iUnitTag3, UniqueDate: mainObjectToSend.iUniqueDate_date, UnitDate2: mainObjectToSend.iUnitDate2_date, UnitNumber1: mainObjectToSend.iUnitNumber1, UnitNumber2: mainObjectToSend.iUnitNumber2 }),
            ConvertTransactionData: ({ ActionFromQuantity: "", ActionToQuantity: "", ToUOMID: 0 }),
        });

        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _cartData);
        ShowSuccess('Added');

        setTimeout(function () { $("#myModal2").modal('hide'); }, 1000);

        CheckIntoCartData();

    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    function CheckIntoCartData ()
    {
        $scope.CanAddIntoCart = false;
       
        var _CartData = localStorageService.get("ActivityCart");
        if (_CartData != null && _CartData != undefined) {

            for (var i = 0; i < _CartData.length; i++) {
                if(_CartData[i].InventoryID== $scope.CurrentInventory.iID)
                {
                    $scope.CanAddIntoCart = true;
                }
            }
        }
        CheckScopeBeforeApply();

        
    }

    $scope.removecart=function()
    {
        var _cartData = localStorageService.get("ActivityCart");
        var _newCart = _cartData;
        for (var i = 0; i < _newCart.length; i++) {
            if (_cartData[i].InventoryID == $scope.CurrentInventory.iID)
            {
                _cartData.splice(i, 1);
                break;
            }
        }

        localStorageService.set("ActivityCart", "");
        localStorageService.set("ActivityCart", _cartData);
      
        ShowSuccess('Removed');

        setTimeout(function () { $("#myModal2").modal('hide'); }, 1000);

        CheckIntoCartData();

    }

    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");

        $scope.MyinventoryFieldsNames = localStorageService.get("unitdatafieldsobject");


        $scope.itemlabel = $scope.CurrentInventory.pPart
        CheckIntoCartData();
        CheckScopeBeforeApply();
    }

    $scope.getitemimage = function () {




        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetItemImages',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ItemID": $scope.CurrentInventory.pID }),
               contentType: 'application/json',
               dataType: 'json',
               success: function (response) {


                   if (response.GetItemImagesResult.Success == true) {
                   
                   $scope.ImageList = response.GetItemImagesResult.Payload;
                   $scope.$apply();

                   setTimeout(function () { InitializeSwiper() }, 10);


                   setTimeout(function () {
                       $(".loadingimage").hide();
                       $(".imagesection").show();

                   }, 1000);
                   }
                   else {
                       $scope.ShowErrorMessage("Item Images", 1, 1, response.GetItemImagesResult.Message)
                   }
               },
               error: function (err) {

                   $scope.ShowErrorMessage("Item Images", 2, 1, err.statusText);


               }
           });

    }

    $scope.getitemimage();

    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });


    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }


    $scope.OpenImageModal = function (Object) {
        $("#imagemodal").modal('show');
        $scope.CurrentActiveImage = Object;
        $scope.$apply();
    }
    $scope.ToggleEditView = function () {


        $("#myModal2").modal('hide');
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");



        $scope.IsEditMode = !$scope.IsEditMode;
        setTimeout(function () { InitializeSwiper() }, 10);

        setTimeout(function () {
            $(".loadingimage").hide();
            $(".imagesection").show();
        }, 300);
    }

}]);