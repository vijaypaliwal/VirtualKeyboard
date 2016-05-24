'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {

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

        console.log($scope.registration);
        alert("submitting data");
        $.ajax
        ({
            type: "POST",
            url: serviceBase + 'Signup',
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',
            data: JSON.stringify({ "_signup": $scope.registration }),
            success: function (response) {


            
            },
            error: function (err) {


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