﻿'use strict';
app.controller('indexController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    function checkurl()
    {
        var path = "activity";
        if ($location.path().substr(0, path.length) !== path) {
            console.log("not into activity");
            StatusBar.backgroundColorByHexString("#0083C7");
        }
        else {
            console.log("into activity");
        }
    }
    $scope.logOut = function () {
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");
       
        
        authService.logOut();
        $location.path('/login');
    }

    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
    $scope.authentication = authService.authentication;

    $scope.GetProfileData=function()
    {


        authService.GetuserInfo();
        setTimeout(function () {
            $scope.UserInfoData = authService.UserInfo;
            if ($scope.UserInfoData != null && $scope.UserInfoData != undefined) {
               
                console.log($scope.UserInfoData);
                $scope.username = $scope.UserInfoData.username;
                $scope.myprofileimage = $scope.UserInfoData.myprofileimage;
                $scope.picURl = $scope.UserInfoData.picURl;
                $scope.$apply();
            }
        },1000)
       
    }

    $scope.Validation=function(value,type)
    {
        switch (type) {
            case 1:
                if (typeof (value) === "number") {
                    return true;
                }
                else { return false; }
                break;
            case 2:
                if (typeof (value) === "boolean") {
                    return true;
                }
                else { return false;}
                break;
            case 3:
                if (typeof (value) === "date") {
                    return true;
                }
                else { return false; }
                break;
            default:

        }
    }

    if (_Islive)
    {
        checkurl();

    }

}]);