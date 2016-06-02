'use strict';
app.controller('mobileorderController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.isallowdrag = false;
  

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

                  $scope.MyInventorycolumns = response.GetMyInventoryColumnsResult.Payload;

                  $scope.$apply();

                 console.log($scope.MyInventorycolumns);
              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");


              }
          });

    }


    $scope.sortableOptions = {
        items: "li:not(.unsortable)",
        update: function (e, ui) {
           
        },
        cancel: ".unsortable",
        stop: function (e, ui) {

        }
    };



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



        for (var i = 0; i < $scope.MyInventorycolumns.length; i++) {
          //  $scope.MyInventorycolumns[i].mobileorder = i + 1;
        }

        debugger;


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

                  ShowSuccess("Updated");
              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");


              }
          });



    };


    init();

}]);