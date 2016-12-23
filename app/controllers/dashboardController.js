'use strict';
app.controller('dashboardController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.UserName = "";
    $scope.logintext = false;
    $scope.Inventories = [];
    $scope.InventoryName = "";
    $scope.masterdataloaded = false;
    $scope.Inventory={ InventoryID :6,

      InventoryName:"",  
      Owner:$scope.UserName,  
      ItemsUsed:4000 , 
      ItemsAvailable:4600  ,
      LocationsUsed:1200,  

      LocationsAvailable:1500  ,
      TotalUsers:0  ,

      Users:[] ,

      API:false,

      Integrations :"" ,

      InventoryType:1,

      IsActive:true, 

      AccountID: 4}

    $scope.Users = [];
    $scope.GetDataByUserID = function (ID) {
        debugger;
        $scope.UserName = "";
        switch (ID) {
            case 1:
                $scope.UserName = "Mr. Green";

                break;
            case 2:
                $scope.UserName = "Mr. Blue";
                break;
            case 3:
                $scope.UserName = "Mr. Purple";
                break;
            case 4:
                $scope.UserName = "Mr. Yellow";
                break;
            case 5:
                $scope.UserName = "Mr. Red";
                break;
            case 6:
                $scope.UserName = "Mr. Gray";
                break;
            default:
                $scope.UserName = "Mr. Green";

        }


        CheckScopeBeforeApply();
    }


    $scope.GetCurrentClass = function (ID) {
        debugger;
        $scope.CurrentCSS = "";
        switch (ID) {
            case 1:
                return "bgm-black";


                break;
            case 2:
                return "bgm-gold";
                break;
            case 3:
                return "bgm-pink";
                break;
            case 4:
                return  "bgm-purple";
                break;
            case 5:
                return "bgm-blue";
                break;
            case 6:
                return "bgm-lightblue";
                break;
            default:
                return "bgm-red";

        }


 
    }

    $scope.PushInventory=function()
    {
        debugger;
        var _Obj = angular.copy($scope.Inventory);
        _Obj.InventoryName = $scope.InventoryName;
        $scope.Inventories.push(_Obj);
        $("#Addinvmodal").modal('hide');

        CheckScopeBeforeApply();
    }

    $scope.addinventory = function () {
        
        $("#bottommenumodal").modal('hide');

        $("#Addinvmodal").modal('show');
        CheckScopeBeforeApply();
    }



    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars');
    });

    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }


    $scope.ActiveClass = "left0";
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    var mySwiper;

    function EnableSwiper() {

        mySwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            speed: 500,
            effect: 'flip',
            allowSwipeToPrev: false,
            onSlideChangeEnd: function (swiperHere) {

                if (swiperHere.activeIndex == 0) {
                    $scope.ActiveClass = "left0";
                }
                else if (swiperHere.activeIndex == 1) {
                    $scope.ActiveClass = "left33";
                }
                else if (swiperHere.activeIndex == 2) {
                    $scope.ActiveClass = "left66";
                }
                CheckScopeBeforeApply();

            }

        });
    }

    $scope.GotoStep = function (_Step) {
        if(_Step==0)
        {
            $scope.ActiveClass = 'left0';
            mySwiper.swipeTo(0, 1000, false);

        }
        if (_Step == 1) {
            $scope.ActiveClass = 'left33';
            mySwiper.swipeTo(1, 1000, false);

        }
        if (_Step == 2) {

            $scope.ActiveClass = 'left66';
            mySwiper.swipeTo(2, 1000, false);

        }
        CheckScopeBeforeApply();

    }

    $scope.GoToEditInventory=function(ID)
    {
        localStorageService.set("InventoryID", ID);
        $location.path("/manageinventory");
    }


    $scope.GetInventoryMaster = function () {
        $scope.masterdataloaded = false;
        $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'GetInventoryMasters',
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'json',
                  data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
                  success: function (response) {
                      $scope.masterdataloaded = true;
                      if (response.GetInventoryMastersResult.Success == true) {
                          $scope.Inventories = response.GetInventoryMastersResult.Payload;
                          $scope.Users = $scope.Inventories[0].Users;
                          console.log($scope.Users);
                          localStorageService.set("Inventories", $scope.Inventories);
                          CheckScopeBeforeApply()
                      }
                      else {

                          $scope.ShowErrorMessage("GetInventoryMasters", 1, 1, response.SendEmailResult.Message);

                      }

                  },
                  error: function (err) {

                      $scope.errorbox(err);
                      $scope.ShowErrorMessage("GetInventoryMasters", 2, 1, err.statusText);

                  },
                  complete:function()
                  {
                      EnableSwiper();
                  }
              });
    }

    function init()
    {
        debugger;
        var _value = localStorageService.get("UserID");
        $scope.CurrentUserID = parseInt(_value);
        $scope.GetDataByUserID($scope.CurrentUserID);
        $scope.logintext = true;
        $scope.GetInventoryMaster();
        setTimeout(function() {
            $(".loginusername").fadeOut();
            CheckScopeBeforeApply();
        },3000)
    }

    init();
}
]);







