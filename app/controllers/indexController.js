'use strict';
app.controller('indexController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {


    ////$scope.Getuserinfo = function () {

    //    var authData = localStorageService.get('authorizationData');
    //    if (authData) {
    //        $scope.SecurityToken = authData.token;
    //    }

    //    $.ajax
    //       ({
    //           type: "POST",
    //           url: serviceBase + "GetUserInfo",
    //           contentType: 'application/json; charset=utf-8',
    //           dataType: 'text json',
    //           data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
    //           success: function (response) {



    //               $scope.username = response.GetUserInfoResult.Payload[0].UserName
    //               $scope.myprofileimage = response.GetUserInfoResult.Payload[0].ProfilePic;

    //               if (response.GetUserInfoResult.Payload[0].ProfilePic != null && response.GetUserInfoResult.Payload[0].ProfilePic != "") {

    //                   $scope.picURl = "http://dev.style.u8i9.com/Logos/" + response.GetUserInfoResult.Payload[0].ProfilePic
    //               }

    //               else {

    //                   $scope.picURl = "img/dummy-user48.png";

    //               }

    //               console.log(response)

    //               $scope.$apply();

    //           },
    //           error: function (err) {


    //           }
    //       });

    //}

    $scope.logOut = function () {
        //  authService.logOut();
        $location.path('/login');
    }


    debugger;
    var _UserInfoData = localStorageService.get('UserInfoData');
    $scope.authentication = authService.authentication;
    if (_UserInfoData != null && _UserInfoData != undefined) {

        $scope.username = _UserInfoData.username;
        $scope.myprofileimage = _UserInfoData.myprofileimage;
        $scope.picURl = _UserInfoData.picURl;
    }
    //setInterval(function () { $scope.Getuserinfo(); }, 3000);



}]);