'use strict';
app.controller('profileController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {
    $scope.Currentuser = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.firstname = "Dashrath";
    $scope.lastname = "Kumawat";
    $scope.usename = "";
    $scope.phone = "9001783675";
    $scope.organization = "Shivam";
    $scope.email = "Dashrath.k@shivamitconsultancy.com";
    $scope.picURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

    function init() {
        $scope.CurrentInventory = localStorageService.get("CurrentDetailObject");
        console.log($scope.CurrentInventory);

        $scope.Getuserinfo();
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");




    $scope.Getuserinfo = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + "GetUserInfo",
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                
                   debugger;

                   $scope.firstname = response.GetUserInfoResult.Payload[0].FirstName
                   $scope.lastname = response.GetUserInfoResult.Payload[0].LastName;
                   $scope.email = response.GetUserInfoResult.Payload[0].Email
                   $scope.phone = response.GetUserInfoResult.Payload[0].Phone
                   $scope.organization = response.GetUserInfoResult.Payload[0].Organization
                   $scope.username = response.GetUserInfoResult.Payload[0].UserName

                   if (response.GetUserInfoResult.Payload[0].ProfilePic != null && response.GetUserInfoResult.Payload[0].ProfilePic != "") {

                       $scope.picURl = "http://dev.style.u8i9.com/Logos/" + response.GetUserInfoResult.Payload[0].ProfilePic
                   }

                   else {

                       $scope.picURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

                      
                   }

                   console.log(response)

                   $scope.$apply();

               },
               error: function (err) {

                   alert("Error");
                   debugger;

                   alert(err.Message);

               }
           });

    }



    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }




    init();













    $scope.Editmode = function () {
        $(".editmode").show();
        $(".detailmode").hide();

    }

    $scope.detailmode = function () {
        $(".editmode").hide();
        $(".detailmode").show();

    }












}]);