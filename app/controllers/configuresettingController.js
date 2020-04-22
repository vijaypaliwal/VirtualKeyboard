'use strict';
app.controller('configuresettingController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
  

    $scope.SettingsVm = { AutoClear: "", AllowNegative: "", DefaultQty: "", Defaultmode: false, socketmobile: allowsocketmobile }
    $scope.accountID = 0;
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    if (allowsocketmobile == true || allowsocketmobile=='true') {
        $scope.SettingsVm.socketmobile = true;
        CheckScopeBeforeApply();
    }


  

    $scope.setsocketmobile = function () {

        localStorage.setItem("allowsocket", $scope.SettingsVm.socketmobile);
        CheckScopeBeforeApply();

    }

 
    $scope.setInventorymode = function () {

        debugger;
        var defaultInvmode = $scope.SettingsVm.Defaultmode;

        CheckScopeBeforeApply();

        if (defaultInvmode == true) {
            localStorageService.set('DefaultInvmode', "Vertical");
        }
        else {
            localStorageService.set('DefaultInvmode', "swiper");
        }

        ShowSuccess("Updated");
      
    }




    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });

    $scope.Quantitylabel = "Quantity";
    $scope.GetMyinventoryColumns = function () {


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetMyInventoryColumns',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {





                  if (response.GetMyInventoryColumnsResult.Success == true) {

                      var _TempArray = response.GetMyInventoryColumnsResult.Payload;

                      for (var i = 0; i < _TempArray.length; i++) {



                        
                          if (_TempArray[i].ColumnName == "iQty") {
                              $scope.Quantitylabel = _TempArray[i].ColumnLabel;
                          }

                       


                      }
                      CheckScopeBeforeApply()
                  }
                  else {
                      $scope.ShowErrorMessage("My inventory Columns", 1, 1, response.GetMyInventoryColumnsResult.Message)

                  }

              },
              error: function (err, textStatus, errorThrown) {
                  if (err.readyState == 0 || err.status == 0) {

                  }
                  else {
                      if (textStatus != "timeout") {
                          console.log(err);
                          $scope.ShowErrorMessage("My inventory Columns", 2, 1, err.statusText);
                      }
                  }


              }
          });

    }
  

    $scope.UpdateSettings = function (value,Type) {
        debugger;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        if (Type == 1)
        {
            $scope.SettingsVm.AutoClear = value;
        }
        if (Type == 2) {
            $scope.SettingsVm.AllowNegative = value;
        }
        if (Type == 3) {
            $scope.SettingsVm.DefaultQty = value;
        }
        
        CheckScopeBeforeApply();
        $.ajax
        ({
            type: "POST",
            url: serviceBase + 'ConfigureSettings',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "model": $scope.SettingsVm }),
            success: function (response) {
                setTimeout(function () {
                    ShowSuccess("Saved");
                }, 100);
                localStorageService.set('AllowNegativeQuantity', $scope.SettingsVm.AllowNegative);
                localStorageService.set('AutoClear', $scope.SettingsVm.AutoClear);
                if ($scope.SettingsVm.DefaultQty == true) {

                    localStorageService.set('DefaultQty', "1");
                }
                else {
                    localStorageService.set('DefaultQty', "0");

                }
                $scope.UpdateSecurityToken($scope.accountID);
            },
            error: function (response) {
                log.error(response.statusText);
                $scope.ShowErrorMessage("Updating settings", 2, 1, response.statusText);
            }
        });
    }

    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open"))
        {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')

        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }


    function init()
    {
        $scope.accountID  = localStorageService.get('AccountDBID');
        var _autoClear = localStorageService.get('AutoClear');
        var _DefaultQty = localStorageService.get('DefaultQty');
        var _allowNegative = localStorageService.get('AllowNegativeQuantity');

        if (_allowNegative != null && _allowNegative != undefined) {
            if (_allowNegative == 'true' || _allowNegative == true) {
                $scope.SettingsVm.AllowNegative = true;
            }
            else {
                $scope.SettingsVm.AllowNegative = false;
            }
        }
        else {
            $scope.SettingsVm.AllowNegative = false;
        }

        if (_DefaultQty != null && _DefaultQty != undefined) {
            if (_DefaultQty == '1' || _DefaultQty == 1) {
                $scope.SettingsVm.DefaultQty = true;
            }
            else {
                $scope.SettingsVm.DefaultQty = false;
            }
        }
        else {
            $scope.SettingsVm.DefaultQty = false;
        }

        
        $scope.SettingsVm.AutoClear = _autoClear == "true" || _autoClear == true ? true : false;


        $scope.currentInvmode = localStorageService.get('DefaultInvmode');

        if ($scope.currentInvmode == "Vertical") {

            $scope.SettingsVm.Defaultmode = true;

        }

        else {
            $scope.SettingsVm.Defaultmode = false;
        }

        $scope.GetMyinventoryColumns();


        CheckScopeBeforeApply();

    }

    init();

    app.directive('customSwipe', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    $(element).swipe({
                        swipe: function (event, direction, distance, duration, fingerCount) {
                            //This only fires when the user swipes left
                            debugger;
                            if (direction == "left" || direction == "right") {

                                setTimeout(function () {

                                    element.find("input").trigger("click");




                                }, 10)
                            }
                        },
                        threshold: 100
                    });
                }
            };
        }
    ]);



}]);