'use strict';

app.controller('BillingController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService, localStorageService, ngAuthSettings, log) {

    $scope.BillingData = [];
    $scope.IsLoading = true;
    $scope.CurrentSubscriptionTotal = 0;
    $scope.customerdata = { Name: "", accountID: "", }
    $scope.StartDate = "";
    $scope.EndDate = "";
    $scope.CustomerEdit = false;
    $scope.UpcomingSubscriptionTotal = 0;
    $scope.CustomerObj = { Name: "", Email: "" };
    $scope.IsSaving = false;
    $scope.ShowInvoicedetails = false;

    $scope.IsProperEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
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
                        
                        $scope.CustomerObj.Email = $scope.BillingData.Email;
                        $scope.CustomerObj.Name = $scope.BillingData.Description;
                        for (var i = 0; i < $scope.BillingData.Subscriptions.length; i++) {
                            $scope.CurrentSubscriptionTotal += $scope.BillingData.Subscriptions[i].Quantity * $scope.BillingData.Subscriptions[i].UnitPrice;
                        }

                        for (var i = 0; i < $scope.BillingData.UpComingInvoices.length; i++) {
                            $scope.StartDate = $scope.BillingData.UpComingInvoices[i].StartDate;
                            $scope.EndDate = $scope.BillingData.UpComingInvoices[i].EndDate;
                            $scope.UpcomingSubscriptionTotal += ($scope.BillingData.UpComingInvoices[i].Amount/100);
                        }
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
   


    $scope.UpdateCustomerDetail = function () {
        $scope.IsSaving = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "EditCustomer",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "customerName": $scope.CustomerObj.Name, "customerEmail": $scope.CustomerObj.Email }),
            error: function (err) {
                debugger;
                $scope.IsSaving = false;
            },

            success: function (data) {
                debugger;
                if (data.EditCustomerResult.Success == true) {




                    if (data.EditCustomerResult != null && data.EditCustomerResult.Payload != null) {
                        log.success("Saved Success fully");
                        $scope.GetUserBills();
                        $scope.ToggleCustomerEdit();
                    }
                }
                else {
                    $scope.ShowErrorMessage("Get Billing Detail", 1, 1, data.BillingDetailResult.Message);

                }
                $scope.IsSaving = false;

                $scope.$apply();
            }
        });
    }

    $scope.getInvoiceDetails = function (InvoiceID) {

        $scope.IsLoading = true;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax({

            type: "POST",
            url: serviceBase + "GetInvoiceDetail",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "id": InvoiceID }),
            error: function (err) {

                $scope.IsLoading = false;

            },

            success: function (data) {

                $scope.InvoiceDetails = data.GetInvoiceDetailResult.Payload[0];


                for (var i = 0; i < $scope.InvoiceDetails.Invoices.length; i++) {
                    $scope.StartInvoiceDate = $scope.InvoiceDetails.Invoices[i].StartDate;
                    $scope.EndInvoiceDate = $scope.InvoiceDetails.Invoices[i].EndDate;
                }

                $scope.ShowInvoicedetails = true;
                $scope.IsLoading = false;
                $scope.$apply();


            }
        });
    }

  

    $scope.ToggleCustomerEdit=function(){
        $scope.CustomerObj.Email = $scope.BillingData.Email;
        $scope.CustomerObj.Name = $scope.BillingData.Description;

        $scope.CustomerEdit=!$scope.CustomerEdit;
        $scope.$apply();
    }
    
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
