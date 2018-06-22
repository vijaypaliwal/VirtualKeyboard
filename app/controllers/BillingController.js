'use strict';

app.controller('BillingController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', function ($scope, $location, authService, localStorageService, ngAuthSettings) {

    $scope.BillingData = [];
    $scope.IsLoading = true;

    $scope.customerdata = {Name:"", accountID:"", }

    $scope.GetUserBills = function () {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "BillingDetail",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
            error: function (err) {
                debugger;
                $scope.IsLoading = false;
            },

            success: function (data) {
                debugger;
                if (data.BillingDetailResult.Success == true) {

                

                 
                    if (data.BillingDetailResult != null && data.BillingDetailResult.Payload != null) {
                        $scope.BillingData = data.BillingDetailResult.Payload[0];
                        console.log("billing Data");
                        console.log($scope.BillingData);
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get Billing Detail", 1, 1, data.BillingDetailResult.Message);

                }
                $scope.IsLoading = false;

                $scope.$apply();
            }
        });
    };
 
    function init()
    {
        var _accountID = localStorageService.get('AccountID');
        
        if (_accountID != null && _accountID != undefined)
        {
              $scope.CurrentAccount=_accountID;
        }

        $scope.GetUserBills();
    }

    init();  
   

}]);
