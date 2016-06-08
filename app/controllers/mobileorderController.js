'use strict';
app.controller('mobileorderController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.isallowdrag = true;

    $scope.LocationsLoaded = false;

    $scope.Isbuttonshow = false;

    $scope.loadingbutton == false;


    $scope.mainObjectToSend = [];

    function init() {
        $scope.GetMyinventoryColumns();

        $scope.$apply();
    }
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.allowdrag = function () {
        ShowSuccess("Updated");
        debugger;
        $scope.isallowdrag = true;
        $scope.$apply();
    }


    $scope.disallowdrag = function () {
        ShowSuccess("Updated");
        debugger;
        $scope.isallowdrag = false;
        $scope.$apply();
    }


    function SortByOrder(a, b) {
        var aName = a.mobileorder;
        var bName = b.mobileorder;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }


    $scope.GetMyinventoryColumns = function () {

        $scope.LocationsLoaded = false;
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

                  $scope.MyInventorycolumns = response.GetMyInventoryColumnsResult.Payload;

                  $scope.LocationsLoaded = true;
                  $scope.Isbuttonshow = true;
                  $scope.MyInventorycolumns.sort(SortByOrder);
                  $scope.$apply();

                  console.log($scope.MyInventorycolumns);
              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");
                  $scope.LocationsLoaded = true;

              }
          });

    }


    $scope.sortableOptions = {
        start: function (evt, ui) {
      //  $cordovaKeyboard.disableScroll(true);
        },
        items: "tr",
        update: function (e, ui) {
        },
        placeholder: "alert alert-info",
        cancel: ".unsortable",
        stop: function (e, ui) {
          
         //   $cordovaKeyboard.disableScroll(false);


        }
    };

    $scope.offmobileorder = function ()
    {

    }



    $scope.AlreadyTaken = function (ColID, order) {
        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].mobileorder == order) {
                return true;
                break;
            }
        }

        return false;
    }

    $scope.ClearMobileOrder = function () {
        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].Required != true) {
                $scope.MyInventorycolumns[i].mobileorder = 0;
            }
        }
        $scope.$apply();
    }



    $scope.saveColumns = function () {

        $scope.LocationsLoaded = false;

        $scope.loadingbutton == true;

        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
            if ($scope.MyInventorycolumns[i].mobileorder != 0) {
                $scope.MyInventorycolumns[i].mobileorder = i + 1;

            }

        }

        console.log($scope.MyInventorycolumns);
        debugger;
        $scope.$apply();

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'SaveMyInventoryColumn',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Columns": $scope.MyInventorycolumns }),
              success: function (response) {

                  debugger;

                  $scope.LocationsLoaded = true;
                  $scope.loadingbutton == false

                  ShowSuccess("Updated");
                  $scope.$apply();
              },
              error: function (err) {
                  console.log(err);
                  $scope.LocationsLoaded = true;
                  $scope.loadingbutton == false;
                  $scope.$apply();
                  log.error("Error Occurred during operation");


              }
          });



    };


    init();

}]);