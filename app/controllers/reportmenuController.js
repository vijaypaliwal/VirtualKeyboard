 'use strict';
app.controller('reportmenuController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
 

    $scope.mainObjectToSend = [];

    $scope.currentinvloaded = false;

    $scope.loadcounter = false;

    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");

        $scope.MyinventoryFieldsNames = localStorageService.get("unitdatafieldsobject");

        
        console.log($scope.MyinventoryFieldsNames);
        $scope.itemlabel = $scope.CurrentInventory.pPart

        $scope.GetInventoryViews()
     
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

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



    $scope.GoTo = function (url) {

        $location.path(url);
    }

    $scope.GetInventoryViews = function () {

        $scope.loadcounter = false;

        $scope.currentinvloaded = false;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 1 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response)
              {

                  if (response.GetAllViewsResult.Success == true) {
                      $scope.InventoryViews = response.GetAllViewsResult.Payload;
                      $scope.loadcounter = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Inventory reports counter", 1, 1, response.GetAllViewsResult.Message)

                  }
            
              },
              error: function (err) {
                  $scope.currentinvloaded = true;
                  $scope.ShowErrorMessage("Inventory  reports counter", 2, 1, err.statusText);


              }
          });

    }

    $scope.GetActivityViews = function () {

        $scope.loadcounter = false;

        $scope.currentinvloaded = false;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 3 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  if (response.GetAllViewsResult.Success == true) {

                      $scope.ActivityViews = response.GetAllViewsResult.Payload;
                      $scope.loadcounter = true;
                      $scope.$apply();

                  }
                  else {
                      $scope.ShowErrorMessage("Activity Views counter", 1, 1, response.GetAllViewsResult.Message)

                  }

              },
              error: function (err) {
                  $scope.currentinvloaded = true;
                  $scope.ShowErrorMessage("Activity  reports counter", 2, 1, err.statusText);
                  $scope.$apply();

              }
          });

    }

    function init() {
       


        $scope.GetInventoryViews()

        $scope.GetActivityViews()
        
        $scope.$apply();
    }
    init()

}]);