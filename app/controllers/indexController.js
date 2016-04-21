'use strict';
app.controller('indexController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {

  
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

                
             
                   $scope.username = response.GetUserInfoResult.Payload[0].UserName
                   $scope.myprofileimage = response.GetUserInfoResult.Payload[0].ProfilePic;

                   if (response.GetUserInfoResult.Payload[0].ProfilePic != null && response.GetUserInfoResult.Payload[0].ProfilePic != "") {

                       $scope.picURl = "http://dev.style.u8i9.com/Logos/" + response.GetUserInfoResult.Payload[0].ProfilePic
                   }

                   else {

                       $scope.picURl = "img/dummy-user48.png";

                   }

                   console.log(response)

                   $scope.$apply();

               },
               error: function (err) {


               }
           });

    }
  
    $scope.logOut = function () {
      //  authService.logOut();
        $location.path('/login');
    }

    $scope.authentication = authService.authentication;


    setInterval(function () { $scope.Getuserinfo(); }, 3000);

  

}]);