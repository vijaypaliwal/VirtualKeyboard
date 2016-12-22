'use strict';
app.controller('manageinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    $scope.Isinventory = false;
    $scope.Isfulluser = false;
    $scope.Isviewuser = false;
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.openClosePanel = function (Type) {
        switch (Type) {
            case 1:
                $scope.Isinventory = !$scope.Isinventory;
                $scope.Isfulluser = false;
                $scope.Isviewuser = false;
                break;

            case 2:
                $scope.Isviewuser = false;
                $scope.Isinventory = false;
                $scope.Isfulluser = !$scope.Isfulluser;
                break;

            case 3:
                $scope.Isinventory = false;
                $scope.Isviewuser = !$scope.Isviewuser;
                $scope.Isfulluser = false;
                break;

           
            default:

        }
        CheckScopeBeforeApply();
    }
  
    $scope.openClosePanel(1);
}]);