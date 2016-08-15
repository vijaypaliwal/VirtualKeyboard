'use strict';
app.controller('currentinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.CurrentView = "Current Inventory"
    $scope.InventoryViews = [];
    $scope.InventoryList = [];

    $scope.isviewload = false;

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


    $scope.showfilter = function() {
        $("#modalfilter").modal('show');
    }

    $scope.viewdetail = function(viewname) {
        $scope.isviewload = true;
        $scope.CurrentView = viewname;
    }

    $scope.showview = function() {
        $scope.isviewload = false;
        $scope.CurrentView = "Current Inventory";
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