'use strict';
app.controller('settingController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.IsUOMLoading = false;
    $scope.IsStatusLoading = false;
    $scope.IsLocationLoading = false;

    $scope.mainObjectToSend = [];
    function init() {
        $scope.getuom();
        $scope.getstatus();

        $scope.getlocation();
     
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
    $scope.getstatus = function () {

        $scope.IsStatusLoading = true;
      
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
                   $scope.IsStatusLoading = false;
                   debugger;

                   $scope.StatusList = response.GetStatusResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.IsStatusLoading = false;
                   log.error(err.Message);

               }
           });

    }

    $scope.getuom = function () {
        $scope.IsUOMLoading = true;

        

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
                   $scope.IsUOMLoading = false;
                   debugger;
                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.IsUOMLoading = false;
                   log.error(err.Message);

               }
           });

    }

    $scope.getlocation = function () {
        $scope.LocationList = [];
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.IsLocationLoading = true;
        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetLocations',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   debugger;
                   $scope.IsLocationLoading = false;
                   $scope.LocationList = response.GetLocationsResult.Payload;
                   $scope.LocationSearchList = $scope.LocationList;

               
                   $scope.$apply();
               },
               error: function (response) {

                   $scope.IsLocationLoading = false;
                   console.log(response);


               }
           });

    }


    init();



 

}]);