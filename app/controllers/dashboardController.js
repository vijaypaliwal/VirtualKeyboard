'use strict';
app.controller('dashboardController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.UserName = "";
    $scope.logintext = false;
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

    mySwiper = new Swiper('.swiper-container', {
        initialSlide: 0,
        speed: 500,
        effect: 'flip',
        allowSwipeToPrev: false,
        onSlideChangeEnd: function (swiperHere) {

            if(swiperHere.activeIndex==0)
            {
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

    function init()
    {
        debugger;
        var _value = localStorageService.get("UserID");
        $scope.CurrentUserID = parseInt(_value);
        $scope.GetDataByUserID($scope.CurrentUserID);
        $scope.logintext = true;

        setTimeout(function() {
            $(".loginusername").fadeOut();
            CheckScopeBeforeApply();
        },3000)
    }

    init();
}
]);







