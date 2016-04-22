'use strict';
app.controller('InventoryHistoryController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.Recentactivities = [];
    $scope.mainObjectToSend = [];
    $scope.ActivityDate = "";
    $scope.Activity = "";
    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);
        $scope.GetRecentActivities();
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

    $scope.Undo = function (TransID, InvID, ParentID) {

    }

    Date.prototype.toMSJSON = function () {
        var date = '/Date(' + this.getTime() + '+05:00)/'; //CHANGED LINE
        return date;
    };
    $scope.GetRecentActivities = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        debugger;
        var _datestring = ""
        var _updateDateval = $scope.ActivityDate;


        if (_updateDateval != "" && _updateDateval != undefined) {

            var dsplit1 = _updateDateval.indexOf("/") > -1 ? _updateDateval.split("/") : _updateDateval.split("-");
            var d122 = new Date(dsplit1[0], dsplit1[1] - 1, dsplit1[2]);

            var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), d122.getHours(), d122.getMinutes(), d122.getSeconds(), d122.getMilliseconds()))

            _datestring = d122.toMSJSON();
        }

        else {

            var d122 = new Date(1970, 1, 1);

            var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), d122.getHours(), d122.getMinutes(), d122.getSeconds(), d122.getMilliseconds()))

            _datestring = d122.toMSJSON();
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetRecentActivity',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "id": $scope.CurrentInventory.pID, "ActivityDate": _datestring, "Activity": $scope.Activity }),
               success: function (response) {
                   debugger;
                   console.log(response);
                   $scope.Recentactivities = response.GetRecentActivityResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {
                   debugger;
                   log.error(err.Message);

               }
           });
    }

    $scope.CancelEdit = function () {
        $scope.IsEditMode = false;

        $scope.$apply();

    }

    init();

    $scope.$watch('Activity', function () {
        $scope.GetRecentActivities();
    });

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


}]);