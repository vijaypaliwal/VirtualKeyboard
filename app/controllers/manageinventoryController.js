'use strict';
app.controller('manageinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    $scope.Isinventory = false;
    $scope.Isfulluser = false;
    $scope.Isviewuser = false;
    $scope.LocalInventories = [];
    $scope.selectedInventory = {};
    $scope.LocalInvID = 1;
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $("#selectInv").change(function () {

        if ($.trim($(this).val()) != "") {
            $scope.GetSelectedInventory(parseInt($(this).val()));

        }
        else {
            $scope.selectedInventory = {};
        }
        CheckScopeBeforeApply();
    });
    $scope.openClosePanel = function (Type) {
        switch (Type) {
            case 1:
                $scope.Isinventory = !$scope.Isinventory;
                $scope.Isfulluser = false;
                $scope.Isviewuser = false;
                break;

            case 2:
                $scope.Isfulluser = false;
                $scope.Isinventory = false;
                $scope.Isviewuser = !$scope.Isviewuser;
                break;

            case 3:
                $scope.Isinventory = false;
                $scope.Isfulluser = !$scope.Isfulluser;

                $scope.Isviewuser = false;
                break;

           
            default:

        }
        CheckScopeBeforeApply();
    }
  
    $scope.openClosePanel(1);
    $scope.GetSelectedInventory = function (ID) {
        debugger;
        for (var i = 0; i < $scope.LocalInventories.length; i++) {
            if ($scope.LocalInventories[i].InventoryID == ID) {
                $scope.selectedInventory = $scope.LocalInventories[i];
                break;
            }

        }

        CheckScopeBeforeApply();
    }
    function init()
    {
        debugger;
        $scope.LocalInventories = localStorageService.get("Inventories");
        var _LocalInvID = parseInt(localStorageService.get("InventoryID"));
        if (_LocalInvID == null || _LocalInvID == undefined)
        {
            _LocalInvID = 1;
        }
        $scope.LocalInvID = _LocalInvID;
        setTimeout(function () {
            $("#selectInv").val(_LocalInvID);
            $scope.GetSelectedInventory(_LocalInvID);
        }, 100);
        
        CheckScopeBeforeApply();
    }

    init();
}]);