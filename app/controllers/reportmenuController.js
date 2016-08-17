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
               $scope.InventoryViews = response.GetAllViewsResult.Payload;
               $scope.loadcounter = true;
               $scope.$apply();

              },
              error: function (err) {
                  $scope.currentinvloaded = true;
                  $scope.errorbox(err);
                  $scope.$apply();

              }
          });

    }

    function init() {
       


        $scope.GetInventoryViews()

        $scope.$apply();
    }
    init()

}]);