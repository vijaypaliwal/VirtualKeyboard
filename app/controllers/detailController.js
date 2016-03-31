'use strict';
app.controller('detailController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);
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

    init();



    function InitializeSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            //Your options here:
            initialSlide: 0,
            speed: 200,
            effect: 'flip',

            allowSwipeToPrev: false,


            onSlideChangeEnd: function (swiperHere) {


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

    }







    $scope.Scanitem = function () {



        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.CurrentInventory.pPart = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
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
        debugger;
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
                            log.success("Inventory updated successfully.");
                            localStorageService.set("CurrentDetailObject", $scope.CurrentInventory);
                            $scope.SavingData = false;
                        }
                        else {
                            log.error(Message);
                        }


                    },
                    error: function (err) {
                        debugger;
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

                   debugger;

                   $scope.ImageList = response.GetItemImagesResult.Payload;
                   $scope.$apply();

                   setTimeout(function () { InitializeSwiper() }, 10);



               },
               error: function (err) {

                   debugger;

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
        $scope.IsEditMode = !$scope.IsEditMode;
        setTimeout(function () { InitializeSwiper() }, 10);
    }

}]);