'use strict';

app.controller('CreateSubscriptionController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService, localStorageService, ngAuthSettings, log) {
    $scope.IsLoading = false;
    $scope.IsSaving = false;
    $scope.CreditCard = {Email:"",Name:"",StripePublicKey:"",StripeToken:"",UserCount:0};
    var stripe = {};
    var _newcard = {};
    var elements = [];
    $scope.includedUserCount = 2;
    $scope.GetCreditCardDetail = function () {
        $scope.IsLoading = true;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax({

            type: "POST",
            url: serviceBase + "GetCreditCardDetail",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken}),
            error: function (err) {
                $scope.IsLoading = false;
            },

            success: function (data) {

                if (data.GetCreditCardDetailResult.Success == true) {
                    $scope.CreditCard = data.GetCreditCardDetailResult.Payload;
                 
                    stripe = Stripe($scope.CreditCard.StripePublicKey);
                    debugger;
                    console.log(stripe);
                    elements = stripe.elements();

                    _newcard = elements.create('card', {
                        style: {
                            base: {
                                color: '#069',
                                fontSize: '16px'
                            }
                        }
                    });

                   // alert(_newcard._componentName);
                    _newcard.mount('#newcardelement');

                    console.log($('#newcardelement').html());

                    _newcard.on('change', function (event) {
                        setOutcome(event);
                    });

                    if ($scope.CreditCard.UserCount == 1)
                    {
                        $scope.includedUserCount = 1;

                    }
                   
                }
                else {
                    $scope.ShowErrorMessage("Get Credit Card Detail", 1, 1, data.GetCreditCardDetailResult.Message);

                }
                $scope.IsLoading = false;
                $scope.$apply();

                cordova.plugins.stripe.setPublishableKey($scope.CreditCard.StripePublicKey);
                $scope.CreditCardSubmission();
            }
        });
    };
    $scope.SaveCreditCardDetail = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $scope.IsSaving = true;
        $scope.$apply();
        $scope.CreditCard.StripeToken = $("#stripe-token").val();
        $.ajax({

            type: "POST",
            url: serviceBase + "CreateNewSubscription",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Model": $scope.CreditCard }),
            error: function (err) {
                $scope.IsSaving = false;
                $scope.$apply();
            },

            success: function (data) {

                if (data.CreateNewSubscriptionResult.Success == true) {
                   
                    log.success("Card Detail Saved successfully");
                    $location.path("/Billings");
                    $scope.$apply();
                }
                else {
                    $scope.ShowErrorMessage("Get Credit Card Detail", 1, 1, data.CreateNewSubscriptionResult.Message);

                }
                $scope.IsSaving = false;
                $scope.$apply();
            }
        });
    };


    var card = {
        number: '4242424242424242', // 16-digit credit card number
        expMonth: 12, // expiry month
        expYear: 2020, // expiry year
        cvc: '220', // CVC / CCV
        name: 'John Smith', // card holder name (optional)
        address_line1: '123 Some Street', // address line 1 (optional)
        address_line2: 'Suite #220', // address line 2 (optional)
        address_city: 'Toronto', // city (optional)
        address_state: 'Ontario', // state/province (optional)
        address_country: 'Canada', // country (optional)
        postal_code: 'L5L5L5', // Postal Code / Zip Code (optional)
        currency: 'CAD' // Three-letter ISO currency code (optional)
    };

    function onSuccess(tokenId) {
        alert(JSON.stringify(tokenId));
    }

    function onError(errorMessage) {
        alert('Error getting card token', errorMessage);
    }

    $scope.CreditCardSubmission = function () {
        cordova.plugins.stripe.createCardToken(card, onSuccess, onError);
    }

   

    function init()
    {
        var _accountID = localStorageService.get('AccountID');
        
        if (_accountID != null && _accountID != undefined)
        {
              $scope.CurrentAccount=_accountID;
        }

        $scope.GetCreditCardDetail();
    }

    init();  
    $scope.GetDisabledClass = function () {
        
        if ($.trim($scope.CreditCard.Email) == "" || $.trim($scope.CreditCard.Name) == "")
        {
            return "disabled";

        }

        return "";
    }


   

 

    function setOutcome(result) {
        document.getElementById('card-error').textContent = '';
        if (result.token) {
            document.getElementById('stripe-token').value = result.token.id;
            $("#stripe-token").trigger("input");
        } else if (result.error) {
            document.getElementById('card-error').textContent = result.error.message;
            $scope.IsSaving = false
            $scope.$apply();
        }
    }

  

    document.getElementById('stripeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        $scope.IsSaving = true
        $scope.$apply();
        var extraDetails = {
            name: document.getElementById('cardholder-name').value
        };
        stripe.createToken(_newcard, extraDetails).then(
            function (result) {
                setOutcome(result);
                var _token = document.getElementById('stripe-token').value;
                if (_token.length > 0) {
                    //document.getElementById('customerForm').submit();
                    $scope.SaveCreditCardDetail();
                }
                else {
                    $scope.IsSaving = false
                    $scope.$apply();
                }
            });
    });

}]);
