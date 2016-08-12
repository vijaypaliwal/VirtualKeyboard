'use strict';
app.controller('currentinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.CurrentView = {Name:"CurrentInventory"};
    $scope.InventoryViews = [];
    $scope.InventoryList = [];
    $scope.GetInventoryViews = function () {

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
              success: function (response) {

                  debugger;


                  $scope.InventoryViews = response.GetAllViewsResult.Payload;

                  $scope.$apply();

              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");
                  $scope.errorbox(err);
                  $scope.$apply();

              }
          });

    }
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.AssignCurrentView=function(view)
    {
        $scope.CurrentView = view;
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }

    $scope.GetInventoryDataAccordingToView=function()
    {

    }

    

    function init() {
        $scope.GetInventoryViews();

     
        CheckScopeBeforeApply();
      
    
    }

    init();
}]);