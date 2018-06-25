'use strict';

app.controller('CreateSubscriptionController', ['$scope', '$location', 'authService', 'localStorageService', 'ngAuthSettings', 'log', function ($scope, $location, authService, localStorageService, ngAuthSettings, log) {
    $scope.IsLoading = false;
    $scope.CreditCard = {};

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

        $scope.GetCreditCardDetail();
    }

    init();  
   


    //var stripe = Stripe($scope.CreditCard.StripePublicKey);
    //var elements = stripe.elements();

    //var card = elements.create('card', {
    //    style: {
    //        base: {
    //            color: '#069',
    //            fontSize: '16px'
    //        }
    //    }
    //});
    //card.mount('#card-element');

    //function setOutcome(result) {
    //    document.getElementById('card-error').textContent = '';
    //    if (result.token) {
    //        document.getElementById('stripe-token').value = result.token.id;
    //    } else if (result.error) {
    //        document.getElementById('card-error').textContent = result.error.message;
    //    }
    //}

    //card.on('change', function (event) {
    //    setOutcome(event);
    //});

    //document.getElementById('stripeForm').addEventListener('submit', function (e) {
    //    e.preventDefault();
    //    var extraDetails = {
    //        name: document.getElementById('cardholder-name').value
    //    };
    //    stripe.createToken(card, extraDetails).then(
    //        function (result) {
    //            setOutcome(result);
    //            var _token = document.getElementById('stripe-token').value;
    //            if (_token.length > 0) {
    //                //document.getElementById('customerForm').submit();
    //            }
    //        });
    //});

}]);
