'use strict';
app.controller('signupController', ['$scope','localStorageService', '$location', '$timeout', 'authService', 'log', function ($scope,localStorageService, $location, $timeout, authService, log) {

    $scope.savedSuccessfully = false;
    $scope.message = "";
    
    $scope.registration = {
        Name:"",
    Company:"",
    Email:"",
    Account:"",
    UserName:"",
    Password:"",
    TAndC:true
    };

    $scope.signUp = function () {
        ShowsignupSuccess();

        console.log($scope.registration);
    
        $.ajax
        ({
            type: "POST",
            url: serviceBase + 'Signup',
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',
            data: JSON.stringify({ "_signup": $scope.registration }),
            success: function (response) {
                debugger;
                $("#mysignupModal").removeClass('bounceIn').addClass('bounceOut');
                $('#mysignupModal').hide();

                if (response.SignupResult.Success == true) {

                    log.success("You are successfully registered");


                    localStorageService.set('lastlogindata', { userName: response.SignupResult.Payload.UserName, Password: response.SignupResult.Payload.Password, AccountName: response.SignupResult.Payload.Account });
                    $location.path('/login');
                    $scope.$apply();
                }
                else {
                    log.error(response.SignupResult.Message);
                }
            
            },
            error: function (err) {
                debugger;
                $("#mysignupModal").removeClass('bounceIn').addClass('bounceOut');
                $('#mysignupModal').hide();
                console.log(err);
                log.error("Error Occurred during operation");


            }
        });
       
    };


    $scope.CheckIsRequiredfields=function()
    {
        if($scope.registration.Name=="" ||$scope.registration.Company=="" || $scope.registration.Account=="" ||$scope.registration.Email=="" || $scope.registration.UserName=="" ||$scope.registration.Password=="")
        {
            return true;
        }
        else {
            return false;
        }
    }
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

}]);