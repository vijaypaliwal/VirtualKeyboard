'use strict';
app.controller('detailController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
  

    $scope.mainObjectToSend = [];
    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);
        $scope.itemlabel = $scope.CurrentInventory.pPart
     
        $scope.$apply();
    }

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



    $scope.Scanitem = function () {

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.itemscanvalue = result.text;

            $scope.$apply();

            setTimeout(function () {
                $scope.showbottomarea();
              
            }, 10);
         
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

    $scope.UpdateInventory = function () {
         
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                $scope.SavingData = true;
                var _data = { "IID": $scope.CurrentInventory.iID, "pID": $scope.CurrentInventory.pID, "pPart": $scope.CurrentInventory.pPart, "pDescription": $scope.CurrentInventory.pDescription };
                $.ajax({
                    url: serviceBase + "UpdateInventory",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {
                        if (result.UpdateInventoryResult.Payload == 1) {
                            //log.success("Inventory updated successfully.");
                            ShowSuccess("Updated");
                            $scope.IsEditMode = false;

                            $scope.$apply();
                            localStorageService.set("CurrentDetailObject", $scope.CurrentInventory);
                            $scope.SavingData = false;
                            init();
                          $scope.getitemimage();
                        }
                        else {
                            log.error(Message);
                        }

                    },
                    error: function (err) {
                         
                        $scope.SavingData = false;
                        console.log(err);
                        log.error("Error Occurred during operation");


                    },
                    complete: function () {
                    }
                });
            }

            else {

            }

        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("This operation is going to change your item name and item description. ");

        });

    }


 

    $scope.addtocart = function (v) {
         

        var _cartData = localStorageService.get("ActivityCart");
        if (_cartData == null || _cartData == undefined)
        {
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

                

                   $scope.ImageList = response.GetItemImagesResult.Payload;
                   $scope.$apply();

                   setTimeout(function () { InitializeSwiper() }, 10);


                   setTimeout(function () {
                       $(".loadingimage").hide();
                       $(".imagesection").show();
                       
                   }, 1000);

               },
               error: function (err) {

                    

                   log.error(err.Message);

               }
           });

    }

    $scope.getitemimage();


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