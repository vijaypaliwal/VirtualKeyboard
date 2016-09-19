'use strict';

app.controller('AccountsController', ['$scope', '$location', 'authService','localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService,localStorageService, ngAuthSettings, log) {



 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $scope.AccountsList = [];
    $scope.GetUserAccounts=function()
    {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "GetUserAccounts",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken}),
            error: function (err, textStatus, errorThrown) {
                $scope.UOMSearching = false;
                if (err.readyState == 0 || err.status == 0) {

                }
                else {


                    if (textStatus != "timeout") {


                        $scope.ShowErrorMessage("Get user Accounts", 2, 1, err.statusText);
                    }
                }
            },

            success: function (data) {

                if (data.GetUserAccountsResult.Success == true) {

                    if (data.GetUserAccountsResult != null && data.GetUserAccountsResult.Payload != null) {
                        $scope.AccountsList = data.GetUserAccountsResult.Payload;

                        console.log($scope.AccountsList);
                        $scope.$apply();

                    }
                }
                else {
                    $scope.ShowErrorMessage("Get user Accounts", 1, 1, data.GetUserAccountsResult.Message)


                }



            }
        });
    }

    $scope.UpdateSecurityToken = function (AccountID) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "UpdateSecurityToken",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "AccountID": AccountID }),
            error: function (err, textStatus, errorThrown) {
                $scope.UOMSearching = false;
                if (err.readyState == 0 || err.status == 0) {

                }
                else {


                    if (textStatus != "timeout") {


                        $scope.ShowErrorMessage("update security token", 2, 1, err.statusText);
                    }
                }
            },

            success: function (data) {

          
                if (data.UpdateSecurityTokenResult.Success == true) {

                    if (data.UpdateSecurityTokenResult != null && data.UpdateSecurityTokenResult.Payload != null) {
                        var _token = data.UpdateSecurityTokenResult.Payload;

                        localStorageService.set('authorizationData', { token: _token});

                        $location.path("/FindItems");

                        $scope.$apply();



                    }
                }
                else {
                    $scope.ShowErrorMessage("update security token", 1, 1, data.UpdateSecurityTokenResult.Message)


                }



            }
        });
    }
    function init()
    {

        $scope.GetUserAccounts();

    }

    init();  
   

}]);
