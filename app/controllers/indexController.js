'use strict';
app.controller('indexController', ['$scope', 'localStorageService', 'authService', '$location', 'log', '$cordovaKeyboard', '$cordovaStatusbar', function ($scope, localStorageService, authService, $location, log, $cordovaKeyboard, $cordovaStatusbar) {
    function checkurl() {
        var path = "activity";
        if ($location.path().substr(0, path.length) !== path) {
            // UpdateStatusBar(55);
        }
        else {
            console.log("into activity");
        }
    }

    $scope.currentactiveaccount = function (AccountName) {
        localStorageService.set("ActivityCart", "");
        localStorageService.set("SelectedAction", "");
        localStorageService.set('AccountID', AccountName);
        $scope.CurrentAccount = localStorageService.get('AccountID');
        $scope.$apply();
    }

    $scope.Permission = [];
    $scope.Permission1 = [];
    $scope.Permission2 = [];
    $scope.Permission3 = [];
    $scope.Permission4 = [];
 



    $scope.CurrentAccount = localStorageService.get('AccountID');


    $scope.CurrentUserKey = localStorageService.get('UserKey');

    $scope.GetPermission = function (Type, Key) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }


        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUserPermissions',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type, "UserKey": Key }),
               success: function (response) {

                   debugger;


                   if (response.GetUserPermissionsResult.Success == true) {

                       if (Type == 1) {

                           $scope.Permissions4 = response.GetUserPermissionsResult.Payload;


                       }
                       if (Type == 4) {

                           $scope.Permissions1 = response.GetUserPermissionsResult.Payload;


                       }

                       if (Type == 3) {

                           $scope.Permissions2 = response.GetUserPermissionsResult.Payload;

                       }

                       if (Type == 5) {

                           $scope.Permissions3 = response.GetUserPermissionsResult.Payload;

                       }
                   }
                   else {
                    //   $scope.ShowErrorMessage("Custom column's data", 1, 1, response.GetUserPermissionsResult.Message)

                   }



                   $scope.$apply();
               },
               error: function (response) {

                   alert("Error");

                //   log.error(response.statusText);
               //    $scope.ShowErrorMessage("Custom column's data", 2, 1, response.statusText);

                   //$scope.InventoryObject.Location = 678030;
               },
               complete: function () {



               }
           });

    }



    $scope.getactivepermission = function () {
        $scope.CurrentUserKey=localStorageService.get('UserKey');
        setTimeout(function () {
            $scope.GetPermission(3, $scope.CurrentUserKey);
        }, 10);
        setTimeout(function () {
            $scope.GetPermission(4, $scope.CurrentUserKey);
        }, 10);
        setTimeout(function () {
            $scope.GetPermission(5, $scope.CurrentUserKey);
        }, 10);

        setTimeout(function () {
            $scope.GetPermission(1, $scope.CurrentUserKey);
        }, 10);
        $scope.$apply();
        setTimeout(function () {

            $scope.Permission = [];
            for (var i = 0; i < $scope.Permissions1.length; i++) {
                $scope.Permission.push($scope.Permissions1[i]);
            }
            for (var i = 0; i < $scope.Permissions2.length; i++) {
                $scope.Permission.push($scope.Permissions2[i]);
            }
            for (var i = 0; i < $scope.Permissions3.length; i++) {
                $scope.Permission.push($scope.Permissions3[i]);
            }

            for (var i = 0; i < $scope.Permissions4.length; i++) {
                $scope.Permission.push($scope.Permissions4[i]);
            }
            $scope.$apply();
          
        }, 500);
     

    }

    $scope.checkpermission = function (permissioncode) {



        for (var i = 0; i < $scope.Permission.length; i++) {
            if ($scope.Permission[i].PermissionCode == permissioncode) {


                return $scope.Permission[i].IsTurnedOn;

            }
        }

    }


    $scope.logOut = function () {
        localStorageService.set("ActivityCart", "");

        localStorageService.set("SelectedAction", "");

        authService.logOut();
        $("#modalerror").modal('hide');
        $("#Inventoryerror").modal('hide');
        $location.path('/login');
    }
    $scope.GetTrimmedString = function (id) {
        var _string = $(id).val();
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }

        return _string == "" ? true : false;
    }

    $scope.GetTrimmedStringData = function (_string) {
        if (_string != null && _string != undefined) {
            _string = $.trim(_string);
        }

        return _string;
    }

    $scope.ShowErrorMessage = function (Place, TextType, Type, Message) {
        var _returnError = ""
        if (Message != undefined && Message != null) {

        }
        else {
            Message = "";
        }
        switch (TextType) {
            case 1:
                _returnError = "Error occurred in fetching " + Place + " " + Message;
                break;
            case 2:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
                break;
            case 3:
                _returnError = "Error occurred during updating data " + Place + " " + Message;
                break;
            default:
                _returnError = "Error in your requested data while getting " + Place + " " + Message;
        }

        switch (Type) {
            case 1:
                log.error(_returnError);
                break;
            case 2:
                log.warning(_returnError);
                break;
            default:

        }
    }


    $(document).ajaxError(function (event, jqxhr, settings, exception) {

        if (jqxhr.status != 200 && (jqxhr.readyState != 0 || jqxhr.status != 0)) {
            if (exception != "timeout") {

                $(".modal").modal("hide");
                HideGlobalWaitingDiv();
                $("#modalerror").modal('show');
                $("#errortext").html(exception);
            }
        }
    });


    $scope.reload = function () {

        window.location.reload();

    }

    $scope.errorbox = function (error) {

        $("#modalerror").modal('show');
        $("#errortext").html(error)

    }


    $scope.changepage = function () {
        setTimeout(
        function () {
            $scope.getactivepermission();
        }, 500
        )
    }


    $scope.$on('$locationChangeStart', function (event) {

     

        var _path = $location.path();

  

        if (_path == "/inventory") {
            $scope.changepage();
            $cordovaKeyboard.disableScroll(true);
        }
        else {
            $scope.changepage();
           $cordovaKeyboard.disableScroll(false);
        }

        if (_path == "/activity") {

        }
        else {
            UpdateStatusBar(55);
        }

   

     
    });

    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
    $scope.authentication = authService.authentication;

    $scope.GetProfileData = function () {


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
        }, 1000)

    }
    function TryParseInt(str, defaultValue) {
        var retValue = defaultValue;
        if (str !== null) {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
    }
    $scope.Validation = function (value, type) {
        switch (type) {
            case 1:
                value = TryParseInt(value, -9890);
                if (value != -9890 && typeof (value) === "number") {
                    return true;
                }
                else { return false; }
                break;
            case 2:
                if (typeof (value) === "boolean") {
                    return true;
                }
                else { return true; }
                break;
            case 3:
                if (typeof (value) === "date") {
                    return true;
                }
                else { return true; }
                break;
            default:

        }
    }



    $scope.UploadImage = function (txnID, ImageList) {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        //  log.info("Image upload processing started at backend side, please be patient .")
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'UploadImage',
              contentType: 'application/json; charset=utf-8',
              dataType: 'text json',
              async: true,
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID }),
              success: function (response) {
                  if (response.UploadImageResult.Success == true) {

                      log.success("Image has been uploaded success fully for last inventory record.");
                      var _path = $location.path();
                      if (_path == "/inventory") {
                          $scope.GetInventories();
                      }

                      CheckScopeBeforeApply();
                  }
                  else {

                      $scope.ShowErrorMessage("Upload image", 1, 1, response.UploadImageResult.Message)
                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          if (err.status == 200) {
                              log.success("Image has been uploaded success fully for last inventory record.");
                              var _path = $location.path();
                              if (_path == "/inventory") {
                                  $scope.GetInventories();
                              }

                          }
                          else {
                              log.error(err.statusText);

                          }
                      }
                  }
              }
          });

    }
    $scope.SaveImages = function (txnID, ImageList) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        log.info("Image upload processing started at backend side, please be patient .")
        $.ajax
         ({
             type: "POST",
             url: serviceBase + 'UploadImage',
             contentType: 'application/json; charset=utf-8',

             dataType: 'json',
             data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "ImageList": ImageList, "txnID": txnID }),
             success: function (response) {
                 if (response.UploadImageResult.Success == true) {

                     log.success("Image uploaded successfully please refresh grid to see the uploaded image.")

                 }
                 else {
                     log.error(response.UploadImageResult.Message);
                 }



             },
             error: function (err) {
                 alert(err.status);
                 if (err.status == 200 || err.status == "200") {
                     log.success("Image uploaded successfully please refresh grid to see the uploaded image.")
                 }
                 else {
                     console.log(err);
                     log.error("Error Occurred during operation");
                 }



             }
         });
    }

    if (_Islive) {
        checkurl();

    }


  

}]);