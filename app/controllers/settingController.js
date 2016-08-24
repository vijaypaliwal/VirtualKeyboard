﻿'use strict';
app.controller('settingController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
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

                   if (response.GetStatusResult.Success == true) {
                       $scope.StatusList = response.GetStatusResult.Payload;

                   }
                   else {
                       $scope.ShowErrorMessage("Getting Status count", 1, 1, response.GetStatusResult.Message)

                   }
                   $scope.IsStatusLoading = false;


                   $scope.$apply();
               },
               error: function (err) {
                   $scope.IsStatusLoading = false;
                   $scope.ShowErrorMessage("Getting Status count", 2, 1, err.statusText);


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
                   if (response.GetUnitsOfMeasureResult.Success == true) {
                       $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;


                   }
                   else {
                       $scope.ShowErrorMessage("Getting UOM count", 1, 1, response.GetUnitsOfMeasureResult.Message)

                   }
                   $scope.$apply();

               },
               error: function (err) {
                   $scope.IsUOMLoading = false;
                   $scope.ShowErrorMessage("Getting UOM count", 2, 1, err.statusText);

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

                   if (response.GetLocationsResult.Success == true) {
                       $scope.LocationList = response.GetLocationsResult.Payload;
                       $scope.LocationSearchList = $scope.LocationList;


                   }
                   else {
                       $scope.ShowErrorMessage("Getting Location count", 1, 1, response.GetLocationsResult.Message)

                   }

                   $scope.$apply();
               },
               error: function (response) {

                   $scope.IsLocationLoading = false;
                   $scope.ShowErrorMessage("Getting Location count", 2, 1, response.statusText);


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


                  if (response.GetMyInventoryColumnsResult.Success == true) {





                      var _myinventorycols = response.GetMyInventoryColumnsResult.Payload;
                      for (var i = 0; i < _myinventorycols.length; i++) {
                          if (_myinventorycols[i].ColumnName != "HasConversion" && _myinventorycols[i].ColumnName != "ActionQty") {
                              $scope.columnlist.push(_myinventorycols[i]);
                          }
                      }



                  }
                  else {
                      $scope.ShowErrorMessage("Getting My inventory column's count", 1, 1, response.GetMyInventoryColumnsResult.Message)

                  }

                  $scope.$apply();

              },
              error: function (err) {
                  $scope.LocationsLoaded = true;
                  $(".save-btn").hide();
                  $scope.ShowErrorMessage("Getting My inventory column's count", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });

    }


    init();





}]);