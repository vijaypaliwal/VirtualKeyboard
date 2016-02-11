'use strict';
app.controller('indexController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
    $scope.InventoryItemsCore = [];
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/login');
    }

    $scope.authentication = authService.authentication;

}]);