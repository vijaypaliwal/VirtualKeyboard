'use strict';
app.controller('profileController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.Currentuser = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.usename = "";
    $scope.phone = "";
    $scope.organization = "";
    $scope.email = "";
    $scope.picURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
    $scope.isSaving = false;
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

                   $scope.firstname = response.GetUserInfoResult.Payload[0].FirstName
                   $scope.lastname = response.GetUserInfoResult.Payload[0].LastName;
                   $scope.email = response.GetUserInfoResult.Payload[0].Email
                   $scope.phone = response.GetUserInfoResult.Payload[0].Phone
                   $scope.organization = response.GetUserInfoResult.Payload[0].Organization
                   $scope.username = response.GetUserInfoResult.Payload[0].UserName
                   $scope.myprofileimage = response.GetUserInfoResult.Payload[0].ProfilePic;


                   $scope.firstnameLabel = response.GetUserInfoResult.Payload[0].FirstName
                   $scope.lastnameLabel = response.GetUserInfoResult.Payload[0].LastName;
                   $scope.emailLabel = response.GetUserInfoResult.Payload[0].Email
                   $scope.phoneLabel = response.GetUserInfoResult.Payload[0].Phone
                   $scope.organizationLabel = response.GetUserInfoResult.Payload[0].Organization
                   $scope.usernameLabel = response.GetUserInfoResult.Payload[0].UserName

                   if (response.GetUserInfoResult.Payload[0].ProfilePic != null && response.GetUserInfoResult.Payload[0].ProfilePic != "") {

                       $scope.picURl = serviceBaseUrl + "Logos/" + response.GetUserInfoResult.Payload[0].ProfilePic
                   }

                   else {

                    $scope.picURl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

                   }


                   $scope.$apply();

               },
               error: function (err) {

                   alert("Error");
                    

                   alert(err.Message);

               }
           });

    }

    


    $scope.Updateinfo = function () {
         
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var _data = { "UserName": $scope.username, "FirstName": $scope.firstname, "LastName": $scope.lastname, "Email": $scope.email, "Phone": $scope.phone, "Organization": $scope.organization, "ProfilePic": $scope.myprofileimage };

        $scope.isSaving = true;
         
        $.ajax({
            url: serviceBase + "UpdateUserInfo",
            type: 'POST',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _data }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                // log.success("Profile information Updated.");
                ShowSuccess("Updated");

                $scope.firstnameLabel = $scope.firstname;
                $scope.lastnameLabel = $scope.lastname;
                $scope.emailLabel = $scope.email;
                $scope.phoneLabel = $scope.phone;
                $scope.organizationLabel = $scope.organization;
                $scope.usernameLabel = $scope.username;


                $(".detailmode").show();
                $(".editmode").hide();
                $scope.isSaving = true;
                $scope.$apply();

            },
            error: function (err) {

                log.error("Some thing went wrong");
                $scope.isSaving = false;
                $scope.$apply();
            
            },
            complete: function () {
                $scope.isSaving = false;
                $scope.$apply();
            }
        });
    
    }



    $scope.logOut = function ()
    {
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