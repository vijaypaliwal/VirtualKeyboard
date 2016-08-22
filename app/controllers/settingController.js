﻿'use strict';
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
    $scope.Iscolumnloading = false;
    $scope.columnlist = [];
    $scope.mainObjectToSend = [];
    function init() {
        $scope.getuom();
        $scope.getstatus();
        $scope.getlocation();
        $scope.GetMyinventoryColumns();
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.GoTo = function (url) {
        $location.path(url);
    }
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

    $scope.GetMyinventoryColumns = function () {

        $scope.Iscolumnloading = true;

    
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
                  $scope.Iscolumnloading = false;

                  var _myinventorycols = response.GetMyInventoryColumnsResult.Payload;
                  for (var i = 0; i < _myinventorycols.length; i++) {
                      if (_myinventorycols[i].ColumnName != "HasConversion" && _myinventorycols[i].ColumnName != "ActionQty") {
                          $scope.columnlist.push(_myinventorycols[i]);
                      }
                  }

                  console.log($scope.columnlist);
                 // $scope.columnlist = response.GetMyInventoryColumnsResult.Payload;
                
                  $scope.$apply();

                  console.log($scope.MyInventorycolumns);
              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");
                  $scope.LocationsLoaded = true;
                  $(".save-btn").hide();
                  $scope.errorbox(err);
                  $scope.$apply();

              }
          });

    }


    init();



 

}]);