'use strict';
app.controller('InventoryHistoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.Recentactivities = [];
    $scope.mainObjectToSend = [];
    $scope.ActivityDate = "";
    $scope.Activity = "";
    $scope.isSearching = false;
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

  

    Date.prototype.toMSJSON = function () {
        var offset = new Date().getTimezoneOffset();

        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };
    $scope.GetRecentActivities = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.isSearching = true;
         
        var _datestring = ""
        var _updateDateval = $scope.ActivityDate;


        if (_updateDateval != "" && _updateDateval != undefined) {

            var dsplit1 = _updateDateval.indexOf("/") > -1 ? _updateDateval.split("/") : _updateDateval.split("-");
            var d122 = new Date(dsplit1[0], dsplit1[1] - 1, dsplit1[2]);


            d122.setDate(d122.getDate() + 1);
            _datestring = d122.toMSJSON();
        }

        else {

            var d122 = new Date(1970, 1, 1);


            _datestring = d122.toMSJSON();
        }


        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetRecentActivity',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "id": $scope.CurrentInventory.iID, "ActivityDate": _datestring, "Activity": $scope.Activity }),
               success: function (response) {
                   $scope.isSearching = false;
                   debugger;
                   var _ActualCount = parseInt(response.GetRecentActivityResult.Payload.ActualCount);

                   $scope.Recentactivities = response.GetRecentActivityResult.Payload.data;
                   $scope.$apply();
                   if (_ActualCount==0)
                   {
                       $location.path("/FindItems");
                       $scope.$apply();
                   }
                   if ($scope.Recentactivities.length == 0 && ((_updateDateval == "" || _updateDateval == undefined) && $scope.Activity == "")) {
                       $location.path("/FindItems");
                       $scope.$apply();
                   }
               },
               error: function (err) {
                    
                   $scope.isSearching = false;
                   log.error(err.Message);

               }
           });
    }
    $scope.Undo = function (TransID, InvID, ParentID) {


        var box = bootbox.confirm("Are you sure you want to Undo this activity?", function (result) {
            if (result) {

                 
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    $scope.SecurityToken = authData.token;
                }



                $.ajax
                   ({
                       type: "POST",
                       url: serviceBase + 'UndoActivity',
                       contentType: 'application/json; charset=utf-8',
                       dataType: 'json',
                       data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "TransactionID": TransID, "InventoryID": InvID, "ParentID": ParentID }),
                       success: function (response) {
                           if (response.UndoActivityResult.Payload) {
                               ShowSuccess('Updated');
                               $scope.GetRecentActivities();

                               
                           }
                       },
                       error: function (err) {
                            
                           log.error(err.Message);

                       }
                   });
            }
        });

   
        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("Once undone, this activity will be removed and cannot be restored.");

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